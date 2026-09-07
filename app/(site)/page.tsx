import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { SKOOL_COMMUNITY_URL } from "@/lib/constants";
import { NewsletterFormHome } from "@/components/NewsletterForm";

// Blog posts publish through the admin CMS at runtime, not via a redeploy —
// this page must fetch fresh on every request, not bake posts into the build.
export const dynamic = "force-dynamic";

const PILLARS = [
  { num: "01", name: "Mentalidad", icon: <><circle cx="16" cy="16" r="10" /><path d="M16 10v6l4 3" /></> },
  { num: "02", name: "Dirección", icon: <><circle cx="16" cy="16" r="11" /><path d="M16 9l3 6-3 2-3-2z" /></> },
  { num: "03", name: "Tecnología e IA", icon: <><path d="M8 22l6-12 4 7 3-4 3 9" /><circle cx="14" cy="10" r="1.4" /></> },
  { num: "04", name: "Empleabilidad", icon: <><rect x="7" y="12" width="18" height="12" rx="1.5" /><path d="M12 12v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></> },
  { num: "05", name: "Inglés profesional", icon: <><path d="M7 12h18M7 18h12" /><circle cx="16" cy="16" r="11" /></> },
  { num: "06", name: "Productividad", icon: <><path d="M8 24V14l8-6 8 6v10" /><path d="M13 24v-6h6v6" /></> },
  { num: "07", name: "Bienestar", icon: <path d="M16 25c-5-4-9-7.5-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4.5-4 8-9 12z" /> },
  { num: "08", name: "Comunidad", icon: <><circle cx="11" cy="13" r="3.4" /><circle cx="22" cy="13" r="3.4" /><path d="M6 24c0-3.5 2.5-6 5-6s5 2.5 5 6M16 24c0-3.5 2.5-6 5-6s5 2.5 5 6" /></> },
];

const ROUTE_STEPS = [
  "Venezuela",
  "Emigración",
  "Inglés desde cero",
  "Software Engineer",
  "Empleo remoto → renuncia",
  "Regreso, emprender",
  "NEXT YOU™",
];

export default async function Home() {
  const posts = await getPublishedPosts(4);

  return (
    <main>
      {/* HERO */}
      <header className="bg-ink text-paper relative overflow-hidden px-[8vw] pt-20 pb-24 min-h-[88vh] flex flex-col justify-center">
        <svg
          className="hero-path absolute inset-0 z-[1] opacity-90"
          viewBox="0 0 1200 700"
          preserveAspectRatio="none"
        >
          <line className="grid-line" x1="0" y1="175" x2="1200" y2="175" />
          <line className="grid-line" x1="0" y1="350" x2="1200" y2="350" />
          <line className="grid-line" x1="0" y1="525" x2="1200" y2="525" />
          <line className="grid-line" x1="800" y1="0" x2="800" y2="700" />
          <line className="grid-line" x1="1000" y1="0" x2="1000" y2="700" />
          <path d="M 700 600 C 780 630, 830 560, 860 500 S 960 400, 930 340 S 850 260, 940 220 S 1080 210, 1120 140" />
          <circle cx="700" cy="600" r="5" style={{ animationDelay: ".4s" }} />
          <circle cx="860" cy="500" r="5" style={{ animationDelay: "1s" }} />
          <circle cx="930" cy="340" r="5" style={{ animationDelay: "1.6s" }} />
          <circle cx="1120" cy="140" r="6" fill="var(--clay)" style={{ animationDelay: "2.4s" }} />
        </svg>
        <div className="relative z-[2] max-w-[880px]">
          <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">
            Reiniciar Sin Mapa · el movimiento
          </p>
          <h1 className="font-display text-[clamp(36px,5.6vw,72px)] leading-[1.05] mb-6">
            No necesitas tener
            <br />
            todo resuelto
            <br />
            para <em className="italic text-clay-soft font-normal">comenzar.</em>
          </h1>
          <p className="text-lg max-w-[56ch] opacity-80 mb-9">
            Construimos juntos tu próxima versión. Soy Carla Montaño — Software Engineer sin
            título tradicional, migrante, madre — y esta es la metodología NEXT YOU™ para
            reinventar tu carrera con evidencia, no solo con motivación.
          </p>
          <div className="flex gap-4 flex-wrap mb-14">
            <Link
              href="/diagnostico-next-you"
              className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform"
            >
              Haz el Diagnóstico Next You →
            </Link>
            <a
              href="#pilares"
              className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] border border-current opacity-85 hover:opacity-100 inline-flex items-center gap-2.5 transition-opacity"
            >
              Ver cómo funciona
            </a>
          </div>
          <div className="flex gap-7 flex-wrap font-mono text-[11px] tracking-wide opacity-55">
            <span>Software Engineer sin título en tech</span>
            <span className="pl-4 border-l border-[rgba(237,230,216,0.14)]">
              Migrante Venezuela → USA
            </span>
            <span className="pl-4 border-l border-[rgba(237,230,216,0.14)]">
              Mentora de cientos de reinicios
            </span>
          </div>
        </div>
      </header>

      {/* METODOLOGÍA / 3 PASOS */}
      <section className="px-[8vw] py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">Tu próximo paso</p>
          <h2 className="font-display text-[clamp(28px,3.4vw,42px)] mb-3.5">Elige dónde empezar</h2>
          <p className="opacity-70 text-base">
            No hay un solo camino correcto — hay un siguiente paso. Aquí están los tres.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-[rgba(20,25,43,0.12)]">
          <div className="bg-paper p-10 flex flex-col gap-4 min-h-[340px]">
            <span className="font-mono text-xs text-clay opacity-90">01</span>
            <h3 className="text-2xl font-display font-semibold">Descubre tu Next You</h3>
            <p className="opacity-75 text-[14.5px]">
              Un diagnóstico de 8 minutos que identifica cuál de los 8 pilares necesita tu
              atención ahora mismo.
            </p>
            <ul className="flex flex-col gap-2 mt-auto mb-5">
              {["Diagnóstico gratuito", "Resultado personalizado", "Sin compromiso"].map((t) => (
                <li key={t} className="text-[13.5px] opacity-65 pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-sage">
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/diagnostico-next-you" className="font-mono text-xs tracking-wide uppercase text-clay inline-flex items-center gap-1.5">
              Empezar diagnóstico →
            </Link>
          </div>
          <div className="bg-paper p-10 flex flex-col gap-4 min-h-[340px]">
            <span className="font-mono text-xs text-clay opacity-90">02</span>
            <h3 className="text-2xl font-display font-semibold">Únete a la Comunidad Next You</h3>
            <p className="opacity-75 text-[14.5px]">
              El hogar de quienes están reiniciando en paralelo a ti — retos mensuales, sesiones
              en vivo y acompañamiento real.
            </p>
            <ul className="flex flex-col gap-2 mt-auto mb-5">
              {["8 canales por pilar", "Sesiones en vivo mensuales", "Muro de victorias"].map((t) => (
                <li key={t} className="text-[13.5px] opacity-65 pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-sage">
                  {t}
                </li>
              ))}
            </ul>
            <a
              href={SKOOL_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-wide uppercase text-clay inline-flex items-center gap-1.5"
            >
              Entrar a la comunidad →
            </a>
          </div>
          <div className="bg-paper p-10 flex flex-col gap-4 min-h-[340px]">
            <span className="font-mono text-xs text-clay opacity-90">03</span>
            <h3 className="text-2xl font-display font-semibold">Bootcamp o Mentoría</h3>
            <p className="opacity-75 text-[14.5px]">
              Cuando estés listo para una transformación estructurada, con acompañamiento directo
              y resultados medibles.
            </p>
            <ul className="flex flex-col gap-2 mt-auto mb-5">
              {["Cohortes por temporada", "Plan personalizado", "Acompañamiento 1:1"].map((t) => (
                <li key={t} className="text-[13.5px] opacity-65 pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-sage">
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/mentorias" className="font-mono text-xs tracking-wide uppercase text-clay inline-flex items-center gap-1.5">
              Ver opciones →
            </Link>
          </div>
        </div>
      </section>

      {/* 8 PILARES */}
      <section id="pilares" className="bg-paper-soft px-[8vw] py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">La metodología</p>
          <h2 className="font-display text-[clamp(28px,3.4vw,42px)] mb-3.5">NEXT YOU™ — los ocho pilares</h2>
          <p className="opacity-70 text-base">
            No se trata solo de tecnología. Se trata de reconstruir cada parte que sostiene tu
            próxima versión.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {PILLARS.map((p) => (
            <div key={p.num} className="border border-[rgba(20,25,43,0.12)] bg-paper rounded-[2px] px-5 py-6.5 flex flex-col gap-3.5">
              <span className="font-mono text-[10.5px] opacity-45">{p.num}</span>
              <svg viewBox="0 0 32 32" fill="none" strokeWidth="1.6" stroke="var(--ink)" className="w-6.5 h-6.5">
                {p.icon}
              </svg>
              <h4 className="text-[15px] font-semibold">{p.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* HISTORIA (TEASER) */}
      <section id="historia" className="px-[8vw] py-24">
        <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-16 items-center">
          <div className="aspect-[4/5] rounded-[2px] bg-gradient-to-br from-[#8a7458] to-[#3a4562] relative overflow-hidden">
            <span className="absolute bottom-3.5 left-3.5 font-mono text-[10px] text-paper opacity-70">
              Foto documental — Carla en proceso
            </span>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">Hola, soy Carla</p>
            <h2 className="font-display text-[clamp(28px,3.4vw,42px)] mb-5">
              No empecé sabiendo el camino. Lo construí reiniciando seis veces.
            </h2>
            <p className="opacity-85 text-base max-w-[52ch] mb-4">
              Fui madre joven. Emigré de Venezuela a Estados Unidos sin hablar inglés. Trabajé en
              empleos informales mientras aprendía sola. Cambié de carrera y me convertí en
              Software Engineer sin título tradicional en tecnología. Conseguí empleo remoto — y
              renuncié. Volví a Venezuela. Emprendí de nuevo.
            </p>
            <p className="font-display italic text-2xl text-clay my-6 max-w-[20ch]">
              &ldquo;Cada reinicio dejó una herramienta. Juntas, se convirtieron en un
              método.&rdquo;
            </p>
            <Link
              href="/mi-historia"
              className="font-mono text-xs tracking-wide uppercase border border-current opacity-85 hover:opacity-100 px-[26px] py-[15px] rounded-[2px] inline-flex items-center gap-2.5 transition-opacity"
            >
              Lee mi historia completa →
            </Link>
          </div>
        </div>
      </section>

      {/* RUTA / FIRMA */}
      <section className="bg-ink text-paper px-[8vw] py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">La ruta</p>
          <h2 className="font-display text-[clamp(28px,3.4vw,42px)] mb-3.5">Siete reinicios, un método</h2>
          <p className="opacity-60 text-base">
            El arco real detrás de NEXT YOU™ — sin mapa, pero con coordenadas.
          </p>
        </div>
        <div className="bg-ink-soft border border-[rgba(237,230,216,0.14)] rounded-[2px] p-9 overflow-x-auto">
          <svg viewBox="0 0 1100 260" width="100%" style={{ minWidth: 600 }}>
            <path
              d="M 40 210 C 140 230, 190 180, 230 155 S 340 100, 300 70 S 210 40, 300 25 S 520 20, 570 75 S 610 180, 730 165 S 900 80, 1050 40"
              fill="none"
              stroke="var(--clay-soft)"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.85"
            />
            <g fontFamily="IBM Plex Mono" fontSize="10" fill="var(--paper)" opacity="0.6">
              <circle cx="40" cy="210" r="5" fill="var(--paper)" />
              <circle cx="230" cy="155" r="5" fill="var(--paper)" />
              <circle cx="300" cy="70" r="5" fill="var(--paper)" />
              <circle cx="300" cy="25" r="5" fill="var(--paper)" />
              <circle cx="570" cy="75" r="5" fill="var(--paper)" />
              <circle cx="730" cy="165" r="5" fill="var(--paper)" />
              <circle cx="1050" cy="40" r="6" fill="var(--clay-soft)" />
            </g>
          </svg>
          <div className="grid gap-3.5 mt-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
            {ROUTE_STEPS.map((step, i) => (
              <div key={step} className="text-[12.5px]">
                <span className="font-mono text-clay-soft mr-1.5">{String(i + 1).padStart(2, "0")}</span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMUNIDAD BANNER */}
      <section className="bg-clay text-paper px-[8vw] py-24 flex justify-between items-center gap-8 flex-wrap">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink opacity-70 mb-4">
            Comunidad Next You
          </p>
          <h2 className="font-display text-[clamp(26px,3vw,38px)] max-w-[16ch]">No vas a reiniciar sola.</h2>
        </div>
        <a
          href={SKOOL_COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-ink text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform"
        >
          Entrar a la comunidad →
        </a>
      </section>

      {/* BLOG PREVIEW */}
      <section id="blog" className="px-[8vw] py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">Recursos por pilar</p>
          <h2 className="font-display text-[clamp(28px,3.4vw,42px)]">
            Historias, guías e ideas para tu reinicio
          </h2>
        </div>
        {posts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="border border-[rgba(20,25,43,0.12)] rounded-[2px] overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-[#8a7458] to-[#c9a874]" />
                <div className="p-4.5 flex flex-col gap-2.5 flex-1">
                  <span className="font-mono text-[10px] tracking-wide uppercase text-clay">{post.pillar}</span>
                  <h4 className="text-[15.5px] leading-snug">{post.title}</h4>
                  <span className="font-mono text-[11px] opacity-45 mt-auto">
                    {post.published_at &&
                      new Date(post.published_at).toLocaleDateString("es", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="opacity-60">Los primeros posts están en camino.</p>
        )}
      </section>

      {/* NEWSLETTER */}
      <section className="bg-paper-soft text-center px-[8vw] py-24">
        <div className="max-w-[560px] mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4 justify-center flex">
            Newsletter
          </p>
          <h2 className="font-display text-[clamp(28px,3.4vw,42px)] mb-3.5">Un paso a la vez, cada semana</h2>
          <p className="opacity-70 text-base mb-7">
            Recursos, historias y método directo a tu bandeja. Gratis, siempre.
          </p>
          <NewsletterFormHome />
        </div>
      </section>
    </main>
  );
}
