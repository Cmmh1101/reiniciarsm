import { Resend } from "resend";

// Minimal stopgap for Mentoría confirmation emails until the n8n workflow
// (result email + nurture sequences) is built — everything else in this app
// still treats Resend as n8n's tool, not something called directly.
export async function sendConfirmationEmail(to: string, subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("sendConfirmationEmail: RESEND_API_KEY or FROM_EMAIL not set, skipping");
    return;
  }

  const resend = new Resend(apiKey);
  try {
    await resend.emails.send({ from, to, subject, text });
  } catch (err) {
    console.error("sendConfirmationEmail failed", err);
  }
}
