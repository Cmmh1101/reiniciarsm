import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, localizeProduct } from "@/lib/products";
import { productCategoryLabel } from "@/lib/taxonomy";
import { getApprovedReviewsForProduct, getProductStats, MIN_PURCHASES_TO_SHOW_COUNT, MIN_REVIEWS_TO_SHOW_RATING } from "@/lib/productReviews";
import ProductBuyForm from "@/components/ProductBuyForm";
import StarRating from "@/components/StarRating";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localizedPath } from "@/lib/i18n/routes";

// Products publish through the admin panel at runtime — fetch fresh every request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const found = await getProductBySlug(params.slug);
  if (!found) return {};
  const product = localizeProduct(found, params.locale);
  return pageMetadata({
    locale: params.locale,
    route: "shopProduct",
    params: { slug: product.slug },
    title: `${product.name} — Carla Montaño`,
    description: product.description ?? getDictionary(params.locale).shop.meta.description,
  });
}

export default async function ProductPage({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { shop, common } = getDictionary(locale);

  const found = await getProductBySlug(params.slug);
  if (!found) notFound();
  const product = localizeProduct(found, locale);

  const [statsMap, reviews] = await Promise.all([getProductStats(), getApprovedReviewsForProduct(product.id)]);
  const stats = statsMap.get(product.id);
  const showRating = stats && stats.reviewCount >= MIN_REVIEWS_TO_SHOW_RATING && stats.avgRating !== null;
  const showPurchaseCount = stats && stats.purchaseCount >= MIN_PURCHASES_TO_SHOW_COUNT;

  return (
    <main className="px-page py-24">
      <Link
        href={localizedPath(locale, "shop")}
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide opacity-60 hover:opacity-100 transition-opacity mb-10"
      >
        {common.backToShop}
      </Link>
      <div className={`grid gap-16 ${product.image_url ? "md:grid-cols-[1fr_1fr] max-w-[1000px]" : "max-w-[560px]"}`}>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">{productCategoryLabel(product.category, locale)}</p>
          <h1 className="font-display text-[clamp(28px,3.6vw,40px)] leading-[1.1] mb-5">{product.name}</h1>
          {product.description && <p className="text-base opacity-90 mb-6 max-w-[48ch]">{product.description}</p>}
          {(showRating || showPurchaseCount) && (
            <div className="flex items-center gap-3 mb-5">
              {showRating && <StarRating avgRating={stats!.avgRating!} reviewCount={stats!.reviewCount} size="md" />}
              {showRating && showPurchaseCount && <span className="opacity-30">·</span>}
              {showPurchaseCount && (
                <span className="font-mono text-xs opacity-60">
                  {stats!.purchaseCount} {common.purchases}
                </span>
              )}
            </div>
          )}
          <p className="font-display text-3xl text-clay mb-8">{product.price_cents === 0 ? common.free : `$${(product.price_cents / 100).toFixed(2)}`}</p>
          <ProductBuyForm productId={product.id} priceCents={product.price_cents} locale={locale} copy={shop.buyForm} />
        </div>
        {product.image_url && (
          <div className="order-first md:order-last">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image_url} alt={product.name} className="w-full rounded-[3px] border border-[rgba(20,25,43,0.12)]" />
          </div>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="max-w-[560px] mt-20 pt-12 border-t border-[rgba(20,25,43,0.1)]">
          <h2 className="font-display text-xl mb-6">{shop.reviewsTitle}</h2>
          <div className="flex flex-col gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="pb-6 border-b border-[rgba(20,25,43,0.08)] last:border-b-0 last:pb-0">
                <span className="text-clay text-sm" aria-hidden>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
                {r.comment && <p className="text-sm opacity-80 mt-2">{r.comment}</p>}
                <p className="font-mono text-[10.5px] opacity-45 mt-2">
                  {r.reviewerName?.trim() || shop.verifiedBuyer} — {new Date(r.created_at).toLocaleDateString(locale)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
