import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import type { SessionType } from "@/lib/pricing";

export interface MentoriaSlot {
  id: string;
  start_time: string;
  duration_minutes: number;
  session_type: SessionType;
}

/**
 * Open future slots. `session_type` comes from migration 0016 — until it has been applied, every
 * slot is treated as a regular 60-minute session so the original booking flow keeps working.
 */
export async function getAvailableSlots(): Promise<MentoriaSlot[]> {
  const supabase = createSupabaseAdminClient();
  const base = () => supabase.from("mentoria_slots");
  const filters = { booked: false, now: new Date().toISOString() };

  const withType = await base()
    .select("id, start_time, duration_minutes, session_type")
    .eq("is_booked", filters.booked)
    .gt("start_time", filters.now)
    .order("start_time", { ascending: true });

  if (!withType.error) return (withType.data ?? []) as MentoriaSlot[];

  const legacy = await base()
    .select("id, start_time, duration_minutes")
    .eq("is_booked", filters.booked)
    .gt("start_time", filters.now)
    .order("start_time", { ascending: true });

  if (legacy.error) {
    console.error("getAvailableSlots failed", legacy.error);
    return [];
  }
  return (legacy.data ?? []).map((s) => ({ ...s, session_type: "session" as const }));
}
