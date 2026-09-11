import type { Metadata } from "next";
import Link from "next/link";
import { CONTIGO_VENEZUELA_URL } from "@/lib/constants";

const HERO_IMAGE_URL = "/images/carla/hero-mi-historia.jpg";

const CONTIGO_IMAGE_URL = "/images/carla/contigove.png";

const TITLE = "No Empecé Sabiendo El Camino. Lo Construí Reiniciando 6+ Veces.";
const DESCRIPTION =
  "Fui madre joven en Venezuela. Emigré a Estados Unidos sin hablar inglés. Trabajé de mesera, limpié casas, cuidé bebés — mientras aprendía sola. Cambié de carrera y me convertí en Software Engineer sin título tradicional en tecnología. Conseguí empleo remoto — y renuncié. Volví a Venezuela. Emprendí de nuevo.";

export const metadata: Metadata = {
  title: "Mi historia — Carla Montaño",
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/mi-historia" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const STORY = [
  "Me gradué de Educación Física, Deporte y Recreación en la Universidad de Carabobo, Venezuela, en 2011. Ya trabajaba como educadora desde 2010, en un colegio bilingüe — sin hablar inglés, por eso nunca opté a un mejor salario.",
  "A finales de 2014 migramos a Estados Unidos: mi esposo, mis dos hijos mayores y yo. Llegamos a Florida sin trabajo, con pagos muy bajos, y yo no podía trabajar porque mi hijo menor no tenía escuela disponible. El 31 de diciembre de ese año nos reubicamos en Memphis, Tennessee, donde mi hermana y su esposo nos recibieron.",
  "Ahí empezó lo que hoy le llamo mi travesía del umbral. Mi primer trabajo en Estados Unidos fue de mesera, junto a mi esposo, en un restaurante mexicano — algo que ninguno de los dos había hecho antes. Después limpié casas y cuidé bebés que no eran míos. Estudié y aprobé una certificación de Personal Trainer completamente en inglés: el primer gran quiebre de creencia sobre mí misma.",
  "En 2016 nació mi tercer hijo, prematuro. Pasamos un mes con él en el hospital. Ese mismo año conseguí mi primer trabajo formal con entrevista en inglés — en el piso de un gimnasio del YMCA. Después entré al sistema escolar por la puerta más humilde posible: el comedor, como técnica auxiliar de alimentos. Semanas más tarde, y a solo dos años de haber llegado sin hablar inglés, logré entrar como profesora de español al sistema público de Shelby County.",
];

const STORY_CONTINUED = [
  "Durante dos años completos entré y salí de ese ciclo: aprendía un poco de HTML y CSS, dudaba, paraba, volvía a intentarlo meses después. Lo que finalmente lo rompió no fue sentir menos miedo — fue un fin de semana como voluntaria en GiveCamp Memphis, en febrero de 2021, construyendo una página web para una organización sin fines de lucro. Terminé liderando ese equipo. Fue la primera prueba real de que sí era posible.",
  "En abril de 2021 entré a un bootcamp de programación Full Stack — sin dejar de trabajar tiempo completo como profesora, ni de cuidar a mis tres hijos. Durante seis meses dormí de 1am a 5am: estudiaba y construía proyectos antes y después de dar clases. A finales de septiembre de 2021 conseguí mi primer trabajo remoto como Software Engineer, sin título formal en tecnología.",
  "En 2025, la situación migratoria en Estados Unidos se complicó fuertemente para mi familia. Tomamos la decisión de regresar a Venezuela. Renuncié a mi trabajo remoto —la empresa no podía emplear fuera de USA— y en julio de 2025 llegamos a una ciudad nueva, a empezar otra vez: sin trabajo estable, solo con mis clientes personales.",
  "Hoy, un año después, sigo reiniciando: trabajo en implementación y mejora de procesos, desarrollo aplicaciones internas, apoyo como directora de tecnología a una fundación, y estoy construyendo esta comunidad. Cada reinicio dejó una herramienta. Juntas, se convirtieron en un método: NEXT YOU™.",
];

const TIMELINE = [
  { year: "2014", title: "Migración a USA", detail: "Florida, después Memphis. Sin trabajo, sin inglés, con dos hijos." },
  { year: "2015", title: "Odd jobs y primeros logros", detail: "Mesera, limpieza, cuidado de bebés, YMCA, comedor escolar." },
  { year: "2016–2017", title: "Profesora de español", detail: "Shelby County Schools, Memphis, TN." },
  { year: "2019–2021", title: "El ciclo con la tecnología", detail: "Aprender, dudar, parar, reintentar." },
  { year: "2021", title: "Bootcamp y primer empleo remoto", detail: "Software Engineer, sin título en tecnología." },
  { year: "2025", title: "Regreso a Venezuela", detail: "Renuncia, mudanza, empezar de nuevo." },
  { year: "2026", title: "Next You", detail: "Nace Reiniciar Sin Mapa como movimiento." },
];

const LESSONS = [
  {
    num: "01",
    title: "No Necesitas Papeles Perfectos",
    body: "Ni título formal, ni el momento ideal, ni sentirte lista. Necesitas un proyecto real, por pequeño que sea, que demuestre que sí puedes.",
  },
  {
    num: "02",
    title: "El Método Vale Más Que La Motivación",
    body: "La motivación se agota a la semana. Lo que sostuvo mis seis reinicios fueron pasos concretos, repetibles, no discursos de ánimo.",
  },
  {
    num: "03",
    title: "Nadie Debería Reiniciar Sola",
    body: "Cada vez que lo intenté en aislamiento, tardé más y dudé más. Cada vez que tuve comunidad, avancé más rápido.",
  },
];

const NEXT_STEPS = [
  {
    title: "Descubre Tu Next You",
    body: "Un diagnóstico de 5 minutos que identifica cuál de los 8 pilares necesita tu atención ahora mismo.",
    bullets: ["Diagnóstico gratuito", "Resultado personalizado", "Sin compromiso"],
    cta: "Empezar Diagnóstico →",
    href: "/diagnostico-next-you",
    external: false,
  },
  {
    title: "Únete A La Comunidad",
    body: "El hogar de quienes están reiniciando en paralelo a ti — retos mensuales, sesiones en vivo y acompañamiento real.",
    bullets: ["8 canales por pilar", "Sesiones en vivo mensuales", "Muro de victorias"],
    cta: "Entrar A La Comunidad →",
    href: "/comunidad",
    external: false,
  },
  {
    title: "Mentoría",
    body: "Cuando estés listo/a para una transformación estructurada, con acompañamiento directo y resultados medibles.",
    bullets: ["Cohortes por temporada", "Plan personalizado", "Acompañamiento 1:1"],
    cta: "Ver Opciones →",
    href: "/mentorias",
    external: false,
  },
];

export default function MiHistoriaPage() {
  return (
    <main>
      <header className="bg-ink text-paper px-[8vw] pt-24 pb-16">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">Sobre mí</p>
        <h1 className="font-display text-[clamp(30px,4.6vw,50px)] leading-[1.12] mb-5 max-w-[20ch]">
          {TITLE}
        </h1>
        <p className="text-lg max-w-[62ch] opacity-80 mb-6">{DESCRIPTION}</p>
        <p className="font-mono text-xs uppercase tracking-wide opacity-60 mb-10">
          Educadora → Software Engineer | Migrante | Madre de 3
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE_URL}
          alt="Carla Montaño"
          className="w-full max-w-[520px] aspect-[3/4] object-cover rounded-[2px]"
        />
      </header>

      <section className="px-[8vw] py-24">
        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">Antes de escribir código</p>
        <h2 className="font-display text-[clamp(26px,3.2vw,38px)] mb-8 max-w-[22ch]">
          Empecé Como Educadora. No Como Programadora.
        </h2>
        <div className="max-w-[68ch] flex flex-col gap-5 text-base leading-relaxed opacity-90">
          {STORY.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <blockquote className="border-l-2 border-clay pl-5 italic text-lg my-2">
            &ldquo;Educadora, latina, mujer, mamá… imposible.&rdquo; — así pensaba, en 2019, cuando empecé a mirar la
            tecnología.
          </blockquote>
          {STORY_CONTINUED.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper px-[8vw] py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">La ruta</p>
        <h2 className="font-display text-[clamp(26px,3.2vw,38px)] mb-2">Mi Camino, En Coordenadas</h2>
        <p className="opacity-70 text-base mb-14">Sin mapa, pero con fechas reales.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(237,230,216,0.14)]">
          {TIMELINE.map((item) => (
            <div key={item.year} className="bg-ink-soft p-6">
              <p className="font-mono text-xs text-gold mb-2">{item.year}</p>
              <h4 className="font-display text-base mb-2">{item.title}</h4>
              <p className="text-sm opacity-75">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper-soft px-[8vw] py-24">
        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">Lo que aprendí</p>
        <h2 className="font-display text-[clamp(26px,3.2vw,38px)] mb-14 max-w-[24ch]">
          Tres Cosas Que Sostienen Todo Lo Demás
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {LESSONS.map((lesson) => (
            <div key={lesson.num}>
              <p className="font-mono text-xs text-clay mb-3">{lesson.num}</p>
              <h4 className="font-display text-lg mb-3">{lesson.title}</h4>
              <p className="text-sm opacity-75">{lesson.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-[8vw] py-24">
        <div className="max-w-[640px] mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">Tecnología con propósito</p>
          <h2 className="font-display text-[clamp(26px,3.2vw,38px)] mb-5 max-w-[20ch]">
            Creo Tecnología Que Ayuda A Personas Reales
          </h2>
          <p className="text-base opacity-90 mb-4">
            Aprender a programar me permitió reconstruir mi vida. Pero con el tiempo entendí que la tecnología
            también puede cambiar la vida de otros. Cuando Venezuela atravesó una emergencia nacional, construí
            junto a un equipo de voluntarios una plataforma para conectar gratuitamente a personas afectadas con
            psicólogos. No fue un proyecto comercial — fue una respuesta humana usando las herramientas que
            conocíamos.
          </p>
          <p className="italic text-base opacity-70 mb-6">
            Eso resume lo que significa para mí la tecnología: una herramienta, nunca un fin.
          </p>
          <a
            href={CONTIGO_VENEZUELA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] border border-ink inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform"
          >
            Conoce Contigo Venezuela →
          </a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CONTIGO_IMAGE_URL}
          alt="Contigo Venezuela — plataforma de acompañamiento psicológico gratuito"
          className="w-full max-w-[700px] rounded-[3px] border border-[rgba(20,25,43,0.12)]"
        />
      </section>

      <section className="bg-paper-soft px-[8vw] py-24">
        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">Tu próximo paso</p>
        <h2 className="font-display text-[clamp(26px,3.2vw,38px)] mb-2">Elige Dónde Empezar</h2>
        <p className="opacity-70 text-base mb-14 max-w-[56ch]">
          No hay un solo camino correcto — hay un siguiente paso. Aquí están los tres.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {NEXT_STEPS.map((step) => (
            <div key={step.title} className="bg-paper border border-[rgba(20,25,43,0.12)] rounded-[2px] p-8 flex flex-col">
              <h4 className="font-display text-lg mb-3">{step.title}</h4>
              <p className="text-sm opacity-75 mb-5">{step.body}</p>
              <ul className="flex flex-col gap-1.5 mb-7 text-sm opacity-80">
                {step.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="text-sage">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href={step.href}
                className="font-mono text-xs tracking-wide uppercase px-[22px] py-[13px] rounded-[2px] bg-clay text-paper inline-flex items-center gap-2.5 justify-center mt-auto hover:-translate-y-px transition-transform"
              >
                {step.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-clay text-paper text-center px-[8vw] py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-ink opacity-70 mb-4 flex justify-center">
          Tu próxima versión te espera
        </p>
        <h2 className="font-display text-[clamp(26px,3.4vw,42px)] max-w-[26ch] mx-auto mb-8">
          No Necesitas Tener Todo Resuelto Para Dar Tu Siguiente Paso.
        </h2>
        <Link
          href="/diagnostico-next-you"
          className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-ink text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform"
        >
          Haz El Diagnóstico Next You →
        </Link>
      </section>
    </main>
  );
}
