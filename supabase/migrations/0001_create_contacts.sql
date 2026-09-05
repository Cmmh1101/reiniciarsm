-- Contacts + events CRM (docs/CM-plan-admin-crm-analytics.md §3).
-- One contact per email; every quiz completion, newsletter signup, or
-- booking is a linked event, so a lead who does all three stays one row.

create table contacts (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  tags text[] default '{}',
  status text default 'nuevo',
  created_at timestamptz default now()
);

create table contact_events (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references contacts(id) not null,
  event_type text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

create index contact_events_contact_id_idx on contact_events(contact_id);
create index contact_events_type_idx on contact_events(event_type);
