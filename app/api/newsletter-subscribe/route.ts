import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { enrollInSequence } from "@/lib/sequenceEngine";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Por favor escribe un correo válido." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: contact, error: contactError } = await supabase
    .from("contacts")
    .upsert({ email, name, subscribed: true }, { onConflict: "email", ignoreDuplicates: false })
    .select("id")
    .single();

  if (contactError || !contact) {
    console.error("newsletter-subscribe: failed to upsert contact", contactError);
    return NextResponse.json({ error: "No se pudo completar la suscripción." }, { status: 500 });
  }

  await supabase.from("contact_events").insert({
    contact_id: contact.id,
    event_type: "newsletter_signup",
    metadata: {},
  });

  try {
    await enrollInSequence(contact.id, email, name, "newsletter");
  } catch (err) {
    console.error("newsletter-subscribe: enrollInSequence failed", err);
  }

  return NextResponse.json({ ok: true });
}
