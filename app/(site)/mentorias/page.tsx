import type { Metadata } from "next";
import { getAvailableSlots } from "@/lib/mentorias";
import BookingWidget from "@/components/BookingWidget";

// Slots are added/booked at runtime (manually in Supabase, or via a booking) —
// fetch fresh every request rather than baking availability into the build.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mentoría Next You — Carla Montaño",
  description:
    "Sesiones 1:1 personalizadas para trabajar tu próximo paso concreto en cualquiera de los 8 pilares de NEXT YOU™.",
};

const SIGNS = [
  {
    title: "Estás avanzando sola/o",
    body: "Y no sabes si lo que estás haciendo realmente te acerca a tu próxima versión o solo te mantiene ocupada/o.",
  },
  {
    title: "Tienes demasiada información",
    body: "Cursos, videos, consejos de todos lados — y ninguna claridad real sobre cuál es tu siguiente paso concreto.",
  },
  {
    title: "Ya empezaste, pero no avanzas",
    body: "Sabes qué pilar te está frenando (mentalidad, dirección, empleabilidad...) pero no logras moverlo solo/a.",
  },
];

const WORK_AREAS = [
  { num: "01", title: "Mentalidad y creencias límite", body: "Identificar qué historia te estás contando que te frena." },
  { num: "02", title: "Dirección y siguiente proyecto", body: "Definir un roadmap claro, no una lista infinita de opciones." },
  { num: "03", title: "Tecnología e IA aplicada", body: "Usar IA y herramientas actuales para aprender y avanzar más rápido." },
  { num: "04", title: "Empleabilidad", body: "CV, LinkedIn, portafolio y preparación real para entrevistas." },
  { num: "05", title: "Revisión técnica", body: "Código, proyectos y buenas prácticas, si tu camino es tecnología." },
  { num: "06", title: "Productividad", body: "Cómo sostener el cambio sin sacrificar trabajo, familia y descanso." },
  { num: "07", title: "Organización del aprendizaje", body: "Qué estudiar primero, qué dejar para después, y por qué." },
  { num: "08", title: "Siguiente paso en la comunidad", body: "Cómo complementar la mentoría con acompañamiento continuo." },
];

const HOW_IT_WORKS = [
  { num: "01", title: "Agenda tu sesión", body: "Elige el día y la hora que mejor se adapte a ti. Confirmación automática por correo." },
  { num: "02", title: "Nos reunimos", body: "Hablamos de tu situación real, identificamos tu pilar prioritario y resolvemos tus dudas concretas." },
  { num: "03", title: "Sales con un plan", body: "Claro, práctico y enfocado en tu siguiente paso — no en una lista interminable de cosas por hacer." },
];

const IDEAL_FOR = [
  { title: "Quieres cambiar de carrera profesional", body: "Y necesitas un plan realista, no solo motivación para intentarlo otra vez." },
  { title: "Quieres conseguir tu próximo empleo", body: "En tecnología o en cualquier área donde sientas que tu perfil no se está mostrando bien." },
  { title: "Quieres aprender a usar la tecnología e IA a tu favor", body: "Sin necesidad de convertirte en programador/a si no es tu camino." },
  { title: "Quieres organizar tu reinicio, no solo tu aprendizaje", body: "Porque sientes que el desorden no es solo de información, es de tiempo, energía y dirección." },
];

const FAQ = [
  { q: "¿Necesito saber programar para agendar una sesión?", a: "No. La mentoría cubre los 8 pilares de NEXT YOU™, no solo tecnología. Muchas personas llegan sin saber por dónde empezar, en cualquier área de su reinicio profesional." },
  { q: "¿La sesión queda grabada?", a: "Sí, si lo deseas. Así puedes revisarla después con calma, sin preocuparte por tomar notas durante la conversación." },
  { q: "¿Con qué herramientas trabajamos?", a: "Depende de tu pilar y tus objetivos: puede ser VS Code, GitHub, IA generativa, LinkedIn, o herramientas de organización y productividad. La sesión se adapta completamente a ti." },
  { q: "¿Cuánto dura la sesión?", a: "Aproximadamente 60 minutos — tiempo suficiente para resolver dudas, revisar tu situación actual y salir con un plan claro." },
  { q: "¿Puedo reagendar si no puedo asistir?", a: "Sí, con anticipación — escríbeme a hello@carlamontano.io." },
  { q: "¿En qué se diferencia esto de la Comunidad Next You?", a: "La Comunidad es tu espacio diario de acompañamiento y pertenencia, a menor costo. La Mentoría es una transformación más estructurada y personalizada, con seguimiento directo conmigo." },
  { q: "¿Qué hace diferente esta mentoría?", a: "No te doy una lista interminable de cursos. Identificamos juntas/os tu pilar prioritario, resolvemos tus dudas reales y sales con un plan de acción — con la misma metodología que yo usé para reiniciar seis veces." },
];

export default async function MentoriasPage() {
  const slots = await getAvailableSlots();

  return (
    <main>
      <header className="bg-ink text-paper px-[8vw] pt-20 pb-[90px] min-h-[76vh] flex flex-col justify-center">
        <div className="max-w-[780px]">
          <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">Mentoría Next You · 1:1</p>
          <h1 className="font-display text-[clamp(32px,4.6vw,54px)] leading-[1.1] mb-4">
            No necesitas otro curso.
            <br />
            Necesitas un <em className="italic text-clay-soft font-normal">plan claro</em> y alguien que lo camine
            contigo.
          </h1>
          <p className="text-[17px] max-w-[56ch] opacity-80 mb-7">
            Sesiones 1:1 personalizadas donde trabajamos tu próximo paso concreto — sea mentalidad, dirección,
            tecnología, empleabilidad o cualquiera de los 8 pilares de NEXT YOU™. Sin genéricos, sin listas
            interminables de recursos: un plan hecho para tu situación real.
          </p>
          <div className="flex gap-4 flex-wrap mb-7">
            <a
              href="#agenda"
              className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper inline-flex items-center gap-2.5"
            >
              Agenda tu sesión →
            </a>
            <a
              href="#faq"
              className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] border border-current opacity-85"
            >
              Ver preguntas frecuentes
            </a>
          </div>
          <div className="flex gap-6 flex-wrap font-mono text-[11px] opacity-55">
            <span>Sesiones online · 60 minutos</span>
            <span className="pl-3.5 border-l border-[rgba(237,230,216,0.14)]">Cupos limitados cada semana</span>
            <span className="pl-3.5 border-l border-[rgba(237,230,216,0.14)]">100% personalizado a tu pilar prioritario</span>
          </div>
        </div>
      </header>

      <section className="px-[8vw] py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">¿Es para ti?</p>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)]">Tres señales de que necesitas esta mentoría</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-[rgba(20,25,43,0.12)]">
          {SIGNS.map((s) => (
            <div key={s.title} className="bg-paper p-8">
              <h4 className="text-lg font-semibold mb-2">{s.title}</h4>
              <p className="text-sm opacity-70">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper-soft px-[8vw] py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">¿Qué trabajamos juntas/os?</p>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)] mb-3.5">Un plan hecho para tu pilar prioritario</h2>
          <p className="opacity-70">
            Cada sesión parte de dónde estás realmente — no de un temario genérico. Estas son las áreas donde más
            acompaño a mis mentees:
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {WORK_AREAS.map((w) => (
            <div key={w.num} className="bg-paper border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5 flex flex-col gap-2.5">
              <span className="font-mono text-[10px] opacity-40">{w.num}</span>
              <h4 className="text-sm font-semibold">{w.title}</h4>
              <p className="text-xs opacity-60">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-[8vw] py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">Cómo funciona</p>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)]">Tres pasos, sin complicaciones</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-[rgba(20,25,43,0.12)]">
          {HOW_IT_WORKS.map((h) => (
            <div key={h.num} className="bg-paper p-9">
              <div className="font-mono text-[26px] text-clay opacity-50 mb-3.5">{h.num}</div>
              <h4 className="text-lg font-semibold mb-2">{h.title}</h4>
              <p className="text-sm opacity-70">{h.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper-soft px-[8vw] py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">Ideal para ti si...</p>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)]">Reconoces alguna de estas situaciones</h2>
        </div>
        <div className="border-t border-[rgba(20,25,43,0.12)]">
          {IDEAL_FOR.map((item) => (
            <div key={item.title} className="grid grid-cols-[32px_1fr] gap-4 py-5.5 border-b border-[rgba(20,25,43,0.12)] items-start">
              <span className="font-mono text-clay text-sm pt-0.5">—</span>
              <div>
                <h4 className="text-base font-semibold mb-1">{item.title}</h4>
                <p className="text-[13.5px] opacity-65">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="agenda" className="bg-ink text-paper px-[8vw] py-24">
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">Agenda tu sesión</p>
            <h2 className="font-display text-[clamp(28px,3.2vw,40px)] mb-5">Elige tu plan y da tu siguiente paso</h2>
            <ul className="flex flex-col gap-3.5 mt-5">
              {["Sesiones online por Google Meet", "60 minutos, 100% personalizados", "Atención cercana y práctica", "Cupos limitados cada semana"].map(
                (t) => (
                  <li key={t} className="text-sm pl-5 relative opacity-85 before:content-['—'] before:absolute before:left-0 before:text-clay-soft">
                    {t}
                  </li>
                )
              )}
            </ul>
          </div>
          <BookingWidget slots={slots} />
        </div>
      </section>

      <section id="faq" className="px-[8vw] py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">Preguntas frecuentes</p>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)]">Antes de agendar</h2>
        </div>
        <div className="border-t border-[rgba(20,25,43,0.12)]">
          {FAQ.map((item) => (
            <div key={item.q} className="py-6 border-b border-[rgba(20,25,43,0.12)]">
              <h4 className="text-base font-semibold mb-2">{item.q}</h4>
              <p className="text-[14.5px] opacity-70 max-w-[66ch]">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-clay text-paper text-center px-[8vw] py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-ink opacity-70 mb-4 flex justify-center">
          No tienes que hacerlo sola/o
        </p>
        <h2 className="font-display text-[clamp(26px,3.4vw,42px)] max-w-[22ch] mx-auto mb-4">
          Agenda tu sesión y empecemos a construir tu siguiente paso.
        </h2>
        <p className="opacity-85 max-w-[50ch] mx-auto mb-6">Cupos limitados cada semana.</p>
        <a
          href="#agenda"
          className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-ink text-paper inline-flex items-center gap-2.5"
        >
          Agenda tu sesión 1:1 →
        </a>
      </section>
    </main>
  );
}
