import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import type { SessionType } from "@/lib/pricing";

export interface MentoriaSlot {
  id: string;
  start_time: string;
  duration_minutes: number;
  session_type: SessionType;
}

interface SlotRow extends MentoriaSlot {
  is_booked: boolean;
  held_until: string | null;
}

// Columns added by later migrations (0016 session_type, 0017 held_until). Selecting them fails on a
// database that hasn't run the migration yet, so fall back to fewer columns until it has.
const COLUMN_SETS = [
  "id, start_time, duration_minutes, is_booked, session_type, held_until",
  "id, start_time, duration_minutes, is_booked, session_type",
  "id, start_time, duration_minutes, is_booked",
];

function endOf(s: { start_time: string; duration_minutes: number }) {
  return new Date(s.start_time).getTime() + s.duration_minutes * 60_000;
}

function overlaps(a: SlotRow, b: SlotRow) {
  return new Date(a.start_time).getTime() < endOf(b) && new Date(b.start_time).getTime() < endOf(a);
}

/**
 * Slots someone can book right now. A slot is unavailable if it is booked, held by someone in
 * checkout, or overlaps (in time) with any slot that is — e.g. a 30-minute Tech SOS slot inside an
 * hour that is already booked as a 1:1 session.
 */
export async function getAvailableSlots(): Promise<MentoriaSlot[]> {
  const supabase = createSupabaseAdminClient();
  const now = new Date();

  let rows: SlotRow[] | null = null;
  for (const columns of COLUMN_SETS) {
    const { data, error } = await supabase
      .from("mentoria_slots")
      .select(columns)
      .gt("start_time", new Date(now.getTime() - 60 * 60_000).toISOString())
      .order("start_time", { ascending: true });
    if (!error) {
      rows = (data ?? []).map((r) => {
        const row = r as unknown as Partial<SlotRow> & Pick<SlotRow, "id" | "start_time" | "duration_minutes" | "is_booked">;
        return { ...row, session_type: row.session_type ?? "session", held_until: row.held_until ?? null } as SlotRow;
      });
      break;
    }
  }
  if (!rows) {
    console.error("getAvailableSlots failed");
    return [];
  }

  const isBlocking = (s: SlotRow) => s.is_booked || (s.held_until !== null && new Date(s.held_until) > now);
  const blockers = rows.filter(isBlocking);

  return rows
    .filter((s) => new Date(s.start_time) > now && !isBlocking(s) && !blockers.some((b) => overlaps(s, b)))
    .map(({ id, start_time, duration_minutes, session_type }) => ({ id, start_time, duration_minutes, session_type }));
}

/** Holds a slot (and so everything overlapping it) while its buyer completes checkout. False if it is no longer free. */
export async function reserveSlot(slotId: string): Promise<boolean> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc("reserve_mentoria_slot", { p_slot_id: slotId });
  if (error) {
    // Migration 0017 not applied yet: fall back to a plain availability check.
    console.error("reserveSlot rpc failed, falling back to availability check", error.message);
    return (await getAvailableSlots()).some((s) => s.id === slotId);
  }
  return data === true;
}

export async function releaseSlot(slotId: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.rpc("release_mentoria_slot", { p_slot_id: slotId });
  if (error) console.error("releaseSlot failed", error.message);
}

/** Marks a slot as booked once payment has arrived. Returns null if it (or an overlapping slot) was already taken. */
export async function bookSlot(slotId: string): Promise<{ start_time: string; duration_minutes: number } | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc("book_mentoria_slot", { p_slot_id: slotId });
  if (!error) return Array.isArray(data) && data.length > 0 ? data[0] : null;

  // Migration 0017 not applied yet: original single-slot atomic update.
  console.error("bookSlot rpc failed, falling back to single-slot update", error.message);
  const { data: updated } = await supabase
    .from("mentoria_slots")
    .update({ is_booked: true })
    .eq("id", slotId)
    .eq("is_booked", false)
    .select("start_time, duration_minutes");
  return updated && updated.length > 0 ? updated[0] : null;
}
