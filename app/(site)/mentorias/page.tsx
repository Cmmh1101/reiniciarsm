import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentorías — Carla Montaño",
};

export default function MentoriasPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">Mentorías</p>
        <h1 className="font-display text-3xl md:text-5xl mb-4">Esta página está en construcción.</h1>
        <p className="opacity-70">El agendamiento y pago de Mentoría 1:1 llegan en una próxima fase.</p>
      </div>
    </main>
  );
}
