import type { Metadata } from "next";
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
      <div className="grid md:grid-cols-[1fr_1fr] gap-16 max-w-[900px]">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">{product.category}</p>
          <h1 className="font-display text-[clamp(28px,3.6vw,40px)] leading-[1.1] mb-5">{product.name}</h1>
          {product.description && <p className="text-base opacity-90 mb-6 max-w-[48ch]">{product.description}</p>}
          <p className="font-display text-3xl text-clay mb-8">
            {product.price_cents === 0 ? "Gratis" : `$${(product.price_cents / 100).toFixed(2)}`}
          </p>
          <ProductBuyForm productId={product.id} priceCents={product.price_cents} />
        </div>
      </div>
    </main>
  );
}
