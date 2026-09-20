import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import NewsletterComposer from "@/components/admin/NewsletterComposer";
import { AUDIENCE_LABELS, type NewsletterAudience } from "@/lib/newsletterAudience";

interface NewsletterIssue {
  id: string;
  subject: string;
  recipient_count: number;
  sent_at: string;
  audience: NewsletterAudience | null;
}

interface IssueStats {
  opened: number;
  clicked: number;
}

async function getData() {
  const supabase = createSupabaseAdminClient();
  const [{ data: subscribedContacts }, { data: purchases }, { data: issues }, { data: sends }] = await Promise.all([
    supabase.from("contacts").select("id").eq("subscribed", true),
    supabase.from("product_purchases").select("contact_id").eq("status", "completed"),
    supabase.from("newsletter_issues").select("*").order("sent_at", { ascending: false }),
    supabase.from("email_sends").select("newsletter_issue_id, opened_at, clicked_at").not("newsletter_issue_id", "is", null),
  ]);

  const subscribedIds = new Set((subscribedContacts ?? []).map((c) => c.id));
  const buyerIds = new Set((purchases ?? []).map((p) => p.contact_id));
  const clientsCount = [...buyerIds].filter((id) => subscribedIds.has(id)).length;
  const audienceCounts = { all: subscribedIds.size, clients: clientsCount, non_buyers: subscribedIds.size - clientsCount };

  const statsByIssue = new Map<string, IssueStats>();
  for (const send of sends ?? []) {
    const id = send.newsletter_issue_id as string;
    const stats = statsByIssue.get(id) ?? { opened: 0, clicked: 0 };
    if (send.opened_at) stats.opened++;
    if (send.clicked_at) stats.clicked++;
    statsByIssue.set(id, stats);
  }

  return { audienceCounts, issues: (issues ?? []) as NewsletterIssue[], statsByIssue };
}

export default async function AdminNewsletterPage() {
  const { audienceCounts, issues, statsByIssue } = await getData();

  return (
    <main className="p-10">
      <h1 className="font-display text-2xl mb-6">Newsletter</h1>

      <NewsletterComposer audienceCounts={audienceCounts} />

      <h2 className="font-semibold mb-3">Enviados anteriormente</h2>
      {issues.length === 0 ? (
        <p className="opacity-60">Todavía no has enviado ningún newsletter.</p>
      ) : (
        <table className="w-full text-sm max-w-2xl">
          <thead>
            <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Asunto</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Audiencia</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Enviados</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Abiertos</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Clics</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => {
              const stats = statsByIssue.get(issue.id) ?? { opened: 0, clicked: 0 };
              const openRate = issue.recipient_count > 0 ? Math.round((stats.opened / issue.recipient_count) * 100) : 0;
              return (
                <tr key={issue.id} className="border-b border-[rgba(20,25,43,0.08)]">
                  <td className="py-3">{issue.subject}</td>
                  <td className="py-3 opacity-70">{AUDIENCE_LABELS[issue.audience ?? "all"] ?? issue.audience}</td>
                  <td className="py-3 opacity-70">{issue.recipient_count}</td>
                  <td className="py-3 opacity-70">
                    {stats.opened} <span className="opacity-60">({openRate}%)</span>
                  </td>
                  <td className="py-3 opacity-70">{stats.clicked}</td>
                  <td className="py-3 opacity-70">{new Date(issue.sent_at).toLocaleDateString("es")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <p className="text-xs opacity-50 mt-3 max-w-2xl">
        Los abiertos son aproximados — clientes como Apple Mail bloquean o precargan el píxel de apertura, así que
        trátalos como una tendencia, no un número exacto. Los clics son más confiables.
      </p>
    </main>
  );
}
