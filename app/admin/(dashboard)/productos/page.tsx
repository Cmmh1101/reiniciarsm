import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import ProductActiveToggle from "@/components/admin/ProductActiveToggle";

async function getPurchaseStats(): Promise<Map<string, { count: number; revenueCents: number }>> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("product_purchases").select("product_id, amount_cents").eq("status", "completed");
  const stats = new Map<string, { count: number; revenueCents: number }>();
  if (error || !data) return stats;
  for (const row of data) {
    const s = stats.get(row.product_id) ?? { count: 0, revenueCents: 0 };
    s.count++;
    s.revenueCents += row.amount_cents;
    stats.set(row.product_id, s);
  }
  return stats;
}

export default async function AdminProductosPage() {
  const [products, stats] = await Promise.all([getAllProducts(), getPurchaseStats()]);

  return (
    <main className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl">Productos</h1>
        <Link href="/admin/productos/new" className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay text-white">
          + Nuevo producto
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="opacity-60">Todavía no hay productos.</p>
      ) : (
        <table className="w-full text-sm max-w-3xl">
          <thead>
            <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Producto</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Categoría</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Precio</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Ventas</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Ingresos</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Estado</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const s = stats.get(p.id) ?? { count: 0, revenueCents: 0 };
              return (
                <tr key={p.id} className="border-b border-[rgba(20,25,43,0.08)]">
                  <td className="py-3">
                    <Link href={`/admin/productos/${p.id}/edit`} className="hover:underline">
                      {p.name}
                    </Link>
                    <div className="text-xs opacity-50 font-mono">/productos/{p.slug}</div>
                  </td>
                  <td className="py-3 opacity-70">{p.category}</td>
                  <td className="py-3 opacity-70">${(p.price_cents / 100).toFixed(2)}</td>
                  <td className="py-3 opacity-70">{s.count}</td>
                  <td className="py-3 opacity-70">${(s.revenueCents / 100).toFixed(2)}</td>
                  <td className="py-3">
                    <ProductActiveToggle productId={p.id} active={p.active} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
