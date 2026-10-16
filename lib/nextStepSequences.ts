// Email follow-ups for the "What's your next step with technology?" quiz: a result email (sent
// immediately) and two follow-ups, per profile and language. Tokens like {{sos}} become links.
import type { SequenceStep } from "@/lib/sequences";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";
import { MONTANO_SYSTEMS_URL } from "@/lib/constants";
import type { ProfileKey } from "@/lib/nextStep";

interface RawStep {
  subject: string;
  body: string;
}

const T: Record<ProfileKey, Record<Locale, RawStep[]>> = {
  sos: {
    en: [
      {
        subject: "Your result: you need a quick fix",
        body: "Thanks for taking the quiz. Your answers point to something specific and fairly urgent — and for that, the fastest route isn't a big program, it's a short, practical call.\n\nThat's what a Tech SOS is: 30 minutes, one concrete problem — an account, a phone line, an app or a device that won't cooperate — for $50. We either solve it, or we leave knowing exactly what's needed.\n\nBook a time here: {{sos}}\n\nIf you'd rather write first, just reply to this email.",
      },
      {
        subject: "How to get the most out of a 30-minute call",
        body: "A few things that make a short call work:\n\n1. Write the problem in one sentence.\n2. Note what you've already tried.\n3. Have the device or account open, and screenshots if you can.\n4. Tell me what \"solved\" looks like for you.\n\nThat's usually enough to spend the 30 minutes on the fix instead of the explaining.\n\nIf you haven't booked yet: {{sos}}",
      },
      {
        subject: "When 30 minutes isn't enough",
        body: "Some problems turn out to be bigger than a quick fix — a decision with several moving parts, or something you'd like to understand properly, not just patch.\n\nFor those, a 60-minute 1:1 session ($100) gives us room to work through your situation and leave with next steps: {{session}}\n\nAnd if what you need is something built — a system, an automation, an integration — that's what Montano Systems does: {{montano}}",
      },
    ],
    es: [
      {
        subject: "Tu resultado: necesitas una solución rápida",
        body: "Gracias por hacer el diagnóstico. Tus respuestas apuntan a algo concreto y bastante urgente, y para eso lo más rápido no es un programa grande sino una llamada corta y práctica.\n\nEso es un Tech SOS: 30 minutos, un problema concreto — una cuenta, una línea telefónica, una app o un dispositivo que no coopera — por $50. O lo resolvemos, o salimos sabiendo exactamente qué hace falta.\n\nReserva un horario aquí: {{sos}}\n\nSi prefieres escribirme primero, responde a este correo.",
      },
      {
        subject: "Cómo aprovechar al máximo una llamada de 30 minutos",
        body: "Algunas cosas que hacen que una llamada corta funcione:\n\n1. Escribe el problema en una sola frase.\n2. Anota lo que ya intentaste.\n3. Ten el dispositivo o la cuenta abiertos, y capturas de pantalla si puedes.\n4. Dime cómo se ve \"resuelto\" para ti.\n\nCon eso suele alcanzar para dedicar los 30 minutos a la solución y no a las explicaciones.\n\nSi todavía no has reservado: {{sos}}",
      },
      {
        subject: "Cuando 30 minutos no alcanzan",
        body: "Algunos problemas resultan ser más grandes que una solución rápida: una decisión con varias partes, o algo que quieres entender bien y no solo parchear.\n\nPara eso, una sesión 1:1 de 60 minutos ($100) nos da espacio para trabajar tu situación y salir con próximos pasos: {{session}}\n\nY si lo que necesitas es que alguien lo construya — un sistema, una automatización, una integración — eso es lo que hace Montano Systems: {{montano}}",
      },
    ],
  },
  clarity: {
    en: [
      {
        subject: "Your result: you need a clear plan",
        body: "Thanks for taking the quiz. You have a decision, a project or a direction in front of you, and the missing piece is clarity.\n\nA 60-minute 1:1 session works through your real situation — technology, a tool or project decision, a learning path or a career move — and ends with concrete next steps in writing.\n\nBook it here: {{session}}",
      },
      {
        subject: "How to get unstuck on a decision",
        body: "Before you decide, try this: write down the decision in one sentence, the two or three real options, what would need to be true for each to work, and what you'd need to know to choose.\n\nOften that alone shrinks the problem. If it doesn't, that page is the perfect thing to bring to a session: {{session}}",
      },
      {
        subject: "Ready to turn this into a plan?",
        body: "If one conversation isn't enough, there's a package of 4 sessions for $340 (it includes a month of the community): {{pack}}\n\nOr just start with one: {{session}}\n\nEither way, you leave with a plan — not an endless list.",
      },
    ],
    es: [
      {
        subject: "Tu resultado: necesitas un plan claro",
        body: "Gracias por hacer el diagnóstico. Tienes una decisión, un proyecto o una dirección por delante, y lo que falta es claridad.\n\nUna sesión 1:1 de 60 minutos trabaja tu situación real — tecnología, una decisión de herramienta o proyecto, una ruta de aprendizaje o un cambio de carrera — y termina con próximos pasos concretos por escrito.\n\nReserva aquí: {{session}}",
      },
      {
        subject: "Cómo salir del bloqueo ante una decisión",
        body: "Antes de decidir, prueba esto: escribe la decisión en una sola frase, las dos o tres opciones reales, qué tendría que ser cierto para que cada una funcione y qué necesitarías saber para elegir.\n\nMuchas veces eso solo ya achica el problema. Y si no, esa hoja es justo lo que conviene traer a una sesión: {{session}}",
      },
      {
        subject: "¿Listo/a para convertir esto en un plan?",
        body: "Si una conversación no alcanza, hay un paquete de 4 sesiones por $340 (incluye un mes de la comunidad): {{pack}}\n\nO empieza con una: {{session}}\n\nDe cualquier forma, sales con un plan — no con una lista interminable.",
      },
    ],
  },
  career: {
    en: [
      {
        subject: "Your result: you're reinventing your career",
        body: "Thanks for taking the quiz. Your answers read like someone in a transition — and that usually needs a method and company more than another course.\n\nNEXT YOU organizes it in three phases, in order: Giro (break the belief that it's impossible and choose a direction), Ruta (build what the market needs to see in you) and Ritmo (sustain it without burning out).\n\nStart here: {{nextyou}}\n\nIf you want to find out which area needs your attention first, there's a deeper diagnostic: {{diagnostic}}",
      },
      {
        subject: "Giro, Ruta, Ritmo: where do you start?",
        body: "Most people start with Ruta — the resume, the tools, the courses — and stall, because the first phase got skipped.\n\nGiro comes first: a direction you've actually chosen, and the belief that it's possible. Ruta is what the market needs to see in you. Ritmo is how you keep going without burning out.\n\nA good question for this week: which of the three feels weakest right now? That's where to start. More on the method: {{nextyou}}",
      },
      {
        subject: "You don't have to restart alone",
        body: "Every time I tried to change careers alone, it took longer and I doubted more. Every time I had company, I moved faster.\n\nThere's a NEXT YOU community (the live sessions and most conversations are in Spanish today), and 1:1 mentoring for a more personal plan: {{mentoring}}\n\nWhichever you choose, you don't need to have everything figured out to start.",
      },
    ],
    es: [
      {
        subject: "Tu resultado: estás reinventando tu carrera",
        body: "Gracias por hacer el diagnóstico. Tus respuestas suenan a alguien en transición — y eso suele necesitar un método y compañía más que otro curso.\n\nNEXT YOU lo organiza en tres fases, en orden: Giro (rompes la creencia de que es imposible y eliges un rumbo), Ruta (construyes lo que el mercado necesita ver de ti) y Ritmo (lo sostienes sin quemarte).\n\nEmpieza aquí: {{nextyou}}\n\nSi quieres saber qué área necesita tu atención primero, hay un diagnóstico más profundo: {{diagnostic}}",
      },
      {
        subject: "Giro, Ruta, Ritmo: ¿por dónde empiezas?",
        body: "La mayoría empieza por Ruta — el CV, las herramientas, los cursos — y se estanca, porque se saltó la primera fase.\n\nPrimero va Giro: un rumbo que de verdad elegiste y la creencia de que es posible. Ruta es lo que el mercado necesita ver de ti. Ritmo es cómo sigues sin quemarte.\n\nUna buena pregunta para esta semana: ¿cuál de las tres se siente más débil hoy? Ahí empiezas. Más sobre el método: {{nextyou}}",
      },
      {
        subject: "No tienes que reiniciar sola/o",
        body: "Cada vez que intenté cambiar de carrera sola, tardé más y dudé más. Cada vez que tuve compañía, avancé más rápido.\n\nExiste la comunidad NEXT YOU, y también mentoría 1:1 para un plan más personal: {{mentoring}}\n\nElijas lo que elijas, no necesitas tener todo resuelto para empezar.",
      },
    ],
  },
  learner: {
    en: [
      {
        subject: "Your result: you learn at your own pace",
        body: "Thanks for taking the quiz. You want to build skills and confidence your way — and that's a great way to learn.\n\nA good place to start is the shop, with practical guides and templates: {{shop}}\n\nAnd the resources, where I write about learning, careers and building: {{resources}}\n\nPick one thing and start it this week.",
      },
      {
        subject: "Start with one small, real project",
        body: "What broke my own cycle of learning, doubting and stopping wasn't another course. It was a weekend building a real website for a nonprofit at GiveCamp.\n\nA small, finished, real project beats ten half-watched tutorials. This week, pick the smallest real thing you could finish — and finish it.\n\nIf a template helps you get started, the shop has some: {{shop}}",
      },
      {
        subject: "If you want a guide",
        body: "Learning on your own works — until you hit a decision or a wall. When that happens, a 60-minute 1:1 session ($100) is a way to get unstuck and leave with a plan: {{session}}\n\nAnd the resources are always there: {{resources}}",
      },
    ],
    es: [
      {
        subject: "Tu resultado: aprendes a tu ritmo",
        body: "Gracias por hacer el diagnóstico. Quieres desarrollar habilidades y confianza a tu manera — y esa es una gran forma de aprender.\n\nUn buen punto de partida es la tienda, con guías y plantillas prácticas: {{shop}}\n\nY los recursos, donde escribo sobre aprendizaje, carrera y cómo construir cosas: {{resources}}\n\nElige una cosa y empiézala esta semana.",
      },
      {
        subject: "Empieza con un proyecto pequeño y real",
        body: "Lo que rompió mi propio ciclo de aprender, dudar y parar no fue otro curso. Fue un fin de semana construyendo una página web real para una organización sin fines de lucro en GiveCamp.\n\nUn proyecto pequeño, terminado y real vale más que diez tutoriales a medias. Esta semana, elige lo más pequeño y real que podrías terminar — y termínalo.\n\nSi una plantilla te ayuda a empezar, la tienda tiene algunas: {{shop}}",
      },
      {
        subject: "Si quieres una guía",
        body: "Aprender por tu cuenta funciona — hasta que llegas a una decisión o a un muro. Cuando eso pasa, una sesión 1:1 de 60 minutos ($100) es una forma de destrabarte y salir con un plan: {{session}}\n\nY los recursos siempre están ahí: {{resources}}",
      },
    ],
  },
  business: {
    en: [
      {
        subject: "Your result: your business needs better systems",
        body: "Thanks for taking the quiz. Your answers point to systems, tools and processes — work that is built, not just advised.\n\nMontano Systems delivers software, AI-enabled systems, workflow automation and integrations for small businesses and organizations: {{montano}}\n\nIf you'd like to talk it through first, write to me here: {{contactbuild}}",
      },
      {
        subject: "Where to start improving your systems",
        body: "A simple way to find where to begin: pick one process — say, how a new lead becomes a customer — and write down every step, especially the ones where someone copies information from one place to another.\n\nThose manual hand-offs are usually where time leaks out, and the best candidates for automation. If you'd like a second pair of eyes, tell me about it: {{contactbuild}}",
      },
      {
        subject: "Bring your team up to speed",
        body: "Sometimes the tools are fine and the team just needs to understand them. I run practical workshops on technology and AI in plain language, with exercises people can use the same day (from $250 for a 90-minute virtual session): {{workshop}}\n\nOr if you need something built: {{montano}}",
      },
    ],
    es: [
      {
        subject: "Tu resultado: tu negocio necesita mejores sistemas",
        body: "Gracias por hacer el diagnóstico. Tus respuestas apuntan a sistemas, herramientas y procesos — trabajo que se construye, no solo se asesora.\n\nMontano Systems realiza software, sistemas con IA, automatización de flujos e integraciones para pequeños negocios y organizaciones: {{montano}}\n\nSi prefieres conversarlo primero, escríbeme aquí: {{contactbuild}}",
      },
      {
        subject: "Por dónde empezar a mejorar tus sistemas",
        body: "Una forma sencilla de saber por dónde empezar: elige un proceso — por ejemplo, cómo un contacto nuevo se convierte en cliente — y anota cada paso, sobre todo aquellos donde alguien copia información de un lugar a otro.\n\nEsos traspasos manuales suelen ser donde se escapa el tiempo, y los mejores candidatos para automatizar. Si quieres una segunda mirada, cuéntame: {{contactbuild}}",
      },
      {
        subject: "Pon a tu equipo al día",
        body: "A veces las herramientas están bien y el equipo solo necesita entenderlas. Doy talleres prácticos sobre tecnología e IA en lenguaje claro, con ejercicios que la gente puede usar ese mismo día (desde $250 por una sesión virtual de 90 minutos): {{workshop}}\n\nO si necesitas que alguien lo construya: {{montano}}",
      },
    ],
  },
};

const DELAYS = [0, 3, 4]; // days after the previous email, as in the other sequences

function links(language: Locale): Record<string, string> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const abs = (path: string) => `${site}${path}`;
  const work = localizedPath(language, "workWithMe");
  const contact = localizedPath(language, "contact");
  return {
    sos: abs(`${work}?plan=sos#book`),
    session: abs(`${work}?plan=session#book`),
    pack: abs(`${work}?plan=pack#book`),
    nextyou: abs(localizedPath(language, "nextYou")),
    diagnostic: abs(localizedPath(language, "diagnostic")),
    mentoring: abs(localizedPath(language, "mentoring")),
    shop: abs(localizedPath(language, "shop")),
    resources: abs(localizedPath(language, "resources")),
    montano: MONTANO_SYSTEMS_URL,
    contactbuild: abs(`${contact}?intent=custom-build`),
    workshop: abs(`${contact}?intent=workshop`),
  };
}

export function getNextStepSequence(profile: ProfileKey, language: Locale): SequenceStep[] {
  const l = links(language);
  const fill = (text: string) => text.replace(/\{\{(\w+)\}\}/g, (_, key) => l[key] ?? "");
  return T[profile][language].map((step, i) => ({
    delayDays: DELAYS[i],
    subject: step.subject,
    body: (name, unsubscribeUrl) => {
      const trimmed = name.trim();
      const greeting = language === "en" ? (trimmed ? `Hi ${trimmed},` : "Hi,") : trimmed ? `Hola ${trimmed},` : "Hola,";
      const footer =
        language === "en"
          ? `\n\n—\nCarla\n\nDon't want more emails? Unsubscribe here: ${unsubscribeUrl}`
          : `\n\n—\nCarla\n\n¿No quieres recibir más correos? Date de baja aquí: ${unsubscribeUrl}`;
      return `${greeting}\n\n${fill(step.body)}${footer}`;
    },
  }));
}
