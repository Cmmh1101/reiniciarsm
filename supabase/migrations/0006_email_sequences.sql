-- Native email automation (Netlify Scheduled Functions + Resend), same
-- pattern already proven in Montano-system-launch's nurture-nudge function —
-- no n8n, no third-party marketing tool.

alter table contacts add column subscribed boolean not null default true;
alter table contacts add column sequence text;              -- e.g. 'quiz_mentalidad' | 'newsletter' | null
alter table contacts add column sequence_step int not null default 0;
alter table contacts add column sequence_next_send_at timestamptz;

create index contacts_sequence_due_idx on contacts(sequence_next_send_at) where sequence is not null;

-- History of one-off newsletter broadcasts sent from /admin/newsletter.
create table newsletter_issues (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  content text not null,
  recipient_count int not null default 0,
  sent_at timestamptz default now()
);
