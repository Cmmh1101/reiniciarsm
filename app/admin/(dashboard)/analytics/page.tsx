import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import GA4SyncButton from "@/components/admin/GA4SyncButton";
import SessionsBarChart from "@/components/admin/SessionsBarChart";

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

function formatDayLabel(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("es", { day: "numeric", month: "short", timeZone: "UTC" });
}

export default async function AdminAnalyticsPage() {
  const rows = await getGA4Data();
  const isConfigured = !!process.env.GA4_PROPERTY_ID;

  if (!isConfigured) {
    return (
      <main className="p-10 max-w-2xl">
        <h1 className="font-display text-2xl mb-4">Analytics</h1>
        <p className="opacity-70 mb-3">
          El tag de GA4 ya está instalado en el sitio, pero la sincronización diaria todavía no
          tiene las credenciales configuradas (GA4_SERVICE_ACCOUNT_KEY / GA4_PROPERTY_ID).
        </p>
      </main>
    );
  }

  const last14 = [...rows].slice(0, 14).reverse();
  const chartData = last14.map((row) => ({ label: formatDayLabel(row.date), value: row.sessions }));

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
        <h1 className="font-display text-2xl">Analytics</h1>
        <GA4SyncButton />
      </div>
      <p className="text-xs opacity-50 mb-8">Últimos {rows.length} días, desde GA4.</p>

      {rows.length === 0 ? (
        <p className="opacity-60">
          Todavía no hay datos sincronizados. La sincronización automática corre una vez al día —
          o usa &ldquo;Sincronizar ahora&rdquo; arriba para traer el día de ayer de inmediato.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
              <p className="font-display text-3xl mb-1">{totalActiveUsers}</p>
              <p className="font-mono text-[10px] uppercase tracking-wide opacity-50">Usuarios activos</p>
            </div>
            <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
              <p className="font-display text-3xl mb-1">{totalSessions}</p>
              <p className="font-mono text-[10px] uppercase tracking-wide opacity-50">Sesiones</p>
            </div>
            <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
              <p className="font-display text-3xl mb-1">{totalPageViews}</p>
              <p className="font-mono text-[10px] uppercase tracking-wide opacity-50">Vistas de página</p>
            </div>
          </div>

          <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-6 mb-12">
            <h2 className="font-body font-semibold text-sm mb-6">Sesiones por día</h2>
            <SessionsBarChart data={chartData} />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="font-body font-semibold text-sm mb-4">Páginas más visitadas</h2>
              {topPages.length === 0 ? (
                <p className="opacity-50 text-sm">Sin datos de páginas todavía.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(20,25,43,0.12)]">
                      <th className="text-left py-2 font-mono text-[10px] uppercase tracking-wide opacity-50">Página</th>
                      <th className="text-right py-2 font-mono text-[10px] uppercase tracking-wide opacity-50">Vistas</th>
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
              <h2 className="font-body font-semibold text-sm mb-4">Fuentes de tráfico</h2>
              {trafficSources.length === 0 ? (
                <p className="opacity-50 text-sm">Sin datos de fuentes todavía.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(20,25,43,0.12)]">
                      <th className="text-left py-2 font-mono text-[10px] uppercase tracking-wide opacity-50">Canal</th>
                      <th className="text-right py-2 font-mono text-[10px] uppercase tracking-wide opacity-50">Sesiones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trafficSources.map((s) => (
                      <tr key={s.channel} className="border-b border-[rgba(20,25,43,0.06)]">
                        <td className="py-2.5 pr-3">{s.channel || "Sin asignar"}</td>
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
