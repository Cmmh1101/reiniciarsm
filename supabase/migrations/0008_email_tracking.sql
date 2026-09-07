-- Tracks every individual email sent (sequence step, newsletter broadcast, or
-- transactional confirmation) so Resend's webhook events (delivered/opened/
-- clicked/bounced/complained) can be matched back to a specific contact and
-- shown in the admin panel — the same "webhook + Supabase state" pattern
-- already used for Stripe.

create table email_sends (
  id uuid primary key default gen_random_uuid(),
  resend_id text unique,
  contact_id uuid references contacts(id) not null,
  email_type text not null,               -- 'sequence' | 'newsletter' | 'transactional'
  subject text not null,
  newsletter_issue_id uuid references newsletter_issues(id),
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  bounced_at timestamptz,
  complained_at timestamptz,
  created_at timestamptz default now()
);

create index email_sends_resend_id_idx on email_sends(resend_id);
create index email_sends_contact_id_idx on email_sends(contact_id);
create index email_sends_newsletter_issue_id_idx on email_sends(newsletter_issue_id);
