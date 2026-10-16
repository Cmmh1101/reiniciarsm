import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { guardAdminWrite, readUuidList } from "@/lib/adminRequest";

// Deletes unbooked time slots. Slots that have (or had) a booking are kept so booking history stays intact.
export async function POST(request: Request) {
  const denied = await guardAdminWrite(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const ids = readUuidList(body?.slot_ids);
  if (!ids) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { data: withBookings } = await supabase.from("mentoria_bookings").select("slot_id").in("slot_id", ids);
  const protectedIds = new Set((withBookings ?? []).map((b) => b.slot_id as string));
  const deletable = ids.filter((id) => !protectedIds.has(id));
  if (deletable.length === 0) return NextResponse.json({ deleted: 0 });

  const { data, error } = await supabase.from("mentoria_slots").delete().in("id", deletable).eq("is_booked", false).select("id");
  if (error) {
    console.error("slots/delete failed", error);
    return NextResponse.json({ error: "Could not delete the times." }, { status: 500 });
  }
  return NextResponse.json({ deleted: data?.length ?? 0 });
}
