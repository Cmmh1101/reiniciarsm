import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export type EmailType = "sequence" | "newsletter" | "transactional";

export interface EmailSend {
  id: string;
  subject: string;
  email_type: EmailType;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  bounced_at: string | null;
  complained_at: string | null;
  created_at: string;
}

export async function getEmailSendsForContact(contactId: string): Promise<EmailSend[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("email_sends")
    .select("id, subject, email_type, delivered_at, opened_at, clicked_at, bounced_at, complained_at, created_at")
    .eq("contact_id", contactId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getEmailSendsForContact failed", error);
    return [];
  }
  return data ?? [];
}

/** Records a sent email so Resend's webhook can later attach delivered/opened/clicked/bounced timestamps to it. */
export async function recordEmailSend(params: {
  resendId: string | null;
  contactId: string;
  emailType: EmailType;
  subject: string;
  newsletterIssueId?: string;
}) {
  if (!params.resendId) return; // send itself failed — nothing to track
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("email_sends").insert({
    resend_id: params.resendId,
    contact_id: params.contactId,
    email_type: params.emailType,
    subject: params.subject,
    newsletter_issue_id: params.newsletterIssueId ?? null,
  });
  if (error) {
    console.error("recordEmailSend failed", error);
  }
}
