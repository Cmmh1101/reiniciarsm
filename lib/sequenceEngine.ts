import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { sendConfirmationEmail } from "@/lib/resend";
import { recordEmailSend } from "@/lib/emailTracking";
import { getSequenceSteps, type SequenceStep } from "@/lib/sequences";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";

type SupabaseAdmin = ReturnType<typeof createSupabaseAdminClient>;

// lang makes the unsubscribe confirmation page appear in the language of the email.
function unsubscribeUrl(email: string, language: Locale) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(email)}&lang=${language}`;
}

async function sendStepAndAdvance(
  supabase: SupabaseAdmin,
  contactId: string,
  email: string,
  name: string,
  sequence: string,
  steps: SequenceStep[],
  stepIndex: number,
  language: Locale
) {
  const step = steps[stepIndex];
  const resendId = await sendConfirmationEmail(email, step.subject, step.body(name, unsubscribeUrl(email, language)));
  await recordEmailSend({ resendId, contactId, emailType: "sequence", subject: step.subject });

  const nextIndex = stepIndex + 1;
  const update =
    nextIndex < steps.length
      ? {
          sequence,
          sequence_step: nextIndex,
          sequence_next_send_at: new Date(Date.now() + steps[nextIndex].delayDays * 24 * 60 * 60 * 1000).toISOString(),
        }
      : // Sequence finished. For a quiz_* sequence this is the "moves to the
        // newsletter list" handoff Carla described — no further automated
        // enrollment, they just stay subscribed=true and are eligible for
        // future broadcasts sent from /admin/newsletter.
        { sequence: null, sequence_step: 0, sequence_next_send_at: null };

  const { error: updateError } = await supabase.from("contacts").update(update).eq("id", contactId);
  if (updateError) {
    console.error("sendStepAndAdvance: failed to advance sequence state for", email, updateError);
  }

  const { error: eventError } = await supabase.from("contact_events").insert({
    contact_id: contactId,
    event_type: "sequence_email_sent",
    metadata: { sequence, step: stepIndex, subject: step.subject },
  });
  if (eventError) {
    console.error("sendStepAndAdvance: failed to log contact_event for", email, eventError);
  }
}

/** Enrolls a contact and sends step 0 immediately (synchronous, not via the scheduled function). */
export async function enrollInSequence(contactId: string, email: string, name: string, sequence: string, language: Locale = DEFAULT_LOCALE) {
  const steps = getSequenceSteps(sequence, language);
  if (!steps || steps.length === 0) return;
  const supabase = createSupabaseAdminClient();
  await sendStepAndAdvance(supabase, contactId, email, name, sequence, steps, 0, language);
}

/** Called by the daily scheduled function — sends every step that's due right now. */
export async function processDueSequenceSteps(): Promise<{ candidates: number; sent: number }> {
  const supabase = createSupabaseAdminClient();
  // preferred_language comes from migration 0019; until it exists every contact is Spanish.
  const query = (columns: string) =>
    supabase
      .from("contacts")
      .select(columns)
      .not("sequence", "is", null)
      .eq("subscribed", true)
      .lte("sequence_next_send_at", new Date().toISOString());
  let result = await query("id, email, name, sequence, sequence_step, preferred_language");
  if (result.error) result = await query("id, email, name, sequence, sequence_step");
  const { data, error } = result;
  const due = (data ?? []) as unknown as { id: string; email: string; name: string | null; sequence: string; sequence_step: number; preferred_language?: string }[];

  if (error) {
    console.error("processDueSequenceSteps: query failed", error);
    return { candidates: 0, sent: 0 };
  }

  let sent = 0;
  for (const contact of due) {
    const language: Locale = isLocale(contact.preferred_language) ? contact.preferred_language : "es";
    const steps = getSequenceSteps(contact.sequence, language);
    if (!steps) continue;
    try {
      await sendStepAndAdvance(supabase, contact.id, contact.email, contact.name ?? "", contact.sequence, steps, contact.sequence_step, language);
      sent++;
    } catch (err) {
      console.error("processDueSequenceSteps: failed for", contact.email, err);
    }
  }

  return { candidates: due.length, sent };
}
