import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import NewsletterComposer from "@/components/admin/NewsletterComposer";

interface NewsletterIssue {
  id: string;
  subject: string;
  recipient_count: number;
  sent_at: string;
}

async function getData() {
  const supabase = createSupabaseAdminClient();
  const [{ count }, { data: issues }] = await Promise.all([
    supabase.from("contacts").select("id", { count: "exact", head: true }).eq("subscribed", true),
    supabase.from("newsletter_issues").select("*").order("sent_at", { ascending: false }),
  ]);
  return { subscriberCount: count ?? 0, issues: (issues ?? []) as NewsletterIssue[] };
}

export default async function AdminNewsletterPage() {
  const { subscriberCount, issues } = await getData();

  return (
    <main className="p-10">
      <h1 className="font-display text-2xl mb-6">Newsletter</h1>

      <NewsletterComposer subscriberCount={subscriberCount} />

      <h2 className="font-semibold mb-3">Enviados anteriormente</h2>
      {issues.length === 0 ? (
        <p className="opacity-60">Todavía no has enviado ningún newsletter.</p>
      ) : (
        <table className="w-full text-sm max-w-2xl">
          <thead>
            <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Asunto</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Destinatarios</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="border-b border-[rgba(20,25,43,0.08)]">
                <td className="py-3">{issue.subject}</td>
                <td className="py-3 opacity-70">{issue.recipient_count}</td>
                <td className="py-3 opacity-70">{new Date(issue.sent_at).toLocaleDateString("es")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
