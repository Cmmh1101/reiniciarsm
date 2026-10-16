import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import GA4SyncButton from "@/components/admin/GA4SyncButton";
import SessionsBarChart from "@/components/admin/SessionsBarChart";
import { fmt, getAdminDictionary } from "@/lib/admin/dictionary";
import { getAdminLocale } from "@/lib/admin/i18n";
import type { Locale } from "@/lib/i18n/config";

interface DailyStatsRow {
  date: string;
  sessions: number;
  page_views: number;
  active_users: number;
  top_pages: { path: string; views: number }[];
  traffic_sources: { channel: string; sessions: number }[];
}

async function getGA4Data(): Promise<DailyStatsRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ga4_daily_stats")
    .select("date, sessions, page_views, active_users, top_pages, traffic_sources")
    .order("date", { ascending: false })
    .limit(30);

  if (error) {
    console.error("admin analytics: query failed", error);
    return [];
  }
  return (data ?? []) as DailyStatsRow[];
}

function formatDayLabel(dateStr: string, locale: Locale): string {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString(locale, { day: "numeric", month: "short", timeZone: "UTC" });
}

export default async function AdminAnalyticsPage() {
  const locale = getAdminLocale();
  const { analytics: t } = getAdminDictionary(locale);
  const rows = await getGA4Data();
  const isConfigured = !!process.env.GA4_PROPERTY_ID;

  if (!isConfigured) {
    return (
      <main className="p-10 max-w-2xl">
        <h1 className="font-display text-2xl mb-4">{t.title}</h1>
        <p className="opacity-70 mb-3">{t.notConfigured}</p>
      </main>
    );
  }

  const last14 = [...rows].slice(0, 14).reverse();
  const chartData = last14.map((row) => ({ label: formatDayLabel(row.date, locale), value: row.sessions }));

  const pageViewsByPath = new Map<string, number>();
  for (const row of rows) {
    for (const page of row.top_pages ?? []) {
      pageViewsByPath.set(page.path, (pageViewsByPath.get(page.path) ?? 0) + page.views);
    }
  }
  const topPages = [...pageViewsByPath.entries()]
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 9);

  const sessionsByChannel = new Map<string, number>();
  for (const row of rows) {
    for (const source of row.traffic_sources ?? []) {
      sessionsByChannel.set(source.channel, (sessionsByChannel.get(source.channel) ?? 0) + source.sessions);
    }
  }
  const trafficSources = [...sessionsByChannel.entries()]
    .map(([channel, sessions]) => ({ channel, sessions }))
    .sort((a, b) => b.sessions - a.sessions);

  const totalSessions = rows.reduce((sum, r) => sum + r.sessions, 0);
  const totalPageViews = rows.reduce((sum, r) => sum + r.page_views, 0);
  const totalActiveUsers = rows.reduce((sum, r) => sum + r.active_users, 0);

  return (
    <main className="p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-2xl">{t.title}</h1>
        <GA4SyncButton />
      </div>
      <p className="text-xs opacity-50 mb-8">{fmt(t.lastDays, { n: rows.length })}</p>

      {rows.length === 0 ? (
        <p className="opacity-60">{t.noData}</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
              <p className="font-display text-3xl mb-1">{totalActiveUsers}</p>
              <p className="font-mono text-[10px] uppercase tracking-wide opacity-50">{t.activeUsers}</p>
            </div>
            <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
              <p className="font-display text-3xl mb-1">{totalSessions}</p>
              <p className="font-mono text-[10px] uppercase tracking-wide opacity-50">{t.sessions}</p>
            </div>
            <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
              <p className="font-display text-3xl mb-1">{totalPageViews}</p>
              <p className="font-mono text-[10px] uppercase tracking-wide opacity-50">{t.pageViews}</p>
            </div>
          </div>

          <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-6 mb-12">
            <h2 className="font-body font-semibold text-sm mb-6">{t.sessionsPerDay}</h2>
            <SessionsBarChart data={chartData} />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="font-body font-semibold text-sm mb-4">{t.topPages}</h2>
              {topPages.length === 0 ? (
                <p className="opacity-50 text-sm">{t.noPages}</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(20,25,43,0.12)]">
                      <th className="text-left py-2 font-mono text-[10px] uppercase tracking-wide opacity-50">{t.page}</th>
                      <th className="text-right py-2 font-mono text-[10px] uppercase tracking-wide opacity-50">{t.views}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPages.map((p) => (
                      <tr key={p.path} className="border-b border-[rgba(20,25,43,0.06)]">
                        <td className="py-2.5 pr-3 font-mono text-[12.5px] break-all">{p.path || "/"}</td>
                        <td className="py-2.5 text-right tabular-nums">{p.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div>
              <h2 className="font-body font-semibold text-sm mb-4">{t.sources}</h2>
              {trafficSources.length === 0 ? (
                <p className="opacity-50 text-sm">{t.noSources}</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(20,25,43,0.12)]">
                      <th className="text-left py-2 font-mono text-[10px] uppercase tracking-wide opacity-50">{t.channel}</th>
                      <th className="text-right py-2 font-mono text-[10px] uppercase tracking-wide opacity-50">{t.sessions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trafficSources.map((s) => (
                      <tr key={s.channel} className="border-b border-[rgba(20,25,43,0.06)]">
                        <td className="py-2.5 pr-3">{s.channel || t.unassigned}</td>
                        <td className="py-2.5 text-right tabular-nums">{s.sessions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
