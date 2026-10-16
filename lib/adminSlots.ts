import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import type { SessionType } from "@/lib/pricing";

export type SlotState = "open" | "booked" | "blocked" | "held";

export interface AdminSlot {
  id: string;
  start_time: string;
  duration_minutes: number;
  session_type: SessionType;
  state: SlotState;
  blocked_reason: string | null;
  held_until: string | null;
  booking: { id: string; name: string | null; email: string } | null;
}

interface RawSlot {
  id: string;
  start_time: string;
  duration_minutes: number;
  is_booked: boolean;
  is_blocked?: boolean;
  blocked_reason?: string | null;
  session_type?: SessionType;
  held_until?: string | null;
  mentoria_bookings?: { id: string; status: string; contacts: { name: string | null; email: string } | { name: string | null; email: string }[] | null }[] | null;
}

// Columns added by later migrations (0016 session_type, 0017 held_until, 0020 is_blocked / blocked_reason).
// Selecting a missing column fails, so fall back to fewer columns on a database that is behind.
const BASE = "id, start_time, duration_minutes, is_booked";
const COLUMN_SETS = [
  `${BASE}, session_type, held_until, is_blocked, blocked_reason`,
  `${BASE}, session_type, held_until`,
  `${BASE}, session_type`,
  BASE,
];
const BOOKINGS = ", mentoria_bookings(id, status, contacts(name, email))";

/** Every slot starting in [fromISO, toISO), with its state and (when booked) who booked it. */
export async function getSlotsForAdmin(fromISO: string, toISO: string): Promise<{ slots: AdminSlot[]; hasBlocking: boolean }> {
  const supabase = createSupabaseAdminClient();
  const now = new Date();

  for (const columns of COLUMN_SETS) {
    const { data, error } = await supabase
      .from("mentoria_slots")
      .select(columns + BOOKINGS)
      .gte("start_time", fromISO)
      .lt("start_time", toISO)
      .order("start_time", { ascending: true });
    if (error) continue;

    const slots = ((data ?? []) as unknown as RawSlot[]).map((r): AdminSlot => {
      const confirmed = (r.mentoria_bookings ?? []).find((b) => b.status !== "cancelled");
      const contact = confirmed ? (Array.isArray(confirmed.contacts) ? confirmed.contacts[0] : confirmed.contacts) : null;
      const held = !!r.held_until && new Date(r.held_until) > now;
      const state: SlotState = r.is_booked ? "booked" : r.is_blocked ? "blocked" : held ? "held" : "open";
      return {
        id: r.id,
        start_time: r.start_time,
        duration_minutes: r.duration_minutes,
        session_type: r.session_type ?? "session",
        state,
        blocked_reason: r.blocked_reason ?? null,
        held_until: held ? r.held_until ?? null : null,
        booking: confirmed ? { id: confirmed.id, name: contact?.name ?? null, email: contact?.email ?? "" } : null,
      };
    });
    return { slots, hasBlocking: columns.includes("is_blocked") };
  }

  console.error("getSlotsForAdmin failed");
  return { slots: [], hasBlocking: false };
}

/** Counts of slots by state over the next `days` days — for the page summary. */
export async function getUpcomingSummary(days = 120): Promise<{ open: number; booked: number; blocked: number }> {
  const from = new Date();
  const to = new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
  const { slots } = await getSlotsForAdmin(from.toISOString(), to.toISOString());
  return {
    open: slots.filter((s) => s.state === "open").length,
    booked: slots.filter((s) => s.state === "booked").length,
    blocked: slots.filter((s) => s.state === "blocked").length,
  };
}
