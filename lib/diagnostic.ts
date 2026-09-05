// Diagnóstico Next You — 8 pillars, questions, and archetypes.
// Ported from docs/CM-diagnostico-quiz-v3-completo.txt (source of truth for copy).
// Order matters: on a score tie, the pillar listed first wins.

export type PillarKey =
  | "mentalidad"
  | "direccion"
  | "tecnologia"
  | "empleabilidad"
  | "ingles"
  | "productividad"
  | "bienestar"
  | "comunidad";

export interface QuizOption {
  label: string;
  score: number;
}

export interface Pillar {
  key: PillarKey;
  question: string;
  options: QuizOption[];
  archetype: string;
  tag: string;
  description: string;
}

export const PILLARS: Pillar[] = [
  {
    key: "mentalidad",
    question: "Cuando piensas en cambiar de rumbo profesional, ¿qué es lo primero que sientes?",
    options: [
      { label: "Confianza", score: 1 },
      { label: "Curiosidad con duda", score: 2 },
      { label: "Miedo a fallar otra vez", score: 3 },
      { label: "Culpa por no haberlo hecho antes", score: 4 },
    ],
    archetype: "La Reinventora Silenciosa",
    tag: "diagnostico-mentalidad",
    description:
      "Tienes más claridad de la que te reconoces, pero una voz interna sigue frenando el primer paso. Tu prioridad es tomar decisiones sin pedirle permiso al miedo.",
  },
  {
    key: "direccion",
    question: "¿Qué tan clara tienes tu próxima meta profesional?",
    options: [
      { label: "Muy clara", score: 1 },
      { label: "Idea general", score: 2 },
      { label: "Varias ideas, no sé cuál elegir", score: 3 },
      { label: "Ninguna idea todavía", score: 4 },
    ],
    archetype: "La Multipotencial Atascada",
    tag: "diagnostico-direccion",
    description:
      "Tienes talento e intereses de sobra, y eso mismo es lo que te dispersa. Tu prioridad es elegir una dirección concreta y darle foco, aunque signifique soltar otras opciones por ahora.",
  },
  {
    key: "tecnologia",
    question: "¿Cómo describirías tu relación con la tecnología y la IA hoy?",
    options: [
      { label: "La uso a mi favor", score: 1 },
      { label: "La uso poco, quiero aprender más", score: 2 },
      { label: "Me intimida", score: 3 },
      { label: "La evito por completo", score: 4 },
    ],
    archetype: "La Analógica en Transición",
    tag: "diagnostico-tecnologia",
    description:
      "No te falta capacidad, te falta práctica y confianza con las herramientas que hoy definen el mercado laboral. Tu prioridad es perderle el miedo a la IA con pasos pequeños y guiados.",
  },
  {
    key: "empleabilidad",
    question: "¿Qué tan preparado(a) sientes tu perfil profesional hoy?",
    options: [
      { label: "Listo para postular", score: 1 },
      { label: "Necesita ajustes", score: 2 },
      { label: "Desactualizado hace tiempo", score: 3 },
      { label: "No sé por dónde empezar", score: 4 },
    ],
    archetype: "La Profesional Invisible",
    tag: "diagnostico-empleabilidad",
    description:
      "Tu experiencia vale, pero tu perfil no la está comunicando. Tu prioridad es reconstruir cómo te presentas para que el mercado vea lo que realmente sabes hacer.",
  },
  {
    key: "ingles",
    question: "¿Cómo te sientes usando inglés en un contexto laboral?",
    options: [
      { label: "Lo domino", score: 1 },
      { label: "Cómodo con margen de mejora", score: 2 },
      { label: "Me pongo nervioso/a", score: 3 },
      { label: "Es una barrera real", score: 4 },
    ],
    archetype: "La Migrante en Pausa",
    tag: "diagnostico-ingles",
    description:
      "El idioma se ha convertido en la razón que usas para no avanzar. Tu prioridad es ganar fluidez profesional para dejar de posponer las oportunidades que ya podrías tomar.",
  },
  {
    key: "productividad",
    question: "¿Qué tan bien organizas tu tiempo entre trabajo, familia y tu crecimiento?",
    options: [
      { label: "Tengo un sistema", score: 1 },
      { label: "Voy resolviendo semana a semana", score: 2 },
      { label: "El tiempo se me escapa", score: 3 },
      { label: "No encuentro tiempo para mí", score: 4 },
    ],
    archetype: "La Ocupada Sin Avance",
    tag: "diagnostico-productividad",
    description:
      "Tienes agenda llena, pero poco que mostrar de lo que realmente te importa. Tu prioridad es diseñar un sistema que le dé espacio real a tu reinvención, no solo a lo urgente.",
  },
  {
    key: "bienestar",
    question: "¿Cómo está tu energía/salud mientras persigues este cambio?",
    options: [
      { label: "Cuido mi descanso", score: 1 },
      { label: "Podría cuidarme más", score: 2 },
      { label: "Cansado/a la mayoría del tiempo", score: 3 },
      { label: "Agotado/a, al límite", score: 4 },
    ],
    archetype: "La Guerrera Agotada",
    tag: "diagnostico-bienestar",
    description:
      "Estás sosteniendo el cambio a pura fuerza de voluntad, y el cuerpo ya está pasando la factura. Tu prioridad es recuperar energía antes de seguir empujando.",
  },
  {
    key: "comunidad",
    question: "¿Con quién cuentas hoy para acompañarte en este proceso?",
    options: [
      { label: "Red de apoyo sólida", score: 1 },
      { label: "1-2 personas cercanas", score: 2 },
      { label: "Casi siempre solo/a", score: 3 },
      { label: "Completamente solo/a", score: 4 },
    ],
    archetype: "La Reinventora en Solitario",
    tag: "diagnostico-comunidad",
    description:
      "Estás cargando este proceso sin la red que mereces tener. Tu prioridad es rodearte de personas que entiendan lo que estás viviendo, para dejar de reinventarte a solas.",
  },
];

export type QuizScores = Partial<Record<PillarKey, number>>;

/** Highest-scoring pillar wins; ties go to whichever pillar is listed first in PILLARS. */
export function computeWinner(scores: QuizScores): Pillar {
  let winner = PILLARS[0];
  let winnerScore = scores[PILLARS[0].key] ?? 0;

  for (let i = 1; i < PILLARS.length; i++) {
    const pillar = PILLARS[i];
    const score = scores[pillar.key] ?? 0;
    if (score > winnerScore) {
      winner = pillar;
      winnerScore = score;
    }
  }

  return winner;
}

/** Rejects a scores object that doesn't have a valid 1-4 score for every pillar. */
export function isValidScores(scores: unknown): scores is Required<QuizScores> {
  if (!scores || typeof scores !== "object") return false;
  return PILLARS.every((pillar) => {
    const value = (scores as Record<string, unknown>)[pillar.key];
    return typeof value === "number" && value >= 1 && value <= 4;
  });
}
