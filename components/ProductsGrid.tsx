"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MIN_PURCHASES_TO_SHOW_COUNT, MIN_REVIEWS_TO_SHOW_RATING, type ProductWithStats } from "@/lib/productReviews";
import StarRating from "@/components/StarRating";

export default function ProductsGrid({ products }: { products: ProductWithStats[] }) {
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return [...set];
  }, [products]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory ? products.filter((p) => p.category === activeCategory) : products;

  if (categories.length === 0) return null;

  return (
    <div>
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2.5 mb-10">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`font-mono text-[11px] uppercase tracking-wide px-4 py-2 rounded-full border transition-colors ${
              activeCategory === null ? "bg-ink text-paper border-ink" : "border-[rgba(20,25,43,0.2)] opacity-70"
            }`}
          >
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCategory(c)}
              className={`font-mono text-[11px] uppercase tracking-wide px-4 py-2 rounded-full border transition-colors ${
                activeCategory === c ? "bg-ink text-paper border-ink" : "border-[rgba(20,25,43,0.2)] opacity-70"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-7">
        {filtered.map((p) => (
          <Link key={p.id} href={`/productos/${p.slug}`} className="border border-[rgba(20,25,43,0.12)] rounded-[2px] overflow-hidden flex flex-col">
            {p.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image_url} alt="" className="w-full aspect-[4/3] object-cover" />
            ) : (
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#8a7458] to-[#c9a874]" />
            )}
            <div className="p-6 flex flex-col gap-3 flex-1">
              <span className="font-mono text-[10px] tracking-wide uppercase text-clay">{p.category}</span>
              <h3 className="text-lg font-display">{p.name}</h3>
              {p.description && <p className="text-sm opacity-70">{p.description}</p>}
              {p.reviewCount >= MIN_REVIEWS_TO_SHOW_RATING && p.avgRating !== null && (
                <StarRating avgRating={p.avgRating} reviewCount={p.reviewCount} />
              )}
              <div className="mt-auto flex items-center justify-between gap-2">
                <span className="font-mono text-sm">{p.price_cents === 0 ? "Gratis" : `$${(p.price_cents / 100).toFixed(2)}`}</span>
                {p.purchaseCount >= MIN_PURCHASES_TO_SHOW_COUNT && (
                  <span className="font-mono text-[10.5px] opacity-50">{p.purchaseCount} compras</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
