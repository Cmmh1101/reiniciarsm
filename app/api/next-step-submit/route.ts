import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { computeProfile, isValidAnswers } from "@/lib/nextStep";
import { enrollInSequence } from "@/lib/sequenceEngine";
import { upsertContact } from "@/lib/contactUpsert";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const locale = body?.locale === "en" ? "en" : "es";

  if (!name || !EMAIL_RE.test(email) || !isValidAnswers(body?.answers)) {
    return NextResponse.json({ error: locale === "en" ? "Invalid details." : "Datos inválidos." }, { status: 400 });
  }

  // Recompute the profile server-side — never trust a client-supplied result.
  const profile = computeProfile(body.answers);
  const tag = `siguiente-paso-${profile}`;

  const supabase = createSupabaseAdminClient();
  const { data: contact, error: contactError } = await upsertContact(supabase, { email, name, locale, extra: { tags: [tag] }, select: "id, tags" });

  if (contactError || !contact) {
    console.error("next-step-submit: failed to upsert contact", contactError);
    return NextResponse.json({ error: locale === "en" ? "We couldn't save your result." : "No se pudo guardar tu resultado." }, { status: 500 });
  }

  // Merge tags rather than overwrite, in case this contact already has others.
  const mergedTags = Array.from(new Set([...(contact.tags ?? []), tag]));
  await supabase.from("contacts").update({ tags: mergedTags }).eq("id", contact.id);

  const { error: eventError } = await supabase.from("contact_events").insert({
    contact_id: contact.id,
    event_type: "next_step_completed",
    metadata: { profile, tag, answers: body.answers, locale },
  });
  if (eventError) console.error("next-step-submit: failed to insert contact_event", eventError);

  // Result email now; the two follow-ups go out via the daily scheduled function.
  try {
    await enrollInSequence(contact.id, email, name, `nextstep_${profile}`, locale);
  } catch (err) {
    console.error("next-step-submit: enrollInSequence failed", err);
  }

  return NextResponse.json({ profile });
}
