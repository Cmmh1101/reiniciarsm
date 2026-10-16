import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { guardAdminWrite, isUuid } from "@/lib/adminRequest";

// Cancels a booking and opens its time again. It does not refund the payment or email the client.
export async function POST(request: Request) {
  const denied = await guardAdminWrite(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!isUuid(body?.booking_id)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { data: booking } = await supabase.from("mentoria_bookings").select("id, slot_id, status").eq("id", body.booking_id).single();
  if (!booking || booking.status === "cancelled") return NextResponse.json({ error: "Booking not found." }, { status: 404 });

  const { error: bookingError } = await supabase.from("mentoria_bookings").update({ status: "cancelled" }).eq("id", booking.id);
  if (bookingError) {
    console.error("cancel-booking: booking update failed", bookingError);
    return NextResponse.json({ error: "Could not cancel the booking." }, { status: 500 });
  }

  // Only free the time if no other active booking still points at it.
  const { data: others } = await supabase.from("mentoria_bookings").select("id").eq("slot_id", booking.slot_id).neq("status", "cancelled");
  if (!others || others.length === 0) {
    const { error: slotError } = await supabase.from("mentoria_slots").update({ is_booked: false }).eq("id", booking.slot_id);
    if (slotError) console.error("cancel-booking: slot update failed", slotError);
  }
  return NextResponse.json({ ok: true });
}
