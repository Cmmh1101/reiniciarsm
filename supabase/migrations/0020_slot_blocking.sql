-- Admin can block a single already-generated time (a meeting, a day off) without deleting it.
-- A blocked slot is invisible to the public, and — like a booked slot — also blocks any slot that
-- overlaps it in time (a blocked 10:00–11:00 hour removes the 10:00 and 10:30 Tech SOS slots too).
-- Additive only: every existing slot stays unblocked.

alter table mentoria_slots add column is_blocked boolean not null default false;
alter table mentoria_slots add column blocked_reason text;

-- reserve_mentoria_slot (migration 0017) now also refuses a blocked slot, and treats an overlapping
-- blocked slot as a conflict.
create or replace function reserve_mentoria_slot(p_slot_id uuid, p_hold_minutes int default 35)
returns boolean
language plpgsql
as $$
declare
  s mentoria_slots%rowtype;
  conflict boolean;
begin
  perform pg_advisory_xact_lock(hashtext('mentoria_slots'));

  select * into s from mentoria_slots where id = p_slot_id;
  if not found or s.is_booked or s.is_blocked or (s.held_until is not null and s.held_until > now()) then
    return false;
  end if;

  select exists (
    select 1 from mentoria_slots o
    where o.id <> s.id
      and (o.is_booked or o.is_blocked or (o.held_until is not null and o.held_until > now()))
      and o.start_time < s.start_time + make_interval(mins => s.duration_minutes)
      and o.start_time + make_interval(mins => o.duration_minutes) > s.start_time
  ) into conflict;
  if conflict then
    return false;
  end if;

  update mentoria_slots set held_until = now() + make_interval(mins => p_hold_minutes) where id = s.id;
  return true;
end;
$$;
