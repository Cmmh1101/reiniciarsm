import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import ProductBuyForm from "@/components/ProductBuyForm";

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
    </main>
  );
}
