import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { sendConfirmationEmail } from "@/lib/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Replaces WordPress's contact form (Fluent Forms → FluentCRM). No third-party form service —
// same native pattern as the rest of the migration: upsert the contact, log a CRM event so it
// shows up on /admin/contactos, and email Carla directly so she actually sees the message.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Por favor escribe un correo válido." }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Escribe un mensaje." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: contact, error: contactError } = await supabase
    .from("contacts")
    .upsert({ email, name }, { onConflict: "email", ignoreDuplicates: false })
    .select("id")
    .single();

  if (contactError || !contact) {
    console.error("contact-submit: failed to upsert contact", contactError);
    return NextResponse.json({ error: "No se pudo enviar tu mensaje." }, { status: 500 });
  }

  const { error: eventError } = await supabase.from("contact_events").insert({
    contact_id: contact.id,
    event_type: "contact_form_submitted",
    metadata: { subject, message },
  });
  if (eventError) {
    console.error("contact-submit: failed to log event", eventError);
  }

  const notifyTo = process.env.FROM_EMAIL;
  if (notifyTo) {
    const notifySubject = subject ? `Contacto: ${subject}` : "Nuevo mensaje de contacto";
    const notifyText = `${name || "(sin nombre)"} <${email}>\n\n${message}`;
    await sendConfirmationEmail(notifyTo, notifySubject, notifyText);
  }

  return NextResponse.json({ ok: true });
}
