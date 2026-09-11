import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/products";
import ProductsGrid from "@/components/ProductsGrid";

// Products publish through the admin panel at runtime — fetch fresh every request.
export const dynamic = "force-dynamic";

const TITLE = "Productos — Carla Montaño";
const DESCRIPTION = "Guías y recursos descargables para tu reinicio.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/productos" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default async function ProductosPage() {
  const products = await getActiveProducts();

  return (
    <main className="px-[8vw] py-24">
      <header className="mb-16">
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">Productos</p>
        <h1 className="font-display text-[clamp(30px,4vw,44px)] leading-[1.1] mb-4">
          Guías Para Tu Próximo Paso
        </h1>
        <p className="opacity-75 max-w-[56ch] text-base">
          Recursos descargables, directo a tu correo después de comprar.
        </p>
      </header>

      {products.length === 0 ? <p className="opacity-60">Todavía no hay productos disponibles.</p> : <ProductsGrid products={products} />}
    </main>
  );
}
