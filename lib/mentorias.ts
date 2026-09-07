import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export interface MentoriaSlot {
  id: string;
  start_time: string;
  duration_minutes: number;
}

export async function getAvailableSlots(): Promise<MentoriaSlot[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("mentoria_slots")
    .select("id, start_time, duration_minutes")
    .eq("is_booked", false)
    .gt("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  if (error) {
    console.error("getAvailableSlots failed", error);
    return [];
  }
  return data ?? [];
}
