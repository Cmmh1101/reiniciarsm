-- Mentoría booking + Stripe payments (docs/CM-plan-admin-crm-analytics.md §3).
-- MVP: slots are created manually in Supabase (no Google Calendar sync yet —
-- that's an n8n workflow for a later phase, per docs/plan-migracion-stack-tecnico.md §7).

create table mentoria_slots (
  id uuid primary key default gen_random_uuid(),
  start_time timestamptz not null,
  duration_minutes int default 60,
  is_booked boolean default false,
  google_calendar_event_id text
);

create table mentoria_bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid references mentoria_slots(id) not null,
  contact_id uuid references contacts(id) not null,
  stripe_payment_id text,
  status text default 'confirmed',
  created_at timestamptz default now()
);

create table stripe_payments (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references contacts(id) not null,
  amount_cents int not null,
  product text not null,               -- 'mentoria_1_1' | 'mentoria_pack_4'
  stripe_payment_id text,
  status text default 'completed',
  created_at timestamptz default now()
);

create index mentoria_slots_available_idx on mentoria_slots(start_time) where is_booked = false;
create index mentoria_bookings_contact_id_idx on mentoria_bookings(contact_id);
create index stripe_payments_contact_id_idx on stripe_payments(contact_id);
