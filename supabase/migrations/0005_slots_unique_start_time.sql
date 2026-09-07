-- Prevents the bulk slot generator from creating duplicate slots on re-run.
alter table mentoria_slots add constraint mentoria_slots_start_time_key unique (start_time);
