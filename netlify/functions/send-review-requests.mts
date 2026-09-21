import type { Config } from "@netlify/functions";
// Relative imports only — Netlify Functions bundle separately from the Next.js app and don't
// resolve the "@/" tsconfig path alias for this file itself (same pattern as
// send-sequence-emails.mts and sync-ga4-stats.mts).
import { processDueReviewRequests } from "../../lib/reviewRequests";

export default async () => {
  const { candidates, sent } = await processDueReviewRequests();
  return new Response(JSON.stringify({ ok: true, candidates, sent }), { status: 200 });
};

// Runs once a day — the delay-in-days model doesn't need finer granularity than that.
export const config: Config = {
  schedule: "0 16 * * *",
};
