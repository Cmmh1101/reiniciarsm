-- Tech SOS (30 min) and 1:1 sessions (60 min) share the same booking system.
-- Each availability slot is tagged with the kind of session it can be booked for.
-- Additive only: existing rows become 'session' (the original 60-minute mentoring slots).

alter table mentoria_slots
  add column session_type text not null default 'session'
  check (session_type in ('session', 'sos'));
