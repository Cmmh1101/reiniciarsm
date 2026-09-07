import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { sendConfirmationEmail } from "@/lib/resend";
import { getSequenceSteps, type SequenceStep } from "@/lib/sequences";

type SupabaseAdmin = ReturnType<typeof createSupabaseAdminClient>;

function unsubscribeUrl(email: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(email)}`;
}

async function sendStepAndAdvance(
  supabase: SupabaseAdmin,
  contactId: string,
  email: string,
  name: string,
  sequence: string,
  steps: SequenceStep[],
  stepIndex: number
) {
  const step = steps[stepIndex];
  await sendConfirmationEmail(email, step.subject, step.body(name, unsubscribeUrl(email)));

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
export async function enrollInSequence(contactId: string, email: string, name: string, sequence: string) {
  const steps = getSequenceSteps(sequence);
  if (!steps || steps.length === 0) return;
  const supabase = createSupabaseAdminClient();
  await sendStepAndAdvance(supabase, contactId, email, name, sequence, steps, 0);
}

/** Called by the daily scheduled function — sends every step that's due right now. */
export async function processDueSequenceSteps(): Promise<{ candidates: number; sent: number }> {
  const supabase = createSupabaseAdminClient();
  const { data: due, error } = await supabase
    .from("contacts")
    .select("id, email, name, sequence, sequence_step")
    .not("sequence", "is", null)
    .eq("subscribed", true)
    .lte("sequence_next_send_at", new Date().toISOString());

  if (error) {
    console.error("processDueSequenceSteps: query failed", error);
    return { candidates: 0, sent: 0 };
  }

  let sent = 0;
  for (const contact of due ?? []) {
    const steps = getSequenceSteps(contact.sequence);
    if (!steps) continue;
    try {
      await sendStepAndAdvance(supabase, contact.id, contact.email, contact.name ?? "", contact.sequence, steps, contact.sequence_step);
      sent++;
    } catch (err) {
      console.error("processDueSequenceSteps: failed for", contact.email, err);
    }
  }

  return { candidates: due?.length ?? 0, sent };
}
