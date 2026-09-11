import Link from "next/link";
import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/products";

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

      {products.length === 0 ? (
        <p className="opacity-60">Todavía no hay productos disponibles.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-7">
          {products.map((p) => (
            <Link key={p.id} href={`/productos/${p.slug}`} className="border border-[rgba(20,25,43,0.12)] rounded-[2px] p-6 flex flex-col gap-3">
              <h3 className="text-lg font-display">{p.name}</h3>
              {p.description && <p className="text-sm opacity-70">{p.description}</p>}
              <span className="font-mono text-sm text-clay mt-auto">${(p.price_cents / 100).toFixed(2)}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
