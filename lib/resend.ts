import { Resend } from "resend";
import { textToEmailHtml } from "@/lib/emailHtml";

// Every automated email (sequences, manual-payment confirmations) goes
// through this one function — everything else in this app still treats
// Resend as n8n's original job, not something called directly elsewhere.
// Returns the Resend message id (for email_sends tracking) or null on failure.
export async function sendConfirmationEmail(to: string, subject: string, text: string): Promise<string | null> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("sendConfirmationEmail: RESEND_API_KEY or FROM_EMAIL not set, skipping");
    return null;
  }

  const resend = new Resend(apiKey);
  try {
    const { data, error } = await resend.emails.send({ from, to, subject, text, html: textToEmailHtml(text) });
    if (error) {
      console.error("sendConfirmationEmail: Resend returned an error", error);
      return null;
    }
    return data?.id ?? null;
  } catch (err) {
    console.error("sendConfirmationEmail failed", err);
    return null;
  }
}

/** For the newsletter composer, where the body is already real HTML from Tiptap. */
export async function sendHtmlEmail(to: string, subject: string, html: string, text: string): Promise<string | null> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("sendHtmlEmail: RESEND_API_KEY or FROM_EMAIL not set, skipping");
    return null;
  }

  const resend = new Resend(apiKey);
  try {
    const { data, error } = await resend.emails.send({ from, to, subject, html, text });
    if (error) {
      console.error("sendHtmlEmail: Resend returned an error", error);
      return null;
    }
    return data?.id ?? null;
  } catch (err) {
    console.error("sendHtmlEmail failed", err);
    return null;
  }
}
