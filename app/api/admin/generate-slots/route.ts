import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { generateSlotTimes, WEEKDAYS } from "@/lib/availability";
import { SESSION_DURATION_MINUTES, SOS_DURATION_MINUTES } from "@/lib/pricing";

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
  const sessionType = body?.session_type === "sos" ? "sos" : "session";
  const durationMinutes = sessionType === "sos" ? SOS_DURATION_MINUTES : SESSION_DURATION_MINUTES;

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

  const slotTimes = generateSlotTimes({ days, windows, rangeStart, rangeEnd, durationMinutes });
  if (slotTimes.length === 0) {
    return NextResponse.json({ created: 0, skipped: 0 });
  }

  const supabase = createSupabaseAdminClient();

  // Skip any new slot that would overlap an existing one at a different start (e.g. a 30-minute
  // slot at 10:30 inside an existing 10:00-11:00 session) — overlapping slots would be bookable twice.
  const { data: existing } = await supabase
    .from("mentoria_slots")
    .select("start_time, duration_minutes")
    .gte("start_time", new Date(new Date(slotTimes[0]).getTime() - 2 * 60 * 60_000).toISOString());
  const taken = (existing ?? []).map((e) => ({ start: new Date(e.start_time).getTime(), end: new Date(e.start_time).getTime() + e.duration_minutes * 60_000 }));
  const durationMs = durationMinutes * 60_000;
  const newTimes = slotTimes.filter((t) => {
    const start = new Date(t).getTime();
    return !taken.some((x) => x.start !== start && start < x.end && x.start < start + durationMs);
  });
  if (newTimes.length === 0) {
    return NextResponse.json({ created: 0, skipped: slotTimes.length });
  }

  const { data, error } = await supabase
    .from("mentoria_slots")
    .upsert(
      newTimes.map((start_time) => ({ start_time, duration_minutes: durationMinutes, ...(sessionType === "sos" ? { session_type: sessionType } : {}) })),
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
