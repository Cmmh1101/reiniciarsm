import type { Config } from "@netlify/functions";
// Relative imports only — Netlify Functions bundle separately from the Next.js app and don't
// resolve the "@/" tsconfig path alias for this file itself (same pattern as
// send-sequence-emails.mts). lib/ga4.ts's own internal "@/lib/..." imports resolve fine once
// bundling starts, same as lib/sequenceEngine.ts already does in production.
import { syncGA4DailyStats } from "../../lib/ga4";

export default async () => {
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const dateStr = yesterday.toISOString().slice(0, 10);

  const result = await syncGA4DailyStats(dateStr);
  return new Response(JSON.stringify({ date: dateStr, ...result }), { status: result.ok ? 200 : 500 });
};

// Runs once a day, a few hours after midnight UTC — gives GA4's own processing time to settle
// the prior day's data before we pull it (same daily-cadence reasoning as the email sequence
// sync: this isn't time-sensitive to the hour, one clean pass a day is enough).
export const config: Config = {
  schedule: "0 15 * * *",
};
