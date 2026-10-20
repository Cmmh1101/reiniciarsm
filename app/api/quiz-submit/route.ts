import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { computeWinner, isValidScores, type QuizScores } from "@/lib/diagnostic";
import { enrollInSequence } from "@/lib/sequenceEngine";
import { upsertContact } from "@/lib/contactUpsert";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const locale = body?.locale === "en" ? "en" : "es";
  const scores: QuizScores | null = isValidScores(body?.scores) ? body.scores : null;

  if (!name || !EMAIL_RE.test(email) || !scores) {
    return NextResponse.json({ error: locale === "en" ? "Invalid details." : "Datos inválidos." }, { status: 400 });
  }

  // Recompute the winner server-side — never trust a client-supplied archetype/tag.
  const winner = computeWinner(scores);

  const supabase = createSupabaseAdminClient();

  const { data: contact, error: contactError } = await upsertContact(supabase, { email, name, locale, extra: { tags: [winner.tag] }, select: "id, tags" });

  if (contactError || !contact) {
    console.error("quiz-submit: failed to upsert contact", contactError);
    return NextResponse.json({ error: locale === "en" ? "We couldn't save your diagnostic." : "No se pudo guardar tu diagnóstico." }, { status: 500 });
  }

  // Merge tags rather than overwrite, in case this contact already has others
  // (e.g. newsletter signup) from a previous event.
  const mergedTags = Array.from(new Set([...(contact.tags ?? []), winner.tag]));
  await supabase.from("contacts").update({ tags: mergedTags }).eq("id", contact.id);

  const { error: eventError } = await supabase.from("contact_events").insert({
    contact_id: contact.id,
    event_type: "quiz_completed",
    metadata: { archetype: winner.archetype, pillar: winner.key, tag: winner.tag, scores, locale },
  });

  if (eventError) {
    console.error("quiz-submit: failed to insert contact_event", eventError);
  }

  // Native automation (Netlify Scheduled Functions + Resend + Supabase state,
  // same pattern as Montano-system-launch's nurture-nudge) replaces the n8n
  // plan — sends the immediate result email now and enrolls the contact in
  // the archetype-specific drip; delayed steps are sent by
  // netlify/functions/send-sequence-emails.mts. Awaited (not fire-and-forget):
  // a serverless function can freeze right after `return`, so an un-awaited
  // async call risks never actually completing. Errors are swallowed rather
  // than failing the request — the lead should still see their result even
  // if the confirmation email couldn't be sent.
  // The result email goes out now and the follow-ups later, in the language they took the diagnostic in.
  try {
    await enrollInSequence(contact.id, email, name, `quiz_${winner.key}`, locale);
  } catch (err) {
    console.error("quiz-submit: enrollInSequence failed", err);
  }

  return NextResponse.json({ pillar: winner.key, archetype: winner.archetype });
}
