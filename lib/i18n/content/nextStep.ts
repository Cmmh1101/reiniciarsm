// Text for the "What's your next step with technology?" quiz, in both languages. Scoring is in lib/nextStep.ts.
import type { Locale } from "@/lib/i18n/config";
import type { ProfileKey } from "@/lib/nextStep";

export interface Question {
  question: string;
  options: string[];
}

export interface ProfileText {
  label: string;
  summary: string;
  // Where the result sends the person. "target" is resolved to a link in the component.
  primary: { cta: string; target: "book-sos" | "book-session" | "next-you" | "shop" | "montano-systems" };
  secondary: { cta: string; target: "resources" | "mentoring" | "contact-build" | "contact-workshop" | "diagnostic" | "book-session" };
}

export interface NextStepContent {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  start: string;
  questionOf: (n: number, total: number) => string;
  questions: Question[];
  captureEyebrow: string;
  captureTitle: string;
  captureBody: string;
  name: string;
  email: string;
  honeypot: string;
  seeResult: string;
  sending: string;
  errorName: string;
  errorEmail: string;
  resultEyebrow: string;
  emailNote: string;
  retake: string;
  profiles: Record<ProfileKey, ProfileText>;
}

const en: NextStepContent = {
  meta: {
    title: "What's your next step with technology? — Carla Montaño",
    description: "Eight quick questions to find the right kind of help — a fast fix, a clear plan, a career move, self-paced learning or better systems for your business.",
  },
  eyebrow: "2-minute quiz",
  title: "What's your next step with technology?",
  lead: "Eight quick questions. You'll get a clear recommendation — a quick fix, a plan, a career move, something to learn on your own, or help with your business systems.",
  start: "Start the quiz →",
  questionOf: (n, total) => `Question ${n} of ${total}`,
  questions: [
    {
      question: "What brings you here right now?",
      options: [
        "Something is broken or confusing and I need it solved soon",
        "I have a decision or project and I'm not sure how to approach it",
        "I want to change careers or move into tech",
        "I want to learn a skill or use technology better",
        "My business or organization needs better systems",
      ],
    },
    {
      question: "How are you getting along with technology today?",
      options: [
        "I get by, but small problems stop me",
        "I'm comfortable — I just need a second opinion",
        "I'm a beginner and want to start from zero",
        "I'm comfortable, and this is about my team or company",
      ],
    },
    {
      question: "How clear is your next step?",
      options: ["I know exactly what I need", "I have a rough idea", "I have several options and can't choose", "I don't know where to start"],
    },
    {
      question: "How much time can you give this over the next month?",
      options: [
        "An hour or two, for one focused conversation",
        "A few hours a week",
        "Real, steady time — I'm ready to commit",
        "It's my team's time, not mine",
      ],
    },
    {
      question: "How do you prefer to get help?",
      options: [
        "A quick call to fix it",
        "A one-to-one conversation that ends with a plan",
        "Ongoing support and a community",
        "Guides and templates I can use at my own pace",
        "Someone to build or set it up for me",
      ],
    },
    {
      question: "How are you using AI and automation today?",
      options: [
        "I haven't tried them yet",
        "I use them a little and want to do more",
        "I use them daily and want to apply them to work or business",
        "They make me a little nervous or distrustful",
      ],
    },
    {
      question: "What's your biggest obstacle right now?",
      options: [
        "I'm losing time on a problem I can't solve",
        "Too many options and no plan",
        "Doubt about whether I can make the change",
        "Not knowing what to learn first",
        "Processes and tools that don't work together",
      ],
    },
    {
      question: "When do you need this sorted out?",
      options: ["Today or this week", "This month", "In the next few months", "No rush — I'm exploring"],
    },
  ],
  captureEyebrow: "Almost there",
  captureTitle: "Where should we send your result?",
  captureBody: "You'll see your recommendation right away, and I'll email it to you with a couple of useful follow-ups. Unsubscribe anytime.",
  name: "Name",
  email: "Email",
  honeypot: "Leave this field empty",
  seeResult: "See my result",
  sending: "Sending...",
  errorName: "Please enter your name.",
  errorEmail: "Please enter a valid email.",
  resultEyebrow: "Your result",
  emailNote: "I've also sent this to your email.",
  retake: "Take the quiz again",
  profiles: {
    sos: {
      label: "You need a quick fix",
      summary: "Your answers point to something specific and urgent — the fastest way forward is a short, practical call, not a big program. A Tech SOS is 30 minutes on one concrete problem: an account, a phone line, an app or a device that won't cooperate.",
      primary: { cta: "Book a Tech SOS — $50", target: "book-sos" },
      secondary: { cta: "Browse free resources", target: "resources" },
    },
    clarity: {
      label: "You need a clear plan",
      summary: "You have a decision, a project or a direction in front of you and the missing piece is clarity. A 60-minute 1:1 session works through your real situation and ends with concrete next steps you can follow.",
      primary: { cta: "Book a 1:1 session — $100", target: "book-session" },
      secondary: { cta: "Browse free resources", target: "resources" },
    },
    career: {
      label: "You're reinventing your career",
      summary: "You're in a transition, and that takes a method and company more than another course. NEXT YOU organizes it in three phases — Giro, Ruta, Ritmo — and has a community and mentoring to go with it.",
      primary: { cta: "Explore NEXT YOU", target: "next-you" },
      secondary: { cta: "See 1:1 mentoring", target: "mentoring" },
    },
    learner: {
      label: "You learn at your own pace",
      summary: "You want to build skills and confidence your way. Start with practical guides and templates, and read the resources — then, if you want a guide, a 1:1 session is there when you need it.",
      primary: { cta: "Browse the shop", target: "shop" },
      secondary: { cta: "Read the resources", target: "resources" },
    },
    business: {
      label: "Your business needs better systems",
      summary: "Your answers point to systems, tools and processes — the kind of work that is built, not just advised. Software, automation and integrations are delivered through Montano Systems, and workshops can bring your team up to speed.",
      primary: { cta: "Visit Montano Systems", target: "montano-systems" },
      secondary: { cta: "Ask about a workshop", target: "contact-workshop" },
    },
  },
};

const es: NextStepContent = {
  meta: {
    title: "¿Cuál es tu siguiente paso con la tecnología? — Carla Montaño",
    description: "Ocho preguntas rápidas para encontrar el tipo de ayuda adecuado: una solución rápida, un plan claro, un cambio de carrera, aprender a tu ritmo o mejores sistemas para tu negocio.",
  },
  eyebrow: "Diagnóstico de 2 minutos",
  title: "¿Cuál es tu siguiente paso con la tecnología?",
  lead: "Ocho preguntas rápidas. Recibirás una recomendación clara: una solución rápida, un plan, un cambio de carrera, algo para aprender por tu cuenta o ayuda con los sistemas de tu negocio.",
  start: "Empezar →",
  questionOf: (n, total) => `Pregunta ${n} de ${total}`,
  questions: [
    {
      question: "¿Qué te trae por aquí ahora mismo?",
      options: [
        "Algo está roto o confuso y necesito resolverlo pronto",
        "Tengo una decisión o un proyecto y no sé cómo abordarlo",
        "Quiero cambiar de carrera o entrar al mundo tech",
        "Quiero aprender una habilidad o usar mejor la tecnología",
        "Mi negocio u organización necesita mejores sistemas",
      ],
    },
    {
      question: "¿Cómo te llevas con la tecnología hoy?",
      options: [
        "Me defiendo, pero los problemas pequeños me frenan",
        "Me siento cómodo/a; solo necesito una segunda opinión",
        "Soy principiante y quiero empezar desde cero",
        "Me siento cómodo/a, y se trata de mi equipo o empresa",
      ],
    },
    {
      question: "¿Qué tan claro tienes tu siguiente paso?",
      options: ["Sé exactamente qué necesito", "Tengo una idea general", "Tengo varias opciones y no logro elegir", "No sé por dónde empezar"],
    },
    {
      question: "¿Cuánto tiempo puedes dedicarle el próximo mes?",
      options: [
        "Una o dos horas, para una conversación enfocada",
        "Unas horas por semana",
        "Tiempo real y constante: estoy listo/a para comprometerme",
        "Es tiempo de mi equipo, no mío",
      ],
    },
    {
      question: "¿Cómo prefieres recibir ayuda?",
      options: [
        "Una llamada rápida para resolverlo",
        "Una conversación 1:1 que termine en un plan",
        "Acompañamiento continuo y una comunidad",
        "Guías y plantillas que pueda usar a mi ritmo",
        "Alguien que lo construya o lo configure por mí",
      ],
    },
    {
      question: "¿Cómo usas hoy la IA y la automatización?",
      options: [
        "Todavía no las he probado",
        "Las uso un poco y quiero hacer más",
        "Las uso a diario y quiero aplicarlas al trabajo o al negocio",
        "Me dan algo de nervios o desconfianza",
      ],
    },
    {
      question: "¿Cuál es tu mayor obstáculo ahora?",
      options: [
        "Pierdo tiempo en un problema que no logro resolver",
        "Demasiadas opciones y ningún plan",
        "La duda de si puedo hacer el cambio",
        "No saber qué aprender primero",
        "Procesos y herramientas que no funcionan juntos",
      ],
    },
    {
      question: "¿Para cuándo necesitas esto resuelto?",
      options: ["Hoy o esta semana", "Este mes", "En los próximos meses", "Sin prisa: estoy explorando"],
    },
  ],
  captureEyebrow: "Ya casi",
  captureTitle: "¿A dónde te enviamos tu resultado?",
  captureBody: "Verás tu recomendación de inmediato, y te la envío por correo con un par de seguimientos útiles. Puedes darte de baja cuando quieras.",
  name: "Nombre",
  email: "Correo electrónico",
  honeypot: "No llenar este campo",
  seeResult: "Ver mi resultado",
  sending: "Enviando...",
  errorName: "Por favor escribe tu nombre.",
  errorEmail: "Por favor escribe un correo válido.",
  resultEyebrow: "Tu resultado",
  emailNote: "También te lo envié a tu correo.",
  retake: "Hacer el diagnóstico de nuevo",
  profiles: {
    sos: {
      label: "Necesitas una solución rápida",
      summary: "Tus respuestas apuntan a algo concreto y urgente: lo más rápido es una llamada corta y práctica, no un programa grande. Un Tech SOS son 30 minutos sobre un problema concreto: una cuenta, una línea telefónica, una app o un dispositivo que no coopera.",
      primary: { cta: "Reservar un Tech SOS — $50", target: "book-sos" },
      secondary: { cta: "Ver recursos gratuitos", target: "resources" },
    },
    clarity: {
      label: "Necesitas un plan claro",
      summary: "Tienes una decisión, un proyecto o una dirección por delante y lo que falta es claridad. Una sesión 1:1 de 60 minutos trabaja tu situación real y termina con próximos pasos concretos que puedes seguir.",
      primary: { cta: "Reservar una sesión 1:1 — $100", target: "book-session" },
      secondary: { cta: "Ver recursos gratuitos", target: "resources" },
    },
    career: {
      label: "Estás reinventando tu carrera",
      summary: "Estás en una transición, y eso necesita un método y compañía más que otro curso. NEXT YOU lo organiza en tres fases — Giro, Ruta, Ritmo — y tiene comunidad y mentoría para acompañarlo.",
      primary: { cta: "Explorar NEXT YOU", target: "next-you" },
      secondary: { cta: "Ver la mentoría 1:1", target: "mentoring" },
    },
    learner: {
      label: "Aprendes a tu ritmo",
      summary: "Quieres desarrollar habilidades y confianza a tu manera. Empieza con guías y plantillas prácticas y lee los recursos; y si más adelante quieres una guía, una sesión 1:1 está disponible cuando la necesites.",
      primary: { cta: "Ver la tienda", target: "shop" },
      secondary: { cta: "Leer los recursos", target: "resources" },
    },
    business: {
      label: "Tu negocio necesita mejores sistemas",
      summary: "Tus respuestas apuntan a sistemas, herramientas y procesos: el tipo de trabajo que se construye, no solo se asesora. El software, la automatización y las integraciones se realizan a través de Montano Systems, y los talleres pueden poner a tu equipo al día.",
      primary: { cta: "Visitar Montano Systems", target: "montano-systems" },
      secondary: { cta: "Preguntar por un taller", target: "contact-workshop" },
    },
  },
};

export const NEXT_STEP_CONTENT: Record<Locale, NextStepContent> = { en, es };
