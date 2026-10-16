import { PILLARS, type PillarKey } from "@/lib/diagnostic";
import type { Locale } from "@/lib/i18n/config";

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

function communityPageUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${siteUrl}/es/proyectos/next-you`;
}

// Verbatim from ~/Downloads/secuencias-email-8-arquetipos.md (Carla, 2026-09-08).
// Timing per that doc: día 0 (inmediato), día 3, día 7 — delayDays below are
// PER-STEP (days since the previous step), so [0, 3, 4] sums to day 7.
// Final CTA points to /comunidad (the bridge page to Skool), not directly to
// Skool, per that doc's explicit instruction.
const QUIZ_SEQUENCE_CONTENT: Record<PillarKey, { subject2: string; body2: string; subject3: string; body3: string }> = {
  mentalidad: {
    subject2: "Lo que rompió mi ciclo de dudar (no fue sentir menos miedo)",
    body2:
      "Lo que rompió mi ciclo de duda no fue sentir menos miedo. Fue un fin de semana como voluntaria en GiveCamp Memphis, construyendo una página web para una organización sin fines de lucro. Terminé liderando ese equipo. Ese resultado real —no una promesa, algo que pude ver terminado— fue la primera prueba de que sí era posible.\n\nSi tú estás en el ciclo de \"lo intento, dudo, paro, vuelvo a intentar\", la salida no es esperar a sentirte más segura. Es buscar un proyecto pequeño y real donde puedas ver evidencia de que sí puedes — no una promesa más, algo terminado.\n\n¿Cuál podría ser esa prueba pequeña para ti esta semana?",
    subject3: "No tienes que romper este ciclo sola",
    body3:
      "Algo que aprendí después de mis propios ciclos de duda: se rompen más rápido acompañada que sola.\n\nEn la Comunidad Next You, el pilar de Mentalidad es de los que más trabajamos en las sesiones en vivo — no con charlas motivacionales, sino con ejercicios concretos para identificar qué creencia específica te está frenando, y qué micro-paso puedes dar esta semana.\n\nSi sientes que ya es momento de dejar de intentarlo en aislamiento, te dejo la puerta abierta: [Únete a la Comunidad Next You →]",
  },
  direccion: {
    subject2: "Cómo elegí un camino cuando tenía demasiadas opciones",
    body2:
      "Cuando empecé a explorar tecnología, había demasiados caminos posibles: desarrollo, diseño, automatización, gestión de proyectos. No fue investigar más lo que me dio claridad — fue elegir UNA dirección concreta, aunque no tuviera la certeza de que era \"la correcta\", y comprometerme con ella el tiempo suficiente para saber si funcionaba.\n\nLa dirección no se encuentra pensando más. Se encuentra actuando en una sola vía el tiempo suficiente para tener evidencia real.\n\n¿Cuál es la UNA dirección a la que podrías comprometerte las próximas 4 semanas, aunque no estés 100% segura?",
    subject3: "Un mapa de próximo paso, no de toda la vida",
    body3:
      "No necesitas un mapa de toda tu vida. Necesitas el siguiente paso concreto.\n\nEn la Comunidad Next You trabajamos exactamente eso en el pilar de Dirección: no planes de 10 años, sino tu próximo paso claro, con acompañamiento para sostenerlo cuando la duda regrese — porque va a regresar, y está bien.\n\nSi quieres dejar de perseguir todos los caminos a la vez: [Únete a la Comunidad Next You →]",
  },
  tecnologia: {
    subject2: "No necesitas un curso más, necesitas un proyecto real",
    body2:
      "La mayoría de la gente que se queda atascada con la tecnología no le falta información — tiene demasiada, de demasiados cursos distintos, sin nunca construir nada real y terminado.\n\nLo que a mí me dio confianza no fue otro curso. Fue construir algo pequeño y real: una página web de fin de semana para una ONG. Nadie me pidió título ni certificación — solo un resultado que pudieran ver.\n\n¿Cuál sería el proyecto más pequeño y real que podrías construir esta semana, aunque no sea perfecto?",
    subject3: "Tecnología sin miedo, con acompañamiento real",
    body3:
      "En la Comunidad Next You, el pilar de Tecnología e IA está pensado para quien empieza literalmente desde cero — sin asumir que ya sabes programar, sin lenguaje técnico que confunda más de lo que ayuda.\n\nSi quieres perderle el miedo a la tecnología con pasos pequeños y guiados, en vez de intentarlo sola frente a mil tutoriales distintos: [Únete a la Comunidad Next You →]",
  },
  empleabilidad: {
    subject2: 'Cómo hice visible una experiencia que "no calificaba"',
    body2:
      'Durante mucho tiempo pensé que mi experiencia —mesera, limpieza, comedor escolar— no contaba para nada "profesional". Estaba equivocada. Cada uno de esos trabajos demostraba algo real: adaptabilidad, resiliencia, capacidad de aprender rápido bajo presión.\n\nEl problema no era mi experiencia. Era cómo la estaba contando —o no contando en absoluto.\n\nHaz este ejercicio: toma tu trabajo actual (o el último que tuviste) y escribe una frase de qué habilidad concreta demuestra, más allá del título del puesto.',
    subject3: "Oportunidades reales, no solo consejos de CV",
    body3:
      "En la Comunidad Next You, el pilar de Empleabilidad incluye algo que casi nadie más ofrece: oportunidades de trabajo y colaboración reales compartidas dentro de la comunidad, no solo plantillas de CV genéricas.\n\nSi quieres dejar de sentir que tu experiencia es invisible para el mercado: [Únete a la Comunidad Next You →]",
  },
  ingles: {
    subject2: "El idioma no mide tu capacidad, mide tu práctica",
    body2:
      "Aprobar esa certificación en inglés no significó que de repente dominaba el idioma perfectamente. Significó que dejé de esperar a sentirme lista para usarlo, y empecé a practicarlo en situaciones reales, con errores incluidos.\n\nEl inglés profesional no se aprende evitando situaciones incómodas. Se aprende atravesándolas, una conversación imperfecta a la vez.\n\n¿Cuál sería una sola conversación en inglés que has estado posponiendo esta semana?",
    subject3: "Práctica real de inglés, no otra app de gramática",
    body3:
      "En la Comunidad Next You, el pilar de Inglés Profesional incluye sesiones de conversación en vivo — práctica real con otras personas en tu misma situación, no otra app de gramática que nunca terminas.\n\nSi quieres dejar de posponer las oportunidades que ya podrías tomar: [Únete a la Comunidad Next You →]",
  },
  productividad: {
    subject2: "Los 3 permisos que sostuvieron mi rutina más intensa",
    body2:
      'Sostener ese ritmo no fue solo disciplina. Fue darme permisos concretos: permiso para no saberlo todo antes de avanzar, permiso para pedir ayuda en vez de intentarlo completamente sola, y permiso para redefinir qué es "suficiente" en un día ocupado.\n\nEl tiempo no aparece solo — se construye con decisiones temporales e incómodas, no con más horas mágicas en el día.\n\n¿Qué estarías dispuesta a mover temporalmente esta semana para avanzar en lo que de verdad importa?',
    subject3: "Un sistema, no más fuerza de voluntad",
    body3:
      'En la Comunidad Next You, el pilar de Productividad no se trata de "esfuérzate más" — se trata de sistemas simples que le den espacio real a tu reinvención, sin sacrificar trabajo, familia ni descanso.\n\nSi quieres dejar de estar ocupada sin avanzar: [Únete a la Comunidad Next You →]',
  },
  bienestar: {
    subject2: "El bienestar no es un lujo aparte del método",
    body2:
      'Durante mucho tiempo traté el descanso como algo que "ganaba" después de cumplir todo lo demás. Fue al revés: los periodos donde más avancé de verdad fueron los que tenían un límite claro de cuánto sacrificio estaba dispuesta a sostener, y por cuánto tiempo.\n\nSi estás empujando sin límites definidos ahora mismo, la pregunta no es "¿cómo aguanto más?" — es "¿qué límite necesito ponerle a esto para sostenerlo?"',
    subject3: "No tienes que sostener esto sola, agotada",
    body3:
      "En la Comunidad Next You, el pilar de Bienestar está integrado en cada sesión — no como un tema aparte, sino como parte real de cómo diseñamos cualquier reinicio. Reiniciar tu carrera no debería costarte tu salud.\n\nSi sientes que estás al límite: [Únete a la Comunidad Next You →]",
  },
  comunidad: {
    subject2: "Lo que logré en equipo que no logré sola",
    body2:
      "Pasé dos años intentando aprender tecnología completamente sola. Dudaba, paraba, volvía a intentar. Lo que finalmente funcionó fue un fin de semana en equipo —GiveCamp Memphis— construyendo algo real junto a otra persona, no otro intento en solitario frente a una pantalla.\n\nNo es que necesites que alguien haga el trabajo por ti. Es que el mismo esfuerzo, acompañado, se sostiene distinto.\n\n¿Con quién podrías compartir tu próximo paso esta semana, en vez de guardarlo para ti sola?",
    subject3: "No vas a reiniciar sola",
    body3:
      "La Comunidad Next You existe exactamente para esto: accountability partners, retos compartidos, y un Muro de Victorias donde cada avance —grande o pequeño— se celebra con alguien más, no en silencio.\n\nSi ya estás lista para dejar de intentarlo en aislamiento: [Únete a la Comunidad Next You →]",
  },
};

// Email 1 (immediate) intro line per archetype — the rest of email 1 (result +
// short story teaser) is generic enough to share, keyed by pillar below.
const EMAIL1_INTRO: Record<PillarKey, string> = {
  mentalidad:
    "Llevas tiempo pensando en tu próxima versión, pero la duda te frena antes de dar el primer paso. Quiero decirte algo que me hubiera gustado escuchar hace años: no te falta capacidad, te falta permiso para empezar sin tenerlo todo resuelto.\n\nYo pasé dos años completos —2019 a 2021— en ese mismo lugar. Aprendía un poco de tecnología, dudaba, paraba, volvía a intentar meses después. La frase que se repetía en mi cabeza era: \"educadora, latina, mujer, mamá... imposible.\"\n\nEstaba equivocada. Y probablemente tú también lo estés, sobre lo que te estás diciendo ahora mismo.\n\nEn los próximos días te voy a compartir qué fue lo que rompió ese ciclo para mí, y cómo aplicarlo a tu situación.",
  direccion:
    "Tienes talento e intereses de sobra, y eso mismo es lo que te dispersa. Tu prioridad ahora no es encontrar más caminos — es elegir uno y darle foco, aunque signifique soltar otras opciones por ahora.\n\nMi propia meta durante el bootcamp era conseguir trabajo como programadora antes de agosto de 2021. No la cumplí exactamente en esa fecha — la cumplí un mes después. Si hubiera medido ese proceso solo por si llegué a tiempo, habría llamado fracaso a algo que cambió por completo el rumbo de mi carrera.\n\nEn los próximos días te cuento cómo elegí una sola dirección cuando sentía que tenía demasiadas opciones.",
  tecnologia:
    "Sabes que la tecnología es parte de tu próxima versión, pero todavía te intimida. La buena noticia: no necesitas dominarla de golpe, solo dar el primer paso concreto.\n\nYo pasé de mesera a Software Engineer sin título en tecnología. El punto de partida no fue un curso — fue un fin de semana como voluntaria en GiveCamp Memphis, construyendo una página web real para una organización sin fines de lucro, en dos días.\n\nEn los próximos días te cuento cómo encontrar tu propia versión de ese primer proyecto.",
  empleabilidad:
    "Tienes más valor del que tu CV o tu portafolio muestran hoy. Tu prioridad ahora es hacer visible lo que ya sabes hacer.\n\nMi primer trabajo en Estados Unidos fue de mesera, sin hablar inglés. Después limpié casas, trabajé en un gimnasio, en un comedor escolar. Ninguno de esos trabajos aparecía \"bien\" en un CV tradicional — pero cada uno me enseñó algo que terminé usando en mi carrera en tecnología.\n\nEn los próximos días te cuento cómo aprendí a hacer visible esa experiencia.",
  ingles:
    "El idioma se ha convertido en la barrera silenciosa que frena oportunidades que ya mereces. Es un obstáculo técnico, no una medida de tu capacidad.\n\nLlegué a Estados Unidos sin hablar inglés. Mi primer trabajo fue de mesera. Un año después aprobé una certificación de Personal Trainer completamente en inglés — el primer gran quiebre de creencia sobre mí misma. Dos años después de llegar, ya enseñaba español en escuelas públicas.\n\nEn los próximos días te cuento qué fue distinto en esos dos años.",
  productividad:
    "Estás ocupada todo el tiempo, pero sientes que no avanzas hacia donde quieres ir. Tu reto no es hacer más — es organizar mejor lo que ya haces.\n\nHice un bootcamp de programación de seis meses mientras trabajaba tiempo completo como profesora y era mamá de tres. Dormí de 1am a 5am durante ese periodo. No fue balance — fue temporal, con un propósito claro y una fecha de cierre.\n\nEn los próximos días te cuento los 3 permisos que me tuve que dar para sostenerlo.",
  bienestar:
    "Estás persiguiendo tu próxima versión al límite de tu energía. Sin este pilar resuelto, cualquier otro cambio se sostiene sobre una base frágil.\n\nEn 2016 nació mi tercer hijo, prematuro. Pasamos un mes con él en el hospital. Años después, durante mi bootcamp, sostuve seis meses de dormir muy poco — y aunque no me arrepiento del resultado, no lo haría exactamente igual otra vez. El cuerpo pasa factura.\n\nEn los próximos días te cuento qué aprendí sobre sostener el cambio sin quemarte en el proceso.",
  comunidad:
    "Has intentado avanzar sola una y otra vez. No es un problema de esfuerzo — es que este proceso se sostiene mejor acompañado.\n\nCuando migramos a Estados Unidos a finales de 2014, llegamos a Florida sin nada. Fue mi hermana, recibiéndonos en Memphis el 31 de diciembre de ese año, la que nos dio la base para empezar de nuevo. Años después, fue un equipo de voluntariado —no un curso solitario— lo que me dio la validación que necesitaba para cambiar de carrera.\n\nEn los próximos días te cuento por qué el acompañamiento cambió todo.",
};

// Quiz result sequence — 3 steps per pillar. Timing: día 0, +3, +4 (cumulative
// day 7), per docs/... secuencias-email-8-arquetipos.md.
export function getQuizSequence(pillarKey: PillarKey): SequenceStep[] {
  const pillar = PILLARS.find((p) => p.key === pillarKey)!;
  const content = QUIZ_SEQUENCE_CONTENT[pillarKey];
  const communityUrl = communityPageUrl();

  return [
    {
      delayDays: 0,
      subject: `Tu resultado: ${pillar.archetype}`,
      body: (name, unsubscribeUrl) =>
        `${greeting(name)}\n\n` +
        `Tu resultado en el Diagnóstico Next You: ${pillar.archetype}.\n\n` +
        `${EMAIL1_INTRO[pillarKey]}` +
        footer(unsubscribeUrl),
    },
    {
      delayDays: 3,
      subject: content.subject2,
      body: (name, unsubscribeUrl) => `${greeting(name)}\n\n${content.body2}` + footer(unsubscribeUrl),
    },
    {
      delayDays: 4,
      subject: content.subject3,
      body: (name, unsubscribeUrl) =>
        `${greeting(name)}\n\n${content.body3.replace("[Únete a la Comunidad Next You →]", `Únete a la Comunidad Next You → ${communityUrl}`)}` +
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
      `Si quieres saber cuál de estos 8 pilares es tu prioridad ahora mismo, te dejo un diagnóstico corto y gratuito: https://carlamontano.io/es/proyectos/next-you/diagnostico\n\n` +
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
      `Si sientes que ya no quieres intentar esto sola/o, te dejo la puerta abierta aquí: ${communityPageUrl()}\n\n` +
      `No necesitas tener todo resuelto para entrar. Solo el siguiente paso.` +
      footer(unsubscribeUrl),
  },
];

// English version of the newsletter welcome sequence. Same four emails, translated; the wording about
// Carla's current work is kept accurate to today (the Spanish text predates her return to Venezuela).
function greetingEn(name: string) {
  return name.trim() ? `Hi ${name.trim()},` : "Hi,";
}

function footerEn(unsubscribeUrl: string) {
  return `\n\n—\nCarla\n\nDon't want more emails? Unsubscribe here: ${unsubscribeUrl}`;
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export const NEWSLETTER_SEQUENCE_EN: SequenceStep[] = [
  {
    delayDays: 0,
    subject: "You're in. Here's what happens next",
    body: (name, unsubscribeUrl) =>
      `${greetingEn(name)}\n\n` +
      `Thank you for being here.\n\n` +
      `My name is Carla Montaño. My first job in the United States was waiting tables without speaking English. After that I cleaned houses, cared for babies, and worked at a gym and in a school cafeteria. Today I'm a software engineer without a traditional tech degree, and I help other people rebuild their careers from scratch.\n\n` +
      `I'm not telling you this to impress you. I'm telling you because if your professional life no longer feels like you, I want you to know something from day one: you don't need to have everything figured out to start changing it.\n\n` +
      `This is Reiniciar Sin Mapa — Restart Without a Map.\n\n` +
      `Over the next few days I'll send you:\n` +
      `— The full story behind this movement (and why it isn't a motivational speech, it's a method).\n` +
      `— The 8 pillars that hold up any real professional reinvention.\n` +
      `— An invitation to the NEXT YOU community, if you'd like to stop doing this alone.\n\n` +
      `For now, just one question: what part of your professional life no longer feels like you? Reply to this email — I read every answer.` +
      footerEn(unsubscribeUrl),
  },
  {
    delayDays: 2,
    subject: `"Educator, Latina, woman, mom... impossible"`,
    body: (name, unsubscribeUrl) =>
      `${greetingEn(name)}\n\n` +
      `For almost 2 years I told myself the same sentence every time I tried to learn technology: "educator, Latina, woman, mom... impossible."\n\n` +
      `I'd learn a little HTML and CSS. I'd doubt myself. I'd stop. I'd try again months later. That cycle lasted from 2019 to 2021.\n\n` +
      `What broke it wasn't feeling less afraid. It was a weekend as a volunteer at an event called GiveCamp, building a website for a nonprofit. I didn't just contribute to the team — I ended up leading it. That real result was the first proof that it was possible.\n\n` +
      `Months later I joined a coding bootcamp while working full time as a teacher and raising three kids. I slept from 1am to 5am for 6 months. In September 2021 I landed my first remote job as a Software Engineer.\n\n` +
      `I'm telling you this because the "impossible" you're telling yourself today — whatever it is — is probably also a belief, not a fact.\n\n` +
      `Tomorrow I'll tell you what I did differently so that cycle of trying and stopping finally broke.` +
      footerEn(unsubscribeUrl),
  },
  {
    delayDays: 3,
    subject: "The 8 pillars that hold up any real restart",
    body: (name, unsubscribeUrl) =>
      `${greetingEn(name)}\n\n` +
      `One of the most common mistakes when trying to reinvent yourself is thinking everything gets solved with "positive thinking." Mindset matters, but on its own it doesn't hold anything up.\n\n` +
      `After restarting my professional life several times — moving countries, changing careers, starting over — I identified 8 areas that have to move together. I call it NEXT YOU™:\n\n` +
      `1. Mindset — the belief that it's possible\n` +
      `2. Direction — knowing where you're headed, even imperfectly\n` +
      `3. Technology & AI — the tools of the moment we live in\n` +
      `4. Employability — making visible what you already know how to do\n` +
      `5. Professional English — when it applies, no longer a barrier\n` +
      `6. Productivity — sustaining change without sacrificing your life\n` +
      `7. Wellbeing — so restarting doesn't cost you your health\n` +
      `8. Community — not doing it alone\n\n` +
      `If you'd like to know which of these 8 pillars is your priority right now, here's a short, free diagnostic: ${siteUrl()}/en/ventures/next-you/diagnostic\n\n` +
      `In the next email I'll show you what this looks like in practice, inside a real community.` +
      footerEn(unsubscribeUrl),
  },
  {
    delayDays: 4,
    subject: "You won't restart alone",
    body: (name, unsubscribeUrl) =>
      `${greetingEn(name)}\n\n` +
      `You've been with me for a few days and you already know my story and the method behind Reiniciar Sin Mapa. Today I want to tell you where all of this lives in practice: the NEXT YOU community.\n\n` +
      `It isn't a silent Facebook group or a recorded course nobody finishes. This is what a week inside looks like:\n\n` +
      `— Monday: I set the week's intention, tied to a specific pillar and a concrete micro-challenge.\n` +
      `— Wednesday: check-in with your accountability partner for the month.\n` +
      `— Friday: we share progress on the Wall of Wins — big or small, everything counts.\n` +
      `— Once a month: a live session with me, going deep on one pillar.\n\n` +
      `Inside are people who are today where you could be in six months. And others who are exactly where you are now.\n\n` +
      `A heads-up: the live sessions and most conversations are in Spanish today.\n\n` +
      `If you don't want to try this alone anymore, the door is open here: ${siteUrl()}/en/ventures/next-you\n\n` +
      `You don't need to have everything figured out to join. Just the next step.` +
      footerEn(unsubscribeUrl),
  },
];

export function getSequenceSteps(sequence: string, language: Locale = "es"): SequenceStep[] | null {
  if (sequence === "newsletter") return language === "en" ? NEWSLETTER_SEQUENCE_EN : NEWSLETTER_SEQUENCE;
  // The quiz drip exists in Spanish only for now; English takers get a single result email instead.
  if (sequence.startsWith("quiz_") && language === "es") {
    const pillarKey = sequence.slice("quiz_".length) as PillarKey;
    if (PILLARS.some((p) => p.key === pillarKey)) return getQuizSequence(pillarKey);
  }
  return null;
}
