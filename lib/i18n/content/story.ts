// The origin-story page ("Mi historia") in both languages. Long-form personal copy lives here
// rather than in the main dictionaries so those stay scannable.
import type { Locale } from "@/lib/i18n/config";

export interface StoryContent {
  metaTitle: string;
  description: string;
  title: string;
  eyebrow: string;
  tagline: string;
  heroAlt: string;
  beforeEyebrow: string;
  beforeTitle: string;
  story: string[];
  quote: string;
  storyContinued: string[];
  routeEyebrow: string;
  routeTitle: string;
  routeLead: string;
  timeline: { year: string; title: string; detail: string }[];
  lessonsEyebrow: string;
  lessonsTitle: string;
  lessons: { title: string; body: string }[];
  purposeEyebrow: string;
  purposeTitle: string;
  purposeBody: string;
  purposeQuote: string;
  purposeCta: string;
  purposeAlt: string;
  nextEyebrow: string;
  nextTitle: string;
  nextLead: string;
  nextSteps: { key: "diagnostic" | "community" | "mentoring"; title: string; body: string; bullets: string[]; cta: string }[];
  finalEyebrow: string;
  finalTitle: string;
  finalCta: string;
}

const es: StoryContent = {
  metaTitle: "Mi historia — Carla Montaño",
  description:
    "Fui madre joven en Venezuela. Emigré a Estados Unidos sin hablar inglés. Trabajé de mesera, limpié casas, cuidé bebés — mientras aprendía sola. Cambié de carrera y me convertí en Software Engineer sin título tradicional en tecnología. Conseguí empleo remoto — y renuncié. Volví a Venezuela. Emprendí de nuevo.",
  title: "No Empecé Sabiendo El Camino. Lo Construí Reiniciando Muchas Veces.",
  eyebrow: "Sobre mí",
  tagline: "Educadora → Software Engineer | Migrante | Madre de 3",
  heroAlt: "Carla Montaño",
  beforeEyebrow: "Antes de escribir código",
  beforeTitle: "Empecé Como Educadora. No Como Programadora.",
  story: [
    "Me gradué de Educación Física, Deporte y Recreación en la Universidad de Carabobo, Venezuela, en 2011. Ya trabajaba como educadora desde 2010, en un colegio bilingüe — sin hablar inglés, por eso nunca opté a un mejor salario.",
    "A finales de 2014 migramos a Estados Unidos: mi esposo, mis dos hijos mayores y yo. Llegamos a Florida sin trabajo, con pagos muy bajos, y yo no podía trabajar porque mi hijo menor no tenía escuela disponible. El 31 de diciembre de ese año nos reubicamos en Memphis, Tennessee, donde mi hermana y su esposo nos recibieron.",
    "Ahí empezó lo que hoy le llamo mi travesía del umbral. Mi primer trabajo en Estados Unidos fue de mesera, junto a mi esposo, en un restaurante mexicano — algo que ninguno de los dos había hecho antes. Después limpié casas y cuidé bebés que no eran míos. Estudié y aprobé una certificación de Personal Trainer completamente en inglés: el primer gran quiebre de creencia sobre mí misma.",
    "En 2016 nació mi tercer hijo, prematuro. Pasamos un mes con él en el hospital. Ese mismo año conseguí mi primer trabajo formal con entrevista en inglés — en el piso de un gimnasio del YMCA. Después entré al sistema escolar por la puerta más humilde posible: el comedor, como técnica auxiliar de alimentos. Semanas más tarde, y a solo dos años de haber llegado sin hablar inglés, logré entrar como profesora de español al sistema público de Shelby County.",
  ],
  quote: "“Educadora, latina, mujer, mamá… imposible.” — así pensaba, en 2019, cuando empecé a mirar la tecnología.",
  storyContinued: [
    "Durante dos años completos entré y salí de ese ciclo: aprendía un poco de HTML y CSS, dudaba, paraba, volvía a intentarlo meses después. Lo que finalmente lo rompió no fue sentir menos miedo — fue un fin de semana como voluntaria en GiveCamp Memphis, en febrero de 2021, construyendo una página web para una organización sin fines de lucro. Terminé liderando ese equipo. Fue la primera prueba real de que sí era posible.",
    "En abril de 2021 entré a un bootcamp de programación Full Stack — sin dejar de trabajar tiempo completo como profesora, ni de cuidar a mis tres hijos. Durante seis meses dormí de 1am a 5am: estudiaba y construía proyectos antes y después de dar clases. A finales de septiembre de 2021 conseguí mi primer trabajo remoto como Software Engineer, sin título formal en tecnología.",
    "En 2025, la situación migratoria en Estados Unidos se complicó fuertemente para mi familia. Tomamos la decisión de regresar a Venezuela. Renuncié a mi trabajo remoto —la empresa no podía emplear fuera de USA— y en julio de 2025 llegamos a una ciudad nueva, a empezar otra vez: sin trabajo estable, solo con mis clientes personales.",
    "Hoy, un año después, sigo reiniciando: trabajo en implementación y mejora de procesos, desarrollo aplicaciones internas, apoyo como directora de tecnología a una fundación, y estoy construyendo esta comunidad. Cada reinicio dejó una herramienta. Juntas, se convirtieron en un método: NEXT YOU™.",
  ],
  routeEyebrow: "La ruta",
  routeTitle: "Mi Camino, En Coordenadas",
  routeLead: "Sin mapa, pero con fechas reales.",
  timeline: [
    { year: "2014", title: "Migración a USA", detail: "Florida, después Memphis. Sin trabajo, sin inglés, con dos hijos." },
    { year: "2015", title: "Odd jobs y primeros logros", detail: "Mesera, limpieza, cuidado de bebés, YMCA, comedor escolar." },
    { year: "2016–2017", title: "Profesora de español", detail: "Shelby County Schools, Memphis, TN." },
    { year: "2019–2021", title: "El ciclo con la tecnología", detail: "Aprender, dudar, parar, reintentar." },
    { year: "2021", title: "Bootcamp y primer empleo remoto", detail: "Software Engineer, sin título en tecnología." },
    { year: "2025", title: "Regreso a Venezuela", detail: "Renuncia, mudanza, empezar de nuevo." },
    { year: "2026", title: "Next You", detail: "Nace Reiniciar Sin Mapa como movimiento." },
  ],
  lessonsEyebrow: "Lo que aprendí",
  lessonsTitle: "Tres Cosas Que Sostienen Todo Lo Demás",
  lessons: [
    {
      title: "No Necesitas Papeles Perfectos",
      body: "Ni título formal, ni el momento ideal, ni sentirte lista. Necesitas un proyecto real, por pequeño que sea, que demuestre que sí puedes.",
    },
    {
      title: "El Método Vale Más Que La Motivación",
      body: "La motivación se agota a la semana. Lo que sostuvo cada uno de mis reinicios fueron pasos concretos, repetibles, no discursos de ánimo.",
    },
    {
      title: "Nadie Debería Reiniciar Sola",
      body: "Cada vez que lo intenté en aislamiento, tardé más y dudé más. Cada vez que tuve comunidad, avancé más rápido.",
    },
  ],
  purposeEyebrow: "Tecnología con propósito",
  purposeTitle: "Creo Tecnología Que Ayuda A Personas Reales",
  purposeBody:
    "Aprender a programar me permitió reconstruir mi vida. Pero con el tiempo entendí que la tecnología también puede cambiar la vida de otros. Cuando Venezuela atravesó una emergencia nacional, construí junto a un equipo de voluntarios una plataforma para conectar gratuitamente a personas afectadas con psicólogos. No fue un proyecto comercial — fue una respuesta humana usando las herramientas que conocíamos.",
  purposeQuote: "Eso resume lo que significa para mí la tecnología: una herramienta, nunca un fin.",
  purposeCta: "Conoce Contigo Venezuela →",
  purposeAlt: "Contigo Venezuela — plataforma de acompañamiento psicológico gratuito",
  nextEyebrow: "Tu próximo paso",
  nextTitle: "Elige Dónde Empezar",
  nextLead: "No hay un solo camino correcto — hay un siguiente paso. Aquí están los tres.",
  nextSteps: [
    {
      key: "diagnostic",
      title: "Descubre Tu Next You",
      body: "Un diagnóstico de 5 minutos que identifica cuál de los 8 pilares necesita tu atención ahora mismo.",
      bullets: ["Diagnóstico gratuito", "Resultado personalizado", "Sin compromiso"],
      cta: "Empezar Diagnóstico →",
    },
    {
      key: "community",
      title: "Únete A La Comunidad",
      body: "El hogar de quienes están reiniciando en paralelo a ti — retos mensuales, sesiones en vivo y acompañamiento real.",
      bullets: ["8 canales por pilar", "Sesiones en vivo mensuales", "Muro de victorias"],
      cta: "Entrar A La Comunidad →",
    },
    {
      key: "mentoring",
      title: "Mentoría",
      body: "Cuando estés listo/a para una transformación estructurada, con acompañamiento directo y resultados medibles.",
      bullets: ["Cohortes por temporada", "Plan personalizado", "Acompañamiento 1:1"],
      cta: "Ver Opciones →",
    },
  ],
  finalEyebrow: "Tu próxima versión te espera",
  finalTitle: "No Necesitas Tener Todo Resuelto Para Dar Tu Siguiente Paso.",
  finalCta: "Haz El Diagnóstico Next You →",
};

const en: StoryContent = {
  metaTitle: "My story — Carla Montaño",
  description:
    "I became a mother young in Venezuela. I moved to the United States without speaking English. I waited tables, cleaned houses, cared for babies — all while teaching myself. I changed careers and became a Software Engineer without a traditional tech degree. I landed a remote job — and resigned. I went back to Venezuela. I started again.",
  title: "I Didn't Start Knowing The Way. I Built It By Restarting Many Times.",
  eyebrow: "About me",
  tagline: "Educator → Software Engineer | Immigrant | Mother of 3",
  heroAlt: "Carla Montaño",
  beforeEyebrow: "Before I wrote code",
  beforeTitle: "I Started As An Educator. Not As A Programmer.",
  story: [
    "I graduated in Physical Education, Sports and Recreation from Universidad de Carabobo in Venezuela in 2011. I had already been working as an educator since 2010, at a bilingual school — without speaking English, which is why I never qualified for a better salary.",
    "At the end of 2014 we moved to the United States: my husband, my two older children and I. We landed in Florida with no job and very low pay, and I couldn't work because my youngest had no school available. On December 31 of that year we relocated to Memphis, Tennessee, where my sister and her husband welcomed us.",
    "That's where what I now call my threshold crossing began. My first job in the United States was waiting tables, next to my husband, at a Mexican restaurant — something neither of us had ever done. After that I cleaned houses and cared for babies who weren't mine. I studied for and passed a Personal Trainer certification entirely in English: the first big break in the belief I had about myself.",
    "In 2016 my third child was born, prematurely. We spent a month with him in the hospital. That same year I landed my first formal job with an interview in English — on the floor of a YMCA gym. Then I entered the school system through the humblest door possible: the cafeteria, as a food service assistant. Weeks later, just two years after arriving without speaking English, I got in as a Spanish teacher in the Shelby County public school system.",
  ],
  quote: "“Educator, Latina, woman, mom… impossible.” — that's what I thought in 2019, when I started looking at technology.",
  storyContinued: [
    "For two full years I went in and out of that cycle: I'd learn a little HTML and CSS, doubt myself, stop, and try again months later. What finally broke it wasn't feeling less afraid — it was a weekend as a volunteer at GiveCamp Memphis, in February 2021, building a website for a nonprofit. I ended up leading that team. It was the first real proof that it was possible.",
    "In April 2021 I joined a Full Stack coding bootcamp — without leaving my full-time teaching job or stopping caring for my three children. For six months I slept from 1am to 5am: I studied and built projects before and after teaching. At the end of September 2021 I landed my first remote job as a Software Engineer, without a formal tech degree.",
    "In 2025, the immigration situation in the United States became very difficult for my family. We decided to return to Venezuela. I resigned from my remote job — the company couldn't employ people outside the US — and in July 2025 we arrived in a new city to start over: no steady job, only my own clients.",
    "Today, a year later, I'm still restarting: I work on implementing and improving processes, build internal applications, support a foundation as its technology director, and I'm building this community. Every restart left me a tool. Together, they became a method: NEXT YOU™.",
  ],
  routeEyebrow: "The route",
  routeTitle: "My Path, In Coordinates",
  routeLead: "No map, but real dates.",
  timeline: [
    { year: "2014", title: "Moving to the USA", detail: "Florida, then Memphis. No job, no English, two kids." },
    { year: "2015", title: "Odd jobs and first wins", detail: "Waitressing, cleaning, babysitting, YMCA, school cafeteria." },
    { year: "2016–2017", title: "Spanish teacher", detail: "Shelby County Schools, Memphis, TN." },
    { year: "2019–2021", title: "The cycle with technology", detail: "Learn, doubt, stop, try again." },
    { year: "2021", title: "Bootcamp and first remote job", detail: "Software Engineer, without a tech degree." },
    { year: "2025", title: "Return to Venezuela", detail: "Resigning, moving, starting over." },
    { year: "2026", title: "Next You", detail: "Reiniciar Sin Mapa is born as a movement." },
  ],
  lessonsEyebrow: "What I learned",
  lessonsTitle: "Three Things That Hold Everything Else Up",
  lessons: [
    {
      title: "You Don't Need Perfect Credentials",
      body: "Not a formal degree, not the perfect moment, not feeling ready. You need a real project, however small, that proves you can.",
    },
    {
      title: "Method Beats Motivation",
      body: "Motivation runs out within a week. What carried every one of my restarts were concrete, repeatable steps — not pep talks.",
    },
    {
      title: "Nobody Should Restart Alone",
      body: "Every time I tried in isolation, it took longer and I doubted more. Every time I had community, I moved faster.",
    },
  ],
  purposeEyebrow: "Technology with purpose",
  purposeTitle: "I Build Technology That Helps Real People",
  purposeBody:
    "Learning to code let me rebuild my life. But over time I understood that technology can change other people's lives too. When Venezuela went through a national emergency, I built, together with a team of volunteers, a platform to connect affected people with psychologists for free. It wasn't a commercial project — it was a human response using the tools we knew.",
  purposeQuote: "That sums up what technology means to me: a tool, never an end.",
  purposeCta: "Meet Contigo Venezuela →",
  purposeAlt: "Contigo Venezuela — a free psychological support platform",
  nextEyebrow: "Your next step",
  nextTitle: "Choose Where To Start",
  nextLead: "There isn't one right path — there's a next step. Here are three.",
  nextSteps: [
    {
      key: "diagnostic",
      title: "Discover Your Next You",
      body: "A 5-minute diagnostic that identifies which of the 8 pillars needs your attention right now.",
      bullets: ["Free diagnostic", "Personalized result", "No commitment"],
      cta: "Start The Diagnostic →",
    },
    {
      key: "community",
      title: "Join The Community",
      body: "The home of people restarting alongside you — monthly challenges, live sessions and real support.",
      bullets: ["8 channels, one per pillar", "Monthly live sessions", "Wall of wins"],
      cta: "Explore The Community →",
    },
    {
      key: "mentoring",
      title: "Mentoring",
      body: "When you're ready for a structured transformation, with direct support and measurable results.",
      bullets: ["Seasonal cohorts", "Personalized plan", "1:1 support"],
      cta: "See Options →",
    },
  ],
  finalEyebrow: "Your next version is waiting",
  finalTitle: "You Don't Need Everything Figured Out To Take Your Next Step.",
  finalCta: "Take The Next You Diagnostic →",
};

export const STORY_CONTENT: Record<Locale, StoryContent> = { en, es };
