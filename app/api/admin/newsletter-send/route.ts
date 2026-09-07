import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { sendHtmlEmail } from "@/lib/resend";
import { recordEmailSend } from "@/lib/emailTracking";
import { wrapEmailShell, escapeHtml, htmlToPlainTextFallback, styleTiptapHtml } from "@/lib/emailHtml";

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const html = typeof body?.html === "string" ? body.html.trim() : "";

  if (!subject || !html) {
    return NextResponse.json({ error: "Asunto y contenido son requeridos." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: recipients, error } = await supabase.from("contacts").select("id, email, name").eq("subscribed", true);

  if (error) {
    console.error("newsletter-send: query failed", error);
    return NextResponse.json({ error: "No se pudo cargar la lista de suscriptores." }, { status: 500 });
  }

  // Created up front (recipient_count patched after) so every send can
  // reference this issue's id for per-issue open/click stats.
  const { data: issue, error: issueError } = await supabase
    .from("newsletter_issues")
    .insert({ subject, content: html, recipient_count: 0 })
    .select("id")
    .single();

  if (issueError || !issue) {
    console.error("newsletter-send: failed to create issue row", issueError);
    return NextResponse.json({ error: "No se pudo registrar el envío." }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const styledContentHtml = styleTiptapHtml(html);
  let sent = 0;

  for (const contact of recipients ?? []) {
    const unsubscribeUrl = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(contact.email)}`;
    const greetingHtml = `<p style="margin:0 0 20px;">${contact.name?.trim() ? `Hola ${escapeHtml(contact.name.trim())},` : "Hola,"}</p>`;
    const signatureHtml = `<p style="margin:24px 0 0;">—<br>Carla</p>`;
    const unsubscribeHtml = `<p style="margin:16px 0 0;font-size:12px;opacity:0.6;">¿No quieres recibir más correos? <a href="${unsubscribeUrl}" style="color:#BE5A34;">Date de baja aquí</a>.</p>`;
    const fullHtml = wrapEmailShell(greetingHtml + styledContentHtml + signatureHtml + unsubscribeHtml);
    const textFallback = htmlToPlainTextFallback(greetingHtml + styledContentHtml + signatureHtml) + `\n\nDate de baja: ${unsubscribeUrl}`;

    try {
      const resendId = await sendHtmlEmail(contact.email, subject, fullHtml, textFallback);
      await recordEmailSend({ resendId, contactId: contact.id, emailType: "newsletter", subject, newsletterIssueId: issue.id });
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

  await supabase.from("newsletter_issues").update({ recipient_count: sent }).eq("id", issue.id);

  return NextResponse.json({ sent, total: recipients?.length ?? 0 });
}
