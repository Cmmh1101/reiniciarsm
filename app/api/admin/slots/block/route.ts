import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { guardAdminWrite, readUuidList } from "@/lib/adminRequest";

// Blocks or unblocks open time slots (a meeting, a day off). A booked slot can't be blocked — cancel the booking first.
export async function POST(request: Request) {
  const denied = await guardAdminWrite(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const ids = readUuidList(body?.slot_ids);
  if (!ids || typeof body?.blocked !== "boolean") return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const reason = body.blocked && typeof body.reason === "string" ? body.reason.trim().slice(0, 120) || null : null;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("mentoria_slots")
    .update({ is_blocked: body.blocked, blocked_reason: reason })
    .in("id", ids)
    .eq("is_booked", false)
    .select("id");

  if (error) {
    // 42703 = undefined column: migration 0020 hasn't been run.
    console.error("slots/block failed", error);
    return NextResponse.json({ error: error.code === "42703" ? "migration_missing" : "Could not update the times." }, { status: 500 });
  }
  return NextResponse.json({ updated: data?.length ?? 0 });
}
