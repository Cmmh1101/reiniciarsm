import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { sendHtmlEmail } from "@/lib/resend";
import { wrapEmailShell, htmlToPlainTextFallback, styleTiptapHtml, applyNameToken } from "@/lib/emailHtml";

// Sends the exact same styled HTML a real broadcast would produce, to one address only — no
// contacts/newsletter_issues/contact_events/email_sends writes, since there's no real recipient
// behind it. Subject gets a "[PRUEBA]" prefix so it's unmistakable in the inbox.
export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const html = typeof body?.html === "string" ? body.html.trim() : "";
  const testEmail = typeof body?.testEmail === "string" ? body.testEmail.trim() : "";

  if (!subject || !html) {
    return NextResponse.json({ error: "Asunto y contenido son requeridos." }, { status: 400 });
  }
  if (!testEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
    return NextResponse.json({ error: "Ingresa un correo válido para la prueba." }, { status: 400 });
  }

  // No real contact behind a test send — stands in for {{Nombre}} so the preview shows how the
  // token reads in context instead of leaving the literal placeholder in the email.
  const styledContentHtml = applyNameToken(styleTiptapHtml(html), "Camila");
  const greetingHtml = `<p style="margin:0 0 20px;">Hola,</p>`;
  const signatureHtml = `<p style="margin:24px 0 0;">—<br>Carla</p>`;
  const testNoticeHtml = `<p style="margin:16px 0 0;font-size:12px;opacity:0.6;">Este es un correo de prueba — no se envió a tus suscriptores. El token {{Nombre}} se reemplazó aquí por "Camila" como ejemplo.</p>`;
  const fullHtml = wrapEmailShell(greetingHtml + styledContentHtml + signatureHtml + testNoticeHtml);
  const textFallback = htmlToPlainTextFallback(greetingHtml + styledContentHtml + signatureHtml);

  const resendId = await sendHtmlEmail(testEmail, `[PRUEBA] ${subject}`, fullHtml, textFallback);
  if (!resendId) {
    return NextResponse.json({ error: "No se pudo enviar el correo de prueba." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
