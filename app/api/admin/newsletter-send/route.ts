import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { sendConfirmationEmail } from "@/lib/resend";

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!subject || !content) {
    return NextResponse.json({ error: "Asunto y contenido son requeridos." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: recipients, error } = await supabase.from("contacts").select("id, email, name").eq("subscribed", true);

  if (error) {
    console.error("newsletter-send: query failed", error);
    return NextResponse.json({ error: "No se pudo cargar la lista de suscriptores." }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  let sent = 0;

  for (const contact of recipients ?? []) {
    const unsubscribeUrl = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(contact.email)}`;
    const greeting = contact.name?.trim() ? `Hola ${contact.name.trim()},\n\n` : "Hola,\n\n";
    try {
      await sendConfirmationEmail(
        contact.email,
        subject,
        `${greeting}${content}\n\n—\nCarla\n\n¿No quieres recibir más correos? Date de baja aquí: ${unsubscribeUrl}`
      );
      await supabase.from("contact_events").insert({
        contact_id: contact.id,
        event_type: "newsletter_sent",
        metadata: { subject },
      });
      sent++;
    } catch (err) {
      console.error("newsletter-send: failed for", contact.email, err);
    }
  }

  await supabase.from("newsletter_issues").insert({ subject, content, recipient_count: sent });

  return NextResponse.json({ sent, total: recipients?.length ?? 0 });
}
