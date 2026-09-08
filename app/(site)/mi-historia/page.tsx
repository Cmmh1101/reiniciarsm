import type { Metadata } from "next";

// Still a placeholder ("en construcción") — keep it out of search results until real content ships.
export const metadata: Metadata = {
  title: "Mi historia — Carla Montaño",
  robots: { index: false, follow: true },
};

export default function MiHistoriaPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">Mi historia</p>
        <h1 className="font-display text-3xl md:text-5xl mb-4">Esta página está en construcción.</h1>
        <p className="opacity-70">Vuelve pronto para leer la historia completa.</p>
      </div>
    </main>
  );
}
