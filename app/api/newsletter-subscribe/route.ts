import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { enrollInSequence } from "@/lib/sequenceEngine";
import { upsertContact } from "@/lib/contactUpsert";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const locale = body?.locale === "en" ? "en" : "es";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: locale === "en" ? "Please enter a valid email." : "Por favor escribe un correo válido." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: contact, error: contactError } = await upsertContact(supabase, { email, name, locale, extra: { subscribed: true } });

  if (contactError || !contact) {
    console.error("newsletter-subscribe: failed to upsert contact", contactError);
    return NextResponse.json({ error: locale === "en" ? "We couldn't complete your subscription." : "No se pudo completar la suscripción." }, { status: 500 });
  }

  await supabase.from("contact_events").insert({
    contact_id: contact.id,
    event_type: "newsletter_signup",
    metadata: { locale },
  });

  // The welcome sequence goes out in the language they signed up in.
  try {
    await enrollInSequence(contact.id, email, name, "newsletter", locale);
  } catch (err) {
    console.error("newsletter-subscribe: enrollInSequence failed", err);
  }

  return NextResponse.json({ ok: true });
}
