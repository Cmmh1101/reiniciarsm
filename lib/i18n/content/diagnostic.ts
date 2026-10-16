// Diagnostic copy per language. Spanish lives in lib/diagnostic.ts (it is also what the admin, tags
// and Spanish emails use); this file adds the English text and the interface strings for both.
import type { Locale } from "@/lib/i18n/config";
import { PHASES, PILLARS, type PhaseKey, type PillarKey } from "@/lib/diagnostic";

export interface PillarText {
  label: string;
  question: string;
  // Same order as the options in lib/diagnostic.ts (scores 1–4).
  options: [string, string, string, string];
  archetype: string;
  description: string;
}

const EN_PILLARS: Record<PillarKey, PillarText> = {
  mentalidad: {
    label: "Mindset",
    question: "When you think about changing your professional direction, what's the first thing you feel?",
    options: ["Confidence", "Curiosity with doubt", "Fear of failing again", "Guilt for not having done it sooner"],
    archetype: "The Silent Reinventor",
    description:
      "You have more clarity than you give yourself credit for, but an inner voice keeps holding back the first step. Your priority is to make decisions without asking fear for permission.",
  },
  direccion: {
    label: "Direction",
    question: "How clear is your next professional goal?",
    options: ["Very clear", "A general idea", "Several ideas, I don't know which to choose", "No idea yet"],
    archetype: "The Stuck Multipotentialite",
    description:
      "You have plenty of talent and interests, and that is exactly what scatters you. Your priority is to choose one concrete direction and focus on it, even if it means letting other options go for now.",
  },
  tecnologia: {
    label: "Technology & AI",
    question: "How would you describe your relationship with technology and AI today?",
    options: ["I use it to my advantage", "I use it a little and want to learn more", "It intimidates me", "I avoid it completely"],
    archetype: "The Analog in Transition",
    description:
      "You don't lack ability — you lack practice and confidence with the tools that define today's job market. Your priority is to lose the fear of AI with small, guided steps.",
  },
  empleabilidad: {
    label: "Employability",
    question: "How ready does your professional profile feel today?",
    options: ["Ready to apply", "Needs adjustments", "Outdated for a while", "I don't know where to start"],
    archetype: "The Invisible Professional",
    description:
      "Your experience is worth something, but your profile isn't communicating it. Your priority is to rebuild how you present yourself so the market sees what you can really do.",
  },
  ingles: {
    label: "Professional English",
    question: "How do you feel using English in a work setting?",
    options: ["I'm fluent", "Comfortable, with room to improve", "I get nervous", "It's a real barrier"],
    archetype: "The Migrant on Pause",
    description:
      "Language has become the reason you use to not move forward. Your priority is to build professional fluency so you stop postponing opportunities you could already take.",
  },
  productividad: {
    label: "Productivity",
    question: "How well do you organize your time between work, family and your own growth?",
    options: ["I have a system", "I figure it out week by week", "Time slips away from me", "I can't find time for myself"],
    archetype: "The Busy Without Progress",
    description:
      "Your calendar is full, but there's little to show for what really matters to you. Your priority is to design a system that gives your reinvention real space, not just the urgent.",
  },
  bienestar: {
    label: "Wellbeing",
    question: "How are your energy and health while you chase this change?",
    options: ["I look after my rest", "I could take better care of myself", "Tired most of the time", "Exhausted, at my limit"],
    archetype: "The Exhausted Warrior",
    description:
      "You're sustaining this change on sheer willpower, and your body is already sending the bill. Your priority is to recover energy before pushing further.",
  },
  comunidad: {
    label: "Community",
    question: "Who do you count on to accompany you through this process?",
    options: ["A solid support network", "One or two close people", "Almost always on my own", "Completely on my own"],
    archetype: "The Solo Reinventor",
    description:
      "You're carrying this process without the network you deserve. Your priority is to surround yourself with people who understand what you're going through, so you stop reinventing yourself alone.",
  },
};

const EN_PHASES: Record<PhaseKey, { name: string; promise: string }> = {
  giro: { name: "Giro", promise: "You break the belief that it's impossible, and choose a direction." },
  ruta: { name: "Ruta", promise: "You build what the market needs to see in you." },
  ritmo: { name: "Ritmo", promise: "You sustain it without burning out." },
};

export function getPillarText(locale: Locale, key: PillarKey): PillarText {
  if (locale === "en") return EN_PILLARS[key];
  const p = PILLARS.find((x) => x.key === key)!;
  return {
    label: p.label,
    question: p.question,
    options: p.options.map((o) => o.label) as PillarText["options"],
    archetype: p.archetype,
    description: p.description,
  };
}

export function getPhaseText(locale: Locale, key: PhaseKey) {
  return locale === "en" ? EN_PHASES[key] : { name: PHASES[key].name, promise: PHASES[key].promise };
}

export interface DiagnosticUi {
  eyebrow: string;
  coverTitle: string;
  coverBody: string;
  start: string;
  question: (n: number, total: number) => string;
  captureEyebrow: string;
  captureTitle: string;
  name: string;
  email: string;
  honeypot: string;
  seeResult: string;
  sending: string;
  errorName: string;
  errorEmail: string;
  resultEyebrow: string;
  inPhase: string;
  priorityPillar: string;
  allPhases: string;
  join: string;
}

export const DIAGNOSTIC_UI: Record<Locale, DiagnosticUi> = {
  es: {
    eyebrow: "Diagnóstico Next You",
    coverTitle: "8 preguntas para descubrir tu próximo paso.",
    coverBody:
      "Identifica cuál de los 8 pilares de NEXT YOU™ necesita tu atención ahora mismo. Toma menos de 3 minutos y no necesitas tener nada resuelto para empezar.",
    start: "Empezar diagnóstico →",
    question: (n, total) => `Pregunta ${n} de ${total}`,
    captureEyebrow: "Ya casi tienes tu resultado",
    captureTitle: "¿A dónde te enviamos tu diagnóstico?",
    name: "Nombre",
    email: "Correo electrónico",
    honeypot: "No llenar este campo",
    seeResult: "Ver mi resultado",
    sending: "Enviando...",
    errorName: "Por favor escribe tu nombre.",
    errorEmail: "Por favor escribe un correo válido.",
    resultEyebrow: "Tu arquetipo Next You",
    inPhase: "Estás en la fase:",
    priorityPillar: "Pilar prioritario:",
    allPhases: "te acompaña en las 3 fases",
    join: "Únete a la Comunidad Next You",
  },
  en: {
    eyebrow: "NEXT YOU Diagnostic",
    coverTitle: "8 questions to find your next step.",
    coverBody:
      "Find out which of the 8 NEXT YOU™ pillars needs your attention right now. It takes under 3 minutes and you don't need to have anything figured out to start.",
    start: "Start the diagnostic →",
    question: (n, total) => `Question ${n} of ${total}`,
    captureEyebrow: "You're almost there",
    captureTitle: "Where should we send your diagnostic?",
    name: "Name",
    email: "Email",
    honeypot: "Leave this field empty",
    seeResult: "See my result",
    sending: "Sending...",
    errorName: "Please enter your name.",
    errorEmail: "Please enter a valid email.",
    resultEyebrow: "Your NEXT YOU archetype",
    inPhase: "You're in the phase:",
    priorityPillar: "Priority pillar:",
    allPhases: "supports you through all 3 phases",
    join: "Explore NEXT YOU",
  },
};
