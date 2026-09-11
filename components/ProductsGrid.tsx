"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";

export default function ProductsGrid({ products }: { products: Product[] }) {
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
          <Link key={p.id} href={`/productos/${p.slug}`} className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-6 flex flex-col gap-3">
            <span className="font-mono text-[10px] tracking-wide uppercase text-clay">{p.category}</span>
            <h3 className="text-lg font-display">{p.name}</h3>
            {p.description && <p className="text-sm opacity-70">{p.description}</p>}
            <span className="font-mono text-sm mt-auto">${(p.price_cents / 100).toFixed(2)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
