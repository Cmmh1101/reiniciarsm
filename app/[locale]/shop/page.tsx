import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActiveProducts, localizeProduct } from "@/lib/products";
import { getProductStats, withProductStats } from "@/lib/productReviews";
import ProductsGrid from "@/components/ProductsGrid";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";

// Products publish through the admin panel at runtime — fetch fresh every request.
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { shop } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "shop", title: shop.meta.title, description: shop.meta.description });
}

export default async function ShopPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { shop, common } = getDictionary(locale);

  const [products, stats] = await Promise.all([getActiveProducts(), getProductStats()]);
  const productsWithStats = withProductStats(products.map((p) => localizeProduct(p, locale)), stats);

  return (
    <main className="px-page py-24">
      <header className="mb-16">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-deep mb-4">{shop.eyebrow}</p>
        <h1 className="font-display text-[clamp(30px,4vw,48px)] leading-[1.08] mb-4 max-w-[20ch]">{shop.title}</h1>
        <p className="opacity-75 max-w-[56ch] text-base">{shop.lead}</p>
        {shop.languageNote && <p className="font-mono text-[11px] opacity-70 mt-4 max-w-[60ch]">{shop.languageNote}</p>}
      </header>

      {productsWithStats.length === 0 ? (
        <p className="opacity-70">{shop.empty}</p>
      ) : (
        <ProductsGrid products={productsWithStats} locale={locale} copy={{ allCategories: common.allCategories, free: common.free, purchases: common.purchases }} />
      )}
    </main>
  );
}
