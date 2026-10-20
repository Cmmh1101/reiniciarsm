import { NextResponse } from "next/server";
import { adminError } from "@/lib/admin/apiError";
import { guardAdminWrite } from "@/lib/adminRequest";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { sendHtmlEmail } from "@/lib/resend";
import { recordEmailSend } from "@/lib/emailTracking";
import { wrapEmailShell, htmlToPlainTextFallback, styleTiptapHtml, applyNameToken } from "@/lib/emailHtml";
import { NEWSLETTER_AUDIENCES, NEWSLETTER_LANGUAGES, type NewsletterAudience, type NewsletterLanguage } from "@/lib/newsletterAudience";

export async function POST(request: Request) {
  const denied = await guardAdminWrite(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const html = typeof body?.html === "string" ? body.html.trim() : "";
  const preheader = typeof body?.preheader === "string" ? body.preheader.trim().slice(0, 140) : "";
  const audience: NewsletterAudience = NEWSLETTER_AUDIENCES.includes(body?.audience) ? body.audience : "all";
  const language: NewsletterLanguage = NEWSLETTER_LANGUAGES.includes(body?.language) ? body.language : "all";

  if (!subject || !html) {
    return adminError(400, "Subject and content are required.", "Asunto y contenido son requeridos.");
  }

  const supabase = createSupabaseAdminClient();

  // preferred_language comes from migration 0019. It is only needed for a language-specific send
  // or to pick each recipient's unsubscribe wording, so select it only once the column exists.
  const probe = await supabase.from("contacts").select("preferred_language").limit(1);
  const hasLanguageColumn = !probe.error;
  if (language !== "all" && !hasLanguageColumn) {
    return adminError(400, "Run migration 0019 in Supabase to send by language.", "Falta correr la migración 0019 en Supabase para enviar por idioma.");
  }

  let recipientsQuery = supabase
    .from("contacts")
    .select(hasLanguageColumn ? "id, email, name, preferred_language" : "id, email, name")
    .eq("subscribed", true);
  if (language !== "all") recipientsQuery = recipientsQuery.eq("preferred_language", language);
  if (audience === "clients" || audience === "non_buyers") {
    const { data: purchases, error: purchasesError } = await supabase
      .from("product_purchases")
      .select("contact_id")
      .eq("status", "completed");
    if (purchasesError) {
      console.error("newsletter-send: purchases query failed", purchasesError);
      return adminError(500, "Couldn't load the list of buyers.", "No se pudo cargar la lista de compradores.");
    }
    const buyerIds = [...new Set((purchases ?? []).map((p) => p.contact_id))];
    if (audience === "clients") {
      recipientsQuery = buyerIds.length > 0 ? recipientsQuery.in("id", buyerIds) : recipientsQuery.eq("id", "00000000-0000-0000-0000-000000000000");
    } else if (buyerIds.length > 0) {
      recipientsQuery = recipientsQuery.not("id", "in", `(${buyerIds.join(",")})`);
    }
  }

  const { data, error } = await recipientsQuery;
  const recipients = (data ?? []) as unknown as { id: string; email: string; name: string | null; preferred_language?: string }[];

  if (error) {
    console.error("newsletter-send: query failed", error);
    return adminError(500, "Couldn't load the list of subscribers.", "No se pudo cargar la lista de suscriptores.");
  }

  // Created up front (recipient_count patched after) so every send can
  // reference this issue's id for per-issue open/click stats.
  const { data: issue, error: issueError } = await supabase
    .from("newsletter_issues")
    .insert({ subject, content: html, recipient_count: 0, audience, ...(language !== "all" ? { language } : {}) })
    .select("id")
    .single();

  if (issueError || !issue) {
    console.error("newsletter-send: failed to create issue row", issueError);
    return adminError(500, "Couldn't record the send.", "No se pudo registrar el envío.");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const styledContentHtml = styleTiptapHtml(html);
  let sent = 0;

  for (const contact of recipients) {
    const contactLang = contact.preferred_language === "en" ? "en" : "es";
    const unsubscribeUrl = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(contact.email)}&lang=${contactLang}`;
    const personalizedContentHtml = applyNameToken(styledContentHtml, contact.name);
    const signatureHtml = `<p style="margin:24px 0 0;">—<br>Carla</p>`;
    const unsubscribeHtml = `<p style="margin:16px 0 0;font-size:12px;opacity:0.6;">${
      contactLang === "en"
        ? `Don't want more emails? <a href="${unsubscribeUrl}" style="color:#984222;">Unsubscribe here</a>.`
        : `¿No quieres recibir más correos? <a href="${unsubscribeUrl}" style="color:#984222;">Date de baja aquí</a>.`
    }</p>`;
    const fullHtml = wrapEmailShell(personalizedContentHtml + signatureHtml + unsubscribeHtml, { preheader, lang: contactLang });
    const textFallback = htmlToPlainTextFallback(personalizedContentHtml + signatureHtml) + `\n\n${contactLang === "en" ? "Unsubscribe" : "Date de baja"}: ${unsubscribeUrl}`;

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

  return NextResponse.json({ sent, total: recipients.length });
}
