import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { generateSlotTimes, WEEKDAYS } from "@/lib/availability";

const VALID_DAYS = new Set<string>(WEEKDAYS.map((w) => w.value));
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const days: string[] = Array.isArray(body?.days) ? body.days : [];
  const windows: { start: string; end: string }[] = Array.isArray(body?.windows) ? body.windows : [];
  const rangeStart = body?.range_start;
  const rangeEnd = body?.range_end;

  if (
    days.length === 0 ||
    !days.every((d) => VALID_DAYS.has(d)) ||
    windows.length === 0 ||
    !windows.every((w) => TIME_RE.test(w.start) && TIME_RE.test(w.end) && w.start < w.end) ||
    !DATE_RE.test(rangeStart) ||
    !DATE_RE.test(rangeEnd) ||
    rangeStart > rangeEnd
  ) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const slotTimes = generateSlotTimes({ days, windows, rangeStart, rangeEnd });
  if (slotTimes.length === 0) {
    return NextResponse.json({ created: 0, skipped: 0 });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("mentoria_slots")
    .upsert(
      slotTimes.map((start_time) => ({ start_time, duration_minutes: 60 })),
      { onConflict: "start_time", ignoreDuplicates: true }
    )
    .select("id");

  if (error) {
    console.error("generate-slots: insert failed", error);
    return NextResponse.json({ error: "No se pudieron crear los horarios." }, { status: 500 });
  }

  const created = data?.length ?? 0;
  return NextResponse.json({ created, skipped: slotTimes.length - created });
}
