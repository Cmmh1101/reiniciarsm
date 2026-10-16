-- Never double-book. Two protections, both additive:
--  1. A slot can be HELD for a few minutes while someone completes Stripe checkout, so two people
--     can't pay for the same time.
--  2. Slots of different lengths (Tech SOS 30 min / 1:1 session 60 min) that overlap in time block
--     each other, so booking 10:00-11:00 also removes the 10:00 and 10:30 Tech SOS slots.
-- All functions take one advisory lock so concurrent bookings are decided one at a time.

alter table mentoria_slots add column held_until timestamptz;

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
  if not found or s.is_booked or (s.held_until is not null and s.held_until > now()) then
    return false;
  end if;

  select exists (
    select 1 from mentoria_slots o
    where o.id <> s.id
      and (o.is_booked or (o.held_until is not null and o.held_until > now()))
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

-- Called once payment has arrived. Succeeds unless the slot, or any slot overlapping it, is already
-- booked. A hold (this payer's or anyone else's) does not block: the money has already been paid.
create or replace function book_mentoria_slot(p_slot_id uuid)
returns table (start_time timestamptz, duration_minutes int)
language plpgsql
as $$
declare
  s mentoria_slots%rowtype;
  conflict boolean;
begin
  perform pg_advisory_xact_lock(hashtext('mentoria_slots'));

  select * into s from mentoria_slots where id = p_slot_id;
  if not found or s.is_booked then
    return;
  end if;

  select exists (
    select 1 from mentoria_slots o
    where o.id <> s.id
      and o.is_booked
      and o.start_time < s.start_time + make_interval(mins => s.duration_minutes)
      and o.start_time + make_interval(mins => o.duration_minutes) > s.start_time
  ) into conflict;
  if conflict then
    return;
  end if;

  update mentoria_slots set is_booked = true, held_until = null where id = s.id;
  return query select s.start_time, s.duration_minutes;
end;
$$;

create or replace function release_mentoria_slot(p_slot_id uuid)
returns void
language sql
as $$
  update mentoria_slots set held_until = null where id = p_slot_id and not is_booked;
$$;
