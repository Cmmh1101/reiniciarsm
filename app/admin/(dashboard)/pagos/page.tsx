import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { MENTORIA_SESSION_PRODUCT, MENTORIA_PACK_PRODUCT } from "@/lib/pricing";

interface PaymentRow {
  id: string;
  amount_cents: number;
  product: string;
  status: string;
  created_at: string;
  contacts: { name: string | null; email: string } | null;
}

const PRODUCT_LABELS: Record<string, string> = {
  [MENTORIA_SESSION_PRODUCT]: "Mentoría — Sesión individual",
  [MENTORIA_PACK_PRODUCT]: "Mentoría — Paquete de 4",
};

async function getPayments(): Promise<PaymentRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("stripe_payments")
    .select("id, amount_cents, product, status, created_at, contacts(name, email)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("admin getPayments failed", error);
    return [];
  }
  return (data ?? []) as unknown as PaymentRow[];
}

export default async function AdminPagosPage() {
  const payments = await getPayments();
  const totalCents = payments.reduce((sum, p) => sum + p.amount_cents, 0);

  return (
    <main className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl">Pagos</h1>
        <span className="font-mono text-sm opacity-70">Total: ${(totalCents / 100).toFixed(2)}</span>
      </div>

      {payments.length === 0 ? (
        <p className="opacity-60">Todavía no hay pagos.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Contacto</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Producto</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Monto</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-[rgba(20,25,43,0.08)]">
                <td className="py-3">
                  {p.contacts?.name ?? "—"}
                  <div className="text-xs opacity-60">{p.contacts?.email}</div>
                </td>
                <td className="py-3 opacity-70">{PRODUCT_LABELS[p.product] ?? p.product}</td>
                <td className="py-3 opacity-70">${(p.amount_cents / 100).toFixed(2)}</td>
                <td className="py-3 opacity-70">{new Date(p.created_at).toLocaleDateString("es")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
