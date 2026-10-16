import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import NewsletterComposer from "@/components/admin/NewsletterComposer";
import type { NewsletterAudience, NewsletterLanguage } from "@/lib/newsletterAudience";
import { getAdminDictionary } from "@/lib/admin/dictionary";
import { getAdminLocale } from "@/lib/admin/i18n";

interface NewsletterIssue {
  id: string;
  subject: string;
  recipient_count: number;
  sent_at: string;
  audience: NewsletterAudience | null;
  language?: NewsletterLanguage | null;
}

interface IssueStats {
  opened: number;
  clicked: number;
}

async function getData() {
  const supabase = createSupabaseAdminClient();
  // preferred_language comes from migration 0019; until it exists every contact counts as Spanish.
  const loadContacts = async () => {
    const withLang = await supabase.from("contacts").select("id, preferred_language").eq("subscribed", true);
    if (!withLang.error) return (withLang.data ?? []) as { id: string; preferred_language?: string }[];
    const plain = await supabase.from("contacts").select("id").eq("subscribed", true);
    return (plain.data ?? []) as { id: string; preferred_language?: string }[];
  };
  const [subscribedContacts, { data: purchases }, { data: issues }, { data: sends }] = await Promise.all([
    loadContacts(),
    supabase.from("product_purchases").select("contact_id").eq("status", "completed"),
    supabase.from("newsletter_issues").select("*").order("sent_at", { ascending: false }),
    supabase.from("email_sends").select("newsletter_issue_id, opened_at, clicked_at").not("newsletter_issue_id", "is", null),
  ]);

  const buyerIds = new Set((purchases ?? []).map((p) => p.contact_id));
  const countFor = (language: NewsletterLanguage) => {
    const pool = subscribedContacts.filter((c) => language === "all" || (c.preferred_language ?? "es") === language);
    const clients = pool.filter((c) => buyerIds.has(c.id)).length;
    return { all: pool.length, clients, non_buyers: pool.length - clients };
  };
  const counts: Record<NewsletterLanguage, Record<NewsletterAudience, number>> = { all: countFor("all"), en: countFor("en"), es: countFor("es") };

  const statsByIssue = new Map<string, IssueStats>();
  for (const send of sends ?? []) {
    const id = send.newsletter_issue_id as string;
    const stats = statsByIssue.get(id) ?? { opened: 0, clicked: 0 };
    if (send.opened_at) stats.opened++;
    if (send.clicked_at) stats.clicked++;
    statsByIssue.set(id, stats);
  }

  return { counts, issues: (issues ?? []) as NewsletterIssue[], statsByIssue };
}

export default async function AdminNewsletterPage() {
  const { counts, issues, statsByIssue } = await getData();
  const locale = getAdminLocale();
  const { newsletter: t } = getAdminDictionary(locale);

  return (
    <main className="p-10">
      <h1 className="font-display text-2xl mb-6">{t.title}</h1>

      <NewsletterComposer counts={counts} />

      <h2 className="font-semibold mb-3">{t.history}</h2>
      {issues.length === 0 ? (
        <p className="opacity-60">{t.noHistory}</p>
      ) : (
        <table className="w-full text-sm max-w-2xl">
          <thead>
            <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.historyColumns.subject}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.historyColumns.audience}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.historyColumns.sent}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.historyColumns.opened}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.historyColumns.clicks}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.historyColumns.date}</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => {
              const stats = statsByIssue.get(issue.id) ?? { opened: 0, clicked: 0 };
              const openRate = issue.recipient_count > 0 ? Math.round((stats.opened / issue.recipient_count) * 100) : 0;
              return (
                <tr key={issue.id} className="border-b border-[rgba(20,25,43,0.08)]">
                  <td className="py-3">{issue.subject}</td>
                  <td className="py-3 opacity-70">{t.audiences[issue.audience ?? "all"] ?? issue.audience}
                    {issue.language && issue.language !== "all" && <span className="block text-xs opacity-60">{t.languages[issue.language]}</span>}</td>
                  <td className="py-3 opacity-70">{issue.recipient_count}</td>
                  <td className="py-3 opacity-70">
                    {stats.opened} <span className="opacity-60">({openRate}%)</span>
                  </td>
                  <td className="py-3 opacity-70">{stats.clicked}</td>
                  <td className="py-3 opacity-70">{new Date(issue.sent_at).toLocaleDateString(locale)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <p className="text-xs opacity-50 mt-3 max-w-2xl">{t.opensNote}</p>
    </main>
  );
}
