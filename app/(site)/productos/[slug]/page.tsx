import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { getApprovedReviewsForProduct, getProductStats, MIN_PURCHASES_TO_SHOW_COUNT, MIN_REVIEWS_TO_SHOW_RATING } from "@/lib/productReviews";
import ProductBuyForm from "@/components/ProductBuyForm";
import StarRating from "@/components/StarRating";

// Products publish through the admin panel at runtime — fetch fresh every request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  const title = `${product.name} — Carla Montaño`;
  const description = product.description ?? undefined;
  return {
    title,
    description,
    openGraph: { title, description, url: `/productos/${product.slug}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [statsMap, reviews] = await Promise.all([getProductStats(), getApprovedReviewsForProduct(product.id)]);
  const stats = statsMap.get(product.id);
  const showRating = stats && stats.reviewCount >= MIN_REVIEWS_TO_SHOW_RATING && stats.avgRating !== null;
  const showPurchaseCount = stats && stats.purchaseCount >= MIN_PURCHASES_TO_SHOW_COUNT;

  return (
    <main className="px-[8vw] py-24">
      <Link
        href="/productos"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide opacity-60 hover:opacity-100 transition-opacity mb-10"
      >
        ← Ver todos los productos
      </Link>
      <div className={`grid gap-16 ${product.image_url ? "md:grid-cols-[1fr_1fr] max-w-[1000px]" : "max-w-[560px]"}`}>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">{product.category}</p>
          <h1 className="font-display text-[clamp(28px,3.6vw,40px)] leading-[1.1] mb-5">{product.name}</h1>
          {product.description && <p className="text-base opacity-90 mb-6 max-w-[48ch]">{product.description}</p>}
          {(showRating || showPurchaseCount) && (
            <div className="flex items-center gap-3 mb-5">
              {showRating && <StarRating avgRating={stats!.avgRating!} reviewCount={stats!.reviewCount} size="md" />}
              {showRating && showPurchaseCount && <span className="opacity-30">·</span>}
              {showPurchaseCount && <span className="font-mono text-xs opacity-60">{stats!.purchaseCount} compras</span>}
            </div>
          )}
          <p className="font-display text-3xl text-clay mb-8">
            {product.price_cents === 0 ? "Gratis" : `$${(product.price_cents / 100).toFixed(2)}`}
          </p>
          <ProductBuyForm productId={product.id} priceCents={product.price_cents} />
        </div>
        {product.image_url && (
          <div className="order-first md:order-last">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full rounded-[3px] border border-[rgba(20,25,43,0.12)]"
            />
          </div>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="max-w-[560px] mt-20 pt-12 border-t border-[rgba(20,25,43,0.1)]">
          <h2 className="font-display text-xl mb-6">Lo que dicen quienes ya lo compraron</h2>
          <div className="flex flex-col gap-6">
            {reviews.map((r) => (
              <div key={r.id} className="pb-6 border-b border-[rgba(20,25,43,0.08)] last:border-b-0 last:pb-0">
                <span className="text-clay text-sm" aria-hidden>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
                {r.comment && <p className="text-sm opacity-80 mt-2">{r.comment}</p>}
                <p className="font-mono text-[10.5px] opacity-45 mt-2">
                  {r.reviewerName?.trim() || "Cliente verificado"} — {new Date(r.created_at).toLocaleDateString("es")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
