import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import BarRow from "@/components/admin/BarRow";
import GA4SyncButton from "@/components/admin/GA4SyncButton";

interface DailyStatsRow {
  date: string;
  sessions: number;
  page_views: number;
  top_pages: { path: string; views: number }[];
}

async function getGA4Data(): Promise<DailyStatsRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ga4_daily_stats")
    .select("date, sessions, page_views, top_pages")
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
  const maxSessions = Math.max(0, ...last14.map((r) => r.sessions));

  const pageViewsByPath = new Map<string, number>();
  for (const row of rows) {
    for (const page of row.top_pages ?? []) {
      pageViewsByPath.set(page.path, (pageViewsByPath.get(page.path) ?? 0) + page.views);
    }
  }
  const topPages = [...pageViewsByPath.entries()]
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  const maxPageViews = topPages[0]?.views ?? 0;

  const totalSessions = rows.reduce((sum, r) => sum + r.sessions, 0);
  const totalPageViews = rows.reduce((sum, r) => sum + r.page_views, 0);

  return (
    <main className="p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-2xl">Analytics</h1>
        <GA4SyncButton />
      </div>
      <p className="text-xs opacity-50 mb-8">
        Sincroniza una vez al día automáticamente. Los últimos {rows.length} día(s) con datos, {totalSessions} sesiones y{" "}
        {totalPageViews} vistas de página en total.
      </p>

      {rows.length === 0 ? (
        <p className="opacity-60">
          Todavía no hay datos sincronizados. La sincronización automática corre una vez al día —
          o usa &ldquo;Sincronizar ahora&rdquo; arriba para traer el día de ayer de inmediato.
        </p>
      ) : (
        <>
          <div className="mb-12">
            <h2 className="font-mono text-xs uppercase tracking-wide opacity-60 mb-4">Sesiones por día</h2>
            <div className="flex flex-col gap-2">
              {last14.map((row) => (
                <BarRow key={row.date} label={formatDayLabel(row.date)} value={row.sessions} max={maxSessions} formatValue={(v) => String(v)} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-wide opacity-60 mb-4">Páginas más visitadas (últimos {rows.length} días)</h2>
            {topPages.length === 0 ? (
              <p className="opacity-50 text-sm">Sin datos de páginas todavía.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {topPages.map((p) => (
                  <BarRow key={p.path} label="" value={p.views} max={maxPageViews} formatValue={() => `${p.path} — ${p.views}`} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
