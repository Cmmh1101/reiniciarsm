import type { Metadata } from "next";
import { SKOOL_COMMUNITY_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Comunidad Next You — Carla Montaño",
  description: "El hogar de quienes están reiniciando en paralelo a ti — retos mensuales, sesiones en vivo y acompañamiento real.",
  openGraph: {
    title: "Comunidad Next You — Carla Montaño",
    description: "El hogar de quienes están reiniciando en paralelo a ti — retos mensuales, sesiones en vivo y acompañamiento real.",
    url: "/comunidad",
  },
  twitter: {
    card: "summary_large_image",
    title: "Comunidad Next You — Carla Montaño",
    description: "El hogar de quienes están reiniciando en paralelo a ti — retos mensuales, sesiones en vivo y acompañamiento real.",
  },
};

const REASONS = [
  "No sentirte sola mientras aprendes algo nuevo",
  "Mantenerte constante sin depender solo de la motivación",
  "Avanzar con más claridad y menos confusión",
  "Ganar confianza al ver a otras personas en el mismo camino",
  "Tener un espacio seguro para preguntar, equivocarte y aprender",
];

const WEEK = [
  { day: "Lunes", detail: "Planteo la intención de la semana, ligada a un pilar específico y un micro-reto concreto." },
  { day: "Miércoles", detail: "Check-in con tu accountability partner del mes." },
  { day: "Viernes", detail: "Compartimos avances en el Muro de Victorias — grandes o pequeños, todos cuentan." },
  { day: "Una vez al mes", detail: "Sesión en vivo conmigo, profundizando un pilar." },
];

const METHOD_PHASES = [
  { name: "Giro", promise: "Rompes la creencia de que es imposible, y eliges un rumbo.", pillars: "Mentalidad + Dirección" },
  { name: "Ruta", promise: "Construyes lo que el mercado necesita ver de ti.", pillars: "Tecnología e IA + Empleabilidad + Inglés" },
  { name: "Ritmo", promise: "Lo sostienes sin quemarte.", pillars: "Productividad + Bienestar" },
];

const INCLUDES = [
  "8 canales, organizados en 3 fases: Giro, Ruta, Ritmo",
  "Sesiones en vivo mensuales",
  "Accountability partners",
  "Muro de Victorias",
  "Retos mensuales ligados a tu fase actual",
  "No necesitas tener nada resuelto antes de entrar",
];

export default function ComunidadPage() {
  return (
    <main>
      <header className="bg-ink text-paper px-[8vw] pt-24 pb-20 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">Comunidad Next You</p>
        <h1 className="font-display text-[clamp(32px,5vw,54px)] leading-[1.1] mb-5 max-w-[18ch] mx-auto">
          No vas a reiniciar sola.
        </h1>
        <p className="text-lg max-w-[56ch] mx-auto opacity-80 mb-9">
          El hogar de quienes están reiniciando en paralelo a ti — retos mensuales, sesiones en vivo y acompañamiento
          real, organizado en 3 fases: Giro, Ruta, Ritmo.
        </p>
        <a
          href={SKOOL_COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform"
        >
          Únete a la Comunidad Next You →
        </a>
      </header>

      <section className="px-[8vw] py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">¿Por qué una comunidad?</p>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)]">Aprender acompañada marca la diferencia</h2>
          <p className="opacity-70 text-base mt-3.5">
            Reinventar tu carrera no es solo adquirir conocimientos. Es sostener el proceso cuando aparecen la duda,
            el miedo o el cansancio. Ahí es donde la comunidad cambia todo.
          </p>
        </div>
        <div className="border-t border-[rgba(20,25,43,0.12)]">
          {REASONS.map((reason) => (
            <div key={reason} className="flex gap-4 py-5 border-b border-[rgba(20,25,43,0.12)] items-start">
              <span className="font-mono text-clay text-sm pt-0.5">—</span>
              <p className="text-base">{reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-[8vw] py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">El método</p>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)] mb-3.5">Giro. Ruta. Ritmo.</h2>
          <p className="opacity-70 text-base">No es una lista de 8 temas sueltos — es un camino, en orden, con un destino claro en cada fase.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-[rgba(20,25,43,0.12)] mb-8">
          {METHOD_PHASES.map((phase, i) => (
            <div key={phase.name} className="bg-paper p-8 flex flex-col gap-2.5">
              <span className="font-mono text-xs text-clay">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-2xl">{phase.name}</h3>
              <p className="text-sm opacity-75">{phase.promise}</p>
              <p className="font-mono text-[11px] uppercase tracking-wide opacity-50 mt-auto pt-3">{phase.pillars}</p>
            </div>
          ))}
        </div>
        <div className="bg-ink text-paper rounded-[2px] px-7 py-6 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-6">
          <span className="font-mono text-[10.5px] uppercase tracking-widest text-clay-soft shrink-0">Comunidad</span>
          <p className="text-sm opacity-85">No es una fase más — es el espacio que te acompaña en las 3. No reinventarte a solas.</p>
        </div>
      </section>

      <section className="bg-ink text-paper px-[8vw] py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">Cómo funciona</p>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)] mb-3.5">Así se ve una semana adentro</h2>
          <p className="opacity-70 text-base">Un espacio vivo y real — avanzamos paso a paso, sin presión ni comparaciones.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-[rgba(237,230,216,0.14)]">
          {WEEK.map((item) => (
            <div key={item.day} className="bg-ink-soft p-8">
              <h4 className="font-display text-lg mb-2">{item.day}</h4>
              <p className="text-sm opacity-75">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper-soft px-[8vw] py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">Qué incluye</p>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)]">Todo alrededor de Giro, Ruta, Ritmo</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
          {INCLUDES.map((item) => (
            <div key={item} className="bg-paper border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
              <p className="text-sm">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-clay text-paper text-center px-[8vw] py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-ink opacity-70 mb-4 flex justify-center">
          Hola, soy Carla
        </p>
        <h2 className="font-display text-[clamp(26px,3.4vw,42px)] max-w-[24ch] mx-auto mb-5">
          Yo tampoco lo hice sola. Y no creo que tú debas hacerlo tampoco.
        </h2>
        <p className="max-w-[52ch] mx-auto opacity-90 mb-8">
          No necesitas tener todo resuelto para entrar. Solo el siguiente paso.
        </p>
        <a
          href={SKOOL_COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-ink text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform"
        >
          Únete a la Comunidad Next You →
        </a>
      </section>
    </main>
  );
}
