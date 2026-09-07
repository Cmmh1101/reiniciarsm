import { PILLARS, type PillarKey } from "@/lib/diagnostic";
import { SKOOL_COMMUNITY_URL } from "@/lib/constants";

export interface SequenceStep {
  delayDays: number; // days after the PREVIOUS step (0 for the immediate one)
  subject: string;
  body: (name: string, unsubscribeUrl: string) => string;
}

function greeting(name: string) {
  return name.trim() ? `Hola ${name.trim()},` : "Hola,";
}

function footer(unsubscribeUrl: string) {
  return `\n\n—\nCarla\n\n¿No quieres recibir más correos? Date de baja aquí: ${unsubscribeUrl}`;
}

// Quiz result sequence — 3 steps per pillar, per docs/plan-migracion-stack-tecnico.md
// §5 Flujo 1: immediate result → pillar deep-dive (+2 days) → community invite (+4 days).
export function getQuizSequence(pillarKey: PillarKey): SequenceStep[] {
  const pillar = PILLARS.find((p) => p.key === pillarKey)!;

  return [
    {
      delayDays: 0,
      subject: `Tu resultado: ${pillar.archetype}`,
      body: (name, unsubscribeUrl) =>
        `${greeting(name)}\n\n` +
        `Tu arquetipo Next You es: ${pillar.archetype}.\n\n` +
        `${pillar.description}\n\n` +
        `En los próximos días te voy a mandar un email profundizando en tu pilar prioritario, y después una invitación a la Comunidad Next You.` +
        footer(unsubscribeUrl),
    },
    {
      // PLACEHOLDER — Carla's real "8 secuencias por arquetipo" deep-dive copy
      // isn't in docs/ yet (see lib/sequences.ts note below). Reusing the
      // archetype description as a stand-in so the sequence isn't broken.
      delayDays: 2,
      subject: `Profundizando en tu pilar: ${pillar.key}`,
      body: (name, unsubscribeUrl) =>
        `${greeting(name)}\n\n` +
        `Quiero profundizar un poco más en tu pilar prioritario.\n\n` +
        `${pillar.description}\n\n` +
        `[Este email todavía usa contenido genérico — pendiente reemplazar con la secuencia real por arquetipo.]` +
        footer(unsubscribeUrl),
    },
    {
      delayDays: 4,
      subject: "No vas a reiniciar sola",
      body: (name, unsubscribeUrl) =>
        `${greeting(name)}\n\n` +
        `Llevas unos días conmigo. Quiero invitarte a la Comunidad Next You — el hogar de quienes están reiniciando en paralelo a ti.\n\n` +
        `${SKOOL_COMMUNITY_URL}\n\n` +
        `No necesitas tener todo resuelto para entrar. Solo el siguiente paso.` +
        footer(unsubscribeUrl),
    },
  ];
}

// Newsletter welcome sequence — for direct newsletter signups (didn't take the
// quiz), so no pillar is assumed. Verbatim from docs/CM-secuencia-bienvenida-newsletter.md.
export const NEWSLETTER_SEQUENCE: SequenceStep[] = [
  {
    delayDays: 0,
    subject: "Ya estás dentro. Esto es lo que va a pasar ahora",
    body: (name, unsubscribeUrl) =>
      `${greeting(name)}\n\n` +
      `Gracias por estar aquí.\n\n` +
      `Mi nombre es Carla Montaño. Fui mesera sin hablar inglés en mi primer trabajo en Estados Unidos. Después limpié casas, cuidé bebés, trabajé en un gimnasio y en un comedor escolar. Hoy trabajo remoto como Software Engineer, sin título en tecnología, y ayudo a otras personas a reconstruir su carrera desde cero.\n\n` +
      `No te cuento esto para impresionarte. Te lo cuento porque si sientes que tu vida profesional ya no te representa, quiero que sepas algo desde el primer día: no necesitas tener todo resuelto para empezar a cambiarla.\n\n` +
      `Esto es Reiniciar Sin Mapa.\n\n` +
      `En los próximos días te voy a mandar:\n` +
      `— La historia completa detrás de este movimiento (y por qué no es un discurso motivacional, es un método).\n` +
      `— Los 8 pilares que sostienen cualquier reinvención profesional real.\n` +
      `— Una invitación a la Comunidad Next You, si quieres dejar de hacer esto sola/o.\n\n` +
      `Por ahora, solo una pregunta: ¿qué parte de tu vida profesional sientes que ya no te representa? Contéstame este email — leo todas las respuestas.` +
      footer(unsubscribeUrl),
  },
  {
    delayDays: 2,
    subject: `"Educadora, latina, mujer, mamá... imposible"`,
    body: (name, unsubscribeUrl) =>
      `${greeting(name)}\n\n` +
      `Durante casi 2 años me repetí la misma frase cada vez que intentaba aprender tecnología: "educadora, latina, mujer, mamá... imposible."\n\n` +
      `Aprendía un poco de HTML y CSS. Dudaba. Paraba. Volvía a intentar meses después. Ese ciclo duró de 2019 a 2021.\n\n` +
      `Lo que lo rompió no fue sentir menos miedo. Fue un fin de semana como voluntaria en un evento llamado GiveCamp, construyendo una página web para una organización sin fines de lucro. No solo aporté al equipo — terminé liderándolo. Ese resultado real fue la primera prueba de que sí era posible.\n\n` +
      `Meses después entré a un bootcamp de programación mientras trabajaba tiempo completo como profesora y era mamá de tres. Dormía de 1am a 5am durante 6 meses. En septiembre de 2021 conseguí mi primer trabajo remoto como Software Engineer.\n\n` +
      `Te cuento esto porque el "imposible" que tú te estás diciendo hoy — sea cual sea— probablemente también es una creencia, no un hecho.\n\n` +
      `Mañana te cuento qué hice distinto para que ese ciclo de intentar y parar finalmente se rompiera.` +
      footer(unsubscribeUrl),
  },
  {
    delayDays: 3,
    subject: "Los 8 pilares que sostienen cualquier reinicio real",
    body: (name, unsubscribeUrl) =>
      `${greeting(name)}\n\n` +
      `Uno de los errores más comunes al intentar reinventarte es pensar que todo se resuelve con "mentalidad positiva". La mentalidad importa, pero sola no sostiene nada.\n\n` +
      `Después de reiniciar mi vida profesional varias veces —migrando de país, cambiando de carrera, volviendo a empezar— identifiqué 8 áreas que tienen que moverse juntas. Le llamo NEXT YOU™:\n\n` +
      `1. Mentalidad — la creencia de que sí es posible\n` +
      `2. Dirección — saber hacia dónde, aunque sea de forma imperfecta\n` +
      `3. Tecnología e IA — las herramientas del momento en que vivimos\n` +
      `4. Empleabilidad — hacer visible lo que ya sabes hacer\n` +
      `5. Inglés profesional — cuando aplica, dejar de ser una barrera\n` +
      `6. Productividad — sostener el cambio sin sacrificar tu vida\n` +
      `7. Bienestar — que reiniciar no te cueste tu salud\n` +
      `8. Comunidad — no hacerlo sola/o\n\n` +
      `Si quieres saber cuál de estos 8 pilares es tu prioridad ahora mismo, te dejo un diagnóstico corto y gratuito: https://carlamontano.io/diagnostico-next-you\n\n` +
      `En el próximo email te cuento cómo se ve esto puesto en práctica, dentro de una comunidad real.` +
      footer(unsubscribeUrl),
  },
  {
    delayDays: 4,
    subject: "No vas a reiniciar sola",
    body: (name, unsubscribeUrl) =>
      `${greeting(name)}\n\n` +
      `Llevas unos días conmigo y ya conoces mi historia y el método detrás de Reiniciar Sin Mapa. Hoy quiero contarte dónde vive todo esto en la práctica: la Comunidad Next You.\n\n` +
      `No es un grupo de Facebook silencioso ni un curso grabado que nadie termina. Así se ve una semana adentro:\n\n` +
      `— Lunes: planteo la intención de la semana, ligada a un pilar específico y un micro-reto concreto.\n` +
      `— Miércoles: check-in con tu accountability partner del mes.\n` +
      `— Viernes: compartimos avances en el Muro de Victorias — grandes o pequeños, todos cuentan.\n` +
      `— Una vez al mes: sesión en vivo conmigo, profundizando un pilar.\n\n` +
      `Dentro hay personas que hoy mismo están donde tú podrías estar en seis meses. Y otras que están exactamente donde tú estás ahora.\n\n` +
      `Si sientes que ya no quieres intentar esto sola/o, te dejo la puerta abierta aquí: ${SKOOL_COMMUNITY_URL}\n\n` +
      `No necesitas tener todo resuelto para entrar. Solo el siguiente paso.` +
      footer(unsubscribeUrl),
  },
];

export function getSequenceSteps(sequence: string): SequenceStep[] | null {
  if (sequence === "newsletter") return NEWSLETTER_SEQUENCE;
  if (sequence.startsWith("quiz_")) {
    const pillarKey = sequence.slice("quiz_".length) as PillarKey;
    if (PILLARS.some((p) => p.key === pillarKey)) return getQuizSequence(pillarKey);
  }
  return null;
}
