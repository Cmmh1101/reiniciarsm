import crypto from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

// Reads GA4 traffic via the Analytics Data API using a service account — no OAuth user
// consent flow needed since this runs unattended from a daily scheduled function, not a
// logged-in user's session. Implemented as a plain JWT-bearer exchange with Node's built-in
// crypto rather than pulling in google-auth-library/googleapis: this is the one thing we need
// from it, and the manual flow is ~30 lines against a stable, documented Google OAuth endpoint.

interface GA4ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri: string;
}

export interface GA4DailyStats {
  sessions: number;
  pageViews: number;
  topPages: { path: string; views: number }[];
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

async function getAccessToken(creds: GA4ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: creds.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: creds.token_uri,
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(creds.private_key);
  const jwt = `${unsigned}.${base64url(signature)}`;

  const res = await fetch(creds.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    throw new Error(`GA4 token exchange failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/** `dateStr` is a GA4-format date (YYYY-MM-DD). Returns null on any config or request failure. */
export async function fetchGA4DailyStats(dateStr: string): Promise<GA4DailyStats | null> {
  const rawKey = process.env.GA4_SERVICE_ACCOUNT_KEY;
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!rawKey || !propertyId) {
    console.error("fetchGA4DailyStats: GA4_SERVICE_ACCOUNT_KEY or GA4_PROPERTY_ID not set");
    return null;
  }

  let creds: GA4ServiceAccount;
  try {
    creds = JSON.parse(rawKey);
  } catch (err) {
    console.error("fetchGA4DailyStats: failed to parse GA4_SERVICE_ACCOUNT_KEY", err);
    return null;
  }

  let accessToken: string;
  try {
    accessToken = await getAccessToken(creds);
  } catch (err) {
    console.error("fetchGA4DailyStats: auth failed", err);
    return null;
  }

  const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const headers = { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" };

  const totalsRes = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      dateRanges: [{ startDate: dateStr, endDate: dateStr }],
      metrics: [{ name: "sessions" }, { name: "screenPageViews" }],
    }),
  });
  if (!totalsRes.ok) {
    console.error("fetchGA4DailyStats: totals request failed", totalsRes.status, await totalsRes.text());
    return null;
  }
  const totals = await totalsRes.json();
  const totalRow = totals.rows?.[0];
  const sessions = Number(totalRow?.metricValues?.[0]?.value ?? 0);
  const pageViews = Number(totalRow?.metricValues?.[1]?.value ?? 0);

  const pagesRes = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      dateRanges: [{ startDate: dateStr, endDate: dateStr }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10,
    }),
  });

  let topPages: { path: string; views: number }[] = [];
  if (pagesRes.ok) {
    const pages = await pagesRes.json();
    topPages = (pages.rows ?? []).map((row: { dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] }) => ({
      path: row.dimensionValues?.[0]?.value ?? "",
      views: Number(row.metricValues?.[0]?.value ?? 0),
    }));
  } else {
    console.error("fetchGA4DailyStats: top-pages request failed", pagesRes.status, await pagesRes.text());
  }

  return { sessions, pageViews, topPages };
}

/** Fetches and upserts one day's stats into ga4_daily_stats. Shared by the daily scheduled
 * function and the admin "sync now" button, so both hit the same code path. */
export async function syncGA4DailyStats(dateStr: string): Promise<{ ok: boolean; error?: string; stats?: GA4DailyStats }> {
  const stats = await fetchGA4DailyStats(dateStr);
  if (!stats) {
    return { ok: false, error: "No se pudo obtener datos de GA4 — revisa las credenciales y el Property ID." };
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("ga4_daily_stats").upsert({
    date: dateStr,
    sessions: stats.sessions,
    page_views: stats.pageViews,
    top_pages: stats.topPages,
    synced_at: new Date().toISOString(),
  });

  if (error) {
    console.error("syncGA4DailyStats: upsert failed", error);
    return { ok: false, error: "No se pudo guardar en Supabase." };
  }

  return { ok: true, stats };
}
