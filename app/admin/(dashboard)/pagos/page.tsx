import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { getAvailableSlots } from "@/lib/mentorias";
import ManualPaymentForm from "@/components/admin/ManualPaymentForm";
import { fmt, getAdminDictionary } from "@/lib/admin/dictionary";
import { getAdminLocale } from "@/lib/admin/i18n";

interface PaymentRow {
  id: string;
  amount_cents: number;
  product: string;
  payment_method: string;
  status: string;
  created_at: string;
  contacts: { name: string | null; email: string } | null;
}

async function getPayments(): Promise<PaymentRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("stripe_payments")
    .select("id, amount_cents, product, payment_method, status, created_at, contacts(name, email)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("admin getPayments failed", error);
    return [];
  }
  return (data ?? []) as unknown as PaymentRow[];
}

export default async function AdminPagosPage() {
  const locale = getAdminLocale();
  const { payments: t } = getAdminDictionary(locale);
  const [payments, availableSlots] = await Promise.all([getPayments(), getAvailableSlots()]);
  const totalCents = payments.reduce((sum, p) => sum + p.amount_cents, 0);

  return (
    <main className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl">{t.title}</h1>
        <span className="font-mono text-sm opacity-70">{fmt(t.total, { amount: `$${(totalCents / 100).toFixed(2)}` })}</span>
      </div>

      <ManualPaymentForm availableSlots={availableSlots} />

      {payments.length === 0 ? (
        <p className="opacity-70">{t.none}</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-70">{t.columns.contact}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-70">{t.columns.product}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-70">{t.columns.method}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-70">{t.columns.amount}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-70">{t.columns.date}</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-[rgba(20,25,43,0.08)]">
                <td className="py-3">
                  {p.contacts?.name ?? "—"}
                  <div className="text-xs opacity-70">{p.contacts?.email}</div>
                </td>
                <td className="py-3 opacity-70">{t.products[p.product] ?? p.product}</td>
                <td className="py-3 opacity-70">{t.methods[p.payment_method] ?? p.payment_method}</td>
                <td className="py-3 opacity-70">${(p.amount_cents / 100).toFixed(2)}</td>
                <td className="py-3 opacity-70">{new Date(p.created_at).toLocaleDateString(locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
