import { getDashboardStats } from "@/lib/dashboardStats";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import BarRow from "@/components/admin/BarRow";

function formatWeekLabel(weekStart: string): string {
  return new Date(`${weekStart}T00:00:00Z`).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

async function getRecentTraffic(): Promise<{ sessions: number; pageViews: number } | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("ga4_daily_stats").select("sessions, page_views").order("date", { ascending: false }).limit(7);
  if (error || !data || data.length === 0) return null;
  return data.reduce(
    (acc, row) => ({ sessions: acc.sessions + row.sessions, pageViews: acc.pageViews + row.page_views }),
    { sessions: 0, pageViews: 0 }
  );
}

export default async function AdminDashboardPage() {
  const [stats, traffic] = await Promise.all([getDashboardStats(), getRecentTraffic()]);
  const conversionRate =
    stats.funnel.quizCompleted > 0 ? Math.round((stats.funnel.converted / stats.funnel.quizCompleted) * 100) : 0;
  const maxLeads = Math.max(0, ...stats.leadsPerWeek.map((w) => w.count));
  const maxRevenue = Math.max(0, ...stats.revenuePerWeek.map((w) => w.amountCents));

  return (
    <main className="p-10 max-w-4xl">
      <h1 className="font-display text-2xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
          <p className="font-mono text-[10px] uppercase tracking-wide opacity-50 mb-2">Diagnósticos</p>
          <p className="font-display text-3xl">{stats.funnel.quizCompleted}</p>
        </div>
        <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
          <p className="font-mono text-[10px] uppercase tracking-wide opacity-50 mb-2">Convertidos</p>
          <p className="font-display text-3xl">
            {stats.funnel.converted} <span className="text-sm opacity-50">({conversionRate}%)</span>
          </p>
        </div>
        <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
          <p className="font-mono text-[10px] uppercase tracking-wide opacity-50 mb-2">Ingresos totales</p>
          <p className="font-display text-3xl">${(stats.totalRevenueCents / 100).toFixed(2)}</p>
        </div>
        <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
          <p className="font-mono text-[10px] uppercase tracking-wide opacity-50 mb-2">Arquetipo top</p>
          <p className="font-display text-base leading-snug">{stats.topArchetypes[0]?.archetype ?? "—"}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wide opacity-60 mb-4">Leads por semana</h2>
          {stats.leadsPerWeek.length === 0 ? (
            <p className="opacity-50 text-sm">Todavía no hay datos.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {stats.leadsPerWeek.map((w) => (
                <BarRow key={w.weekStart} label={formatWeekLabel(w.weekStart)} value={w.count} max={maxLeads} formatValue={(v) => String(v)} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-wide opacity-60 mb-4">Ingresos por semana</h2>
          {stats.revenuePerWeek.length === 0 ? (
            <p className="opacity-50 text-sm">Todavía no hay pagos.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {stats.revenuePerWeek.map((w) => (
                <BarRow
                  key={w.weekStart}
                  label={formatWeekLabel(w.weekStart)}
                  value={w.amountCents}
                  max={maxRevenue}
                  formatValue={(v) => `$${(v / 100).toFixed(0)}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="font-mono text-xs uppercase tracking-wide opacity-60 mb-4">Arquetipos más comunes</h2>
        {stats.topArchetypes.length === 0 ? (
          <p className="opacity-50 text-sm">Todavía no hay diagnósticos completados.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {stats.topArchetypes.map((a) => (
              <BarRow key={a.archetype} label="" value={a.count} max={stats.topArchetypes[0].count} formatValue={() => `${a.archetype} — ${a.count}`} />
            ))}
          </div>
        )}
      </div>

      <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
        <p className="font-mono text-[10px] uppercase tracking-wide opacity-50 mb-2">Tráfico del sitio (GA4, últimos 7 días)</p>
        {traffic ? (
          <p className="font-display text-lg">
            {traffic.sessions} sesiones <span className="opacity-50 text-sm font-mono">·</span> {traffic.pageViews} vistas de página
          </p>
        ) : (
          <p className="opacity-60 text-sm">
            Todavía no hay datos sincronizados — ver{" "}
            <a href="/admin/analytics" className="underline">
              /admin/analytics
            </a>
            .
          </p>
        )}
      </div>
    </main>
  );
}
