import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { syncGA4DailyStats } from "@/lib/ga4";

// Lets Carla trigger a sync on demand from /admin/analytics instead of waiting for the daily
// scheduled function — mainly useful for confirming the GA4 credentials actually work right
// after setup. Defaults to yesterday (GA4's own processing needs a full day to settle), but
// accepts an explicit date for re-syncing an older day.
export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  let dateStr = typeof body?.date === "string" ? body.date : null;
  if (!dateStr) {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    dateStr = yesterday.toISOString().slice(0, 10);
  }

  const result = await syncGA4DailyStats(dateStr);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Sync falló." }, { status: 500 });
  }
  return NextResponse.json({ date: dateStr, stats: result.stats });
}
