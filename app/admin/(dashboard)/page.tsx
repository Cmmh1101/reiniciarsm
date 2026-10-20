import { getDashboardStats } from "@/lib/dashboardStats";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import BarRow from "@/components/admin/BarRow";
import { getAdminDictionary } from "@/lib/admin/dictionary";
import { getAdminLocale } from "@/lib/admin/i18n";
import type { Locale } from "@/lib/i18n/config";

function formatWeekLabel(weekStart: string, locale: Locale): string {
  return new Date(`${weekStart}T00:00:00Z`).toLocaleDateString(locale, {
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
  const locale = getAdminLocale();
  const { dashboard: t } = getAdminDictionary(locale);
  const [stats, traffic] = await Promise.all([getDashboardStats(), getRecentTraffic()]);
  const conversionRate =
    stats.funnel.quizCompleted > 0 ? Math.round((stats.funnel.converted / stats.funnel.quizCompleted) * 100) : 0;
  const maxLeads = Math.max(0, ...stats.leadsPerWeek.map((w) => w.count));
  const maxRevenue = Math.max(0, ...stats.revenuePerWeek.map((w) => w.amountCents));

  return (
    <main className="p-10 max-w-4xl">
      <h1 className="font-display text-2xl mb-8">{t.title}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
          <p className="font-mono text-[10px] uppercase tracking-wide opacity-70 mb-2">{t.diagnostics}</p>
          <p className="font-display text-3xl">{stats.funnel.quizCompleted}</p>
        </div>
        <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
          <p className="font-mono text-[10px] uppercase tracking-wide opacity-70 mb-2">{t.converted}</p>
          <p className="font-display text-3xl">
            {stats.funnel.converted} <span className="text-sm opacity-70">({conversionRate}%)</span>
          </p>
        </div>
        <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
          <p className="font-mono text-[10px] uppercase tracking-wide opacity-70 mb-2">{t.revenue}</p>
          <p className="font-display text-3xl">${(stats.totalRevenueCents / 100).toFixed(2)}</p>
        </div>
        <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
          <p className="font-mono text-[10px] uppercase tracking-wide opacity-70 mb-2">{t.topArchetype}</p>
          <p className="font-display text-base leading-snug">{stats.topArchetypes[0]?.archetype ?? "—"}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wide opacity-70 mb-4">{t.leadsPerWeek}</h2>
          {stats.leadsPerWeek.length === 0 ? (
            <p className="opacity-70 text-sm">{t.noData}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {stats.leadsPerWeek.map((w) => (
                <BarRow key={w.weekStart} label={formatWeekLabel(w.weekStart, locale)} value={w.count} max={maxLeads} formatValue={(v) => String(v)} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-wide opacity-70 mb-4">{t.revenuePerWeek}</h2>
          {stats.revenuePerWeek.length === 0 ? (
            <p className="opacity-70 text-sm">{t.noPayments}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {stats.revenuePerWeek.map((w) => (
                <BarRow
                  key={w.weekStart}
                  label={formatWeekLabel(w.weekStart, locale)}
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
        <h2 className="font-mono text-xs uppercase tracking-wide opacity-70 mb-4">{t.topArchetypes}</h2>
        {stats.topArchetypes.length === 0 ? (
          <p className="opacity-70 text-sm">{t.noDiagnostics}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {stats.topArchetypes.map((a) => (
              <BarRow key={a.archetype} label="" value={a.count} max={stats.topArchetypes[0].count} formatValue={() => `${a.archetype} — ${a.count}`} />
            ))}
          </div>
        )}
      </div>

      <div className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
        <p className="font-mono text-[10px] uppercase tracking-wide opacity-70 mb-2">{t.traffic}</p>
        {traffic ? (
          <p className="font-display text-lg">
            {traffic.sessions} {t.sessions} <span className="opacity-70 text-sm font-mono">·</span> {traffic.pageViews} {t.pageViews}
          </p>
        ) : (
          <p className="opacity-70 text-sm">
            {t.noTraffic}{" "}
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
