import type { Config } from "@netlify/functions";
// Netlify Functions bundle separately from the Next.js app and don't resolve
// the "@/" tsconfig path alias, so these imports must be relative (same
// pattern as Montano-system-launch's nurture-nudge.mts).
import { processDueSequenceSteps } from "../../lib/sequenceEngine";

export default async () => {
  const { candidates, sent } = await processDueSequenceSteps();
  return new Response(JSON.stringify({ ok: true, candidates, sent }), { status: 200 });
};

// Runs once a day. Emails aren't time-sensitive to the hour, so a fixed daily
// pass is enough — the delay-in-days model doesn't need finer granularity.
export const config: Config = {
  schedule: "0 14 * * *",
};
