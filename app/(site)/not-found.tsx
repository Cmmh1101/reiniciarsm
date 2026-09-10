import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada — Carla Montaño",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-[8vw] text-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">Error 404</p>
        <h1 className="font-display text-[clamp(30px,4.4vw,48px)] leading-[1.1] mb-5 max-w-[20ch] mx-auto">
          Esta página no existe. Tu siguiente paso sí.
        </h1>
        <p className="opacity-70 text-base max-w-[52ch] mx-auto mb-10">
          El enlace puede estar roto o la página se movió. Mientras lo resolvemos, aquí tienes por
          dónde seguir.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="font-mono text-xs tracking-wide uppercase border border-current opacity-85 hover:opacity-100 px-[26px] py-[15px] rounded-[2px] inline-flex items-center gap-2.5 transition-opacity"
          >
            Ir al inicio
          </Link>
          <Link
            href="/diagnostico-next-you"
            className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform"
          >
            Haz el Diagnóstico Next You →
          </Link>
        </div>
      </div>
    </main>
  );
}
