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
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-2xl">Productos</h1>
        <Link href="/admin/productos/new" className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay text-white">
          + Nuevo producto
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="opacity-60">Todavía no hay productos.</p>
      ) : (
        <div className="border border-[rgba(20,25,43,0.1)] rounded-[4px] overflow-hidden max-w-4xl">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left bg-[rgba(20,25,43,0.025)] border-b border-[rgba(20,25,43,0.1)]">
                <th className="py-3 pl-5 pr-3 font-mono text-[10.5px] uppercase tracking-wide opacity-50 font-medium">Producto</th>
                <th className="py-3 px-3 font-mono text-[10.5px] uppercase tracking-wide opacity-50 font-medium">Categoría</th>
                <th className="py-3 px-3 font-mono text-[10.5px] uppercase tracking-wide opacity-50 font-medium text-right">Precio</th>
                <th className="py-3 px-3 font-mono text-[10.5px] uppercase tracking-wide opacity-50 font-medium text-right">Ventas</th>
                <th className="py-3 px-3 font-mono text-[10.5px] uppercase tracking-wide opacity-50 font-medium text-right">Ingresos</th>
                <th className="py-3 pl-3 pr-5 font-mono text-[10.5px] uppercase tracking-wide opacity-50 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const s = stats.get(p.id) ?? { count: 0, revenueCents: 0 };
                return (
                  <tr key={p.id} className="border-b border-[rgba(20,25,43,0.06)] last:border-b-0 hover:bg-[rgba(20,25,43,0.015)] transition-colors">
                    <td className="py-3.5 pl-5 pr-3">
                      <div className="flex items-center gap-3.5">
                        {p.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image_url}
                            alt=""
                            className="w-11 h-11 rounded-[3px] object-cover border border-[rgba(20,25,43,0.1)] flex-shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-[3px] bg-[rgba(20,25,43,0.05)] flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <Link href={`/admin/productos/${p.id}/edit`} className="hover:underline font-medium">
                            {p.name}
                          </Link>
                          <div className="text-[11.5px] opacity-45 font-mono truncate">/productos/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-[10.5px] uppercase tracking-wide px-2 py-1 rounded-full border border-[rgba(20,25,43,0.15)] opacity-70">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums opacity-80">
                      {p.price_cents === 0 ? "Gratis" : `$${(p.price_cents / 100).toFixed(2)}`}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums opacity-80">{s.count}</td>
                    <td className="py-3.5 px-3 text-right tabular-nums opacity-80">${(s.revenueCents / 100).toFixed(2)}</td>
                    <td className="py-3.5 pl-3 pr-5">
                      <ProductActiveToggle productId={p.id} active={p.active} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
