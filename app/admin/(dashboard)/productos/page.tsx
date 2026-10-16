import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import ProductActiveToggle from "@/components/admin/ProductActiveToggle";
import { getAdminDictionary } from "@/lib/admin/dictionary";
import { getAdminLocale } from "@/lib/admin/i18n";

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
  const all = getAdminDictionary(getAdminLocale());
  const t = all.products;

  return (
    <main className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-2xl">{t.title}</h1>
        <Link href="/admin/productos/new" className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay text-white">
          {t.new}
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="opacity-60">{t.none}</p>
      ) : (
        <>
          {/* Narrow screens: compact rows, tap to expand details below the name — no horizontal scroll. */}
          <div className="lg:hidden border border-[rgba(20,25,43,0.1)] rounded-[4px] overflow-hidden divide-y divide-[rgba(20,25,43,0.06)]">
            {products.map((p) => {
              const s = stats.get(p.id) ?? { count: 0, revenueCents: 0 };
              return (
                <details key={p.id} className="group">
                  <summary className="flex items-center gap-3.5 py-3.5 px-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt="" className="w-11 h-11 rounded-[3px] object-cover border border-[rgba(20,25,43,0.1)] flex-shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-[3px] bg-[rgba(20,25,43,0.05)] flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate text-sm">{p.name}</div>
                      <div className="text-[11.5px] opacity-45 font-mono truncate">/shop/{p.slug}</div>
                    </div>
                    <svg
                      className="w-4 h-4 opacity-40 flex-shrink-0 transition-transform group-open:rotate-180"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>
                  <div className="px-4 pb-4 pl-[4.25rem]">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm mb-3.5">
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wide opacity-45 font-mono mb-0.5">{t.columns.category}</div>
                        <div>{t.categories[p.category] ?? p.category}</div>
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wide opacity-45 font-mono mb-0.5">{t.columns.price}</div>
                        <div className="tabular-nums">{p.price_cents === 0 ? all.common.free : `$${(p.price_cents / 100).toFixed(2)}`}</div>
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wide opacity-45 font-mono mb-0.5">{t.columns.sales}</div>
                        <div className="tabular-nums">{s.count}</div>
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wide opacity-45 font-mono mb-0.5">{t.columns.revenue}</div>
                        <div className="tabular-nums">${(s.revenueCents / 100).toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ProductActiveToggle productId={p.id} active={p.active} />
                      <Link href={`/admin/productos/${p.id}/edit`} className="font-mono text-[11px] uppercase tracking-wide underline opacity-70">
                        {t.edit}
                      </Link>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>

          {/* Wide screens: full table, everything visible at once. */}
          <div className="hidden lg:block border border-[rgba(20,25,43,0.1)] rounded-[4px] overflow-hidden max-w-4xl">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left bg-[rgba(20,25,43,0.025)] border-b border-[rgba(20,25,43,0.1)]">
                  <th className="py-3 pl-5 pr-3 font-mono text-[10.5px] uppercase tracking-wide opacity-50 font-medium">{t.columns.product}</th>
                  <th className="py-3 px-3 font-mono text-[10.5px] uppercase tracking-wide opacity-50 font-medium">{t.columns.category}</th>
                  <th className="py-3 px-3 font-mono text-[10.5px] uppercase tracking-wide opacity-50 font-medium text-right">{t.columns.price}</th>
                  <th className="py-3 px-3 font-mono text-[10.5px] uppercase tracking-wide opacity-50 font-medium text-right">{t.columns.sales}</th>
                  <th className="py-3 px-3 font-mono text-[10.5px] uppercase tracking-wide opacity-50 font-medium text-right">{t.columns.revenue}</th>
                  <th className="py-3 pl-3 pr-5 font-mono text-[10.5px] uppercase tracking-wide opacity-50 font-medium">{t.columns.status}</th>
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
                            <div className="text-[11.5px] opacity-45 font-mono truncate">/shop/{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-[10.5px] uppercase tracking-wide px-2 py-1 rounded-full border border-[rgba(20,25,43,0.15)] opacity-70">
                          {t.categories[p.category] ?? p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right tabular-nums opacity-80">
                        {p.price_cents === 0 ? all.common.free : `$${(p.price_cents / 100).toFixed(2)}`}
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
        </>
      )}
    </main>
  );
}
