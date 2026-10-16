// Spanish dictionary. Written as natural Spanish, not a literal translation.
// Prices and offers below are PROPOSED (per the redesign brief) until Carla confirms them.

import type { Dictionary } from "./en";

export const es: Dictionary = {
  site: {
    name: "Carla Montaño",
    descriptor: "Consultora de Tecnología y Soluciones",
    supporting: "Ingeniera de Software · Educadora · Emprendedora",
    // Draft tagline from the brief — pending Carla's approval.
    tagline: "Creando soluciones. Impulsando personas.",
    philosophy: "Conectando personas, ideas y tecnología.",
    description:
      "Consultora de tecnología y soluciones, ingeniera de software, educadora y emprendedora que ayuda a personas y organizaciones a entender la tecnología, resolver problemas y convertir ideas en soluciones prácticas.",
    skipToContent: "Saltar al contenido",
  },

  nav: {
    home: "Inicio",
    about: "Sobre mí",
    workWithMe: "Trabaja conmigo",
    work: "Mi trabajo",
    ventures: "Proyectos",
    shop: "Tienda",
    resources: "Recursos",
    contact: "Contacto",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    switchTo: "English",
    switchAria: "Switch to English",
  },

  footer: {
    explore: "Explorar",
    connect: "Conecta",
    ventures: "Proyectos",
    legal: "Legal",
    privacy: "Privacidad",
    terms: "Términos",
    rights: "© 2026 Carla Montaño",
    montanoSystems: "Montano Systems",
    acadetech: "Acadetech",
    nextYou: "NEXT YOU",
  },

  common: {
    free: "Gratis",
    viewAll: "Ver todo",
    readMore: "Leer más",
    status: { active: "Activo", development: "En desarrollo", initiative: "Iniciativa", beta: "Beta", volunteer: "Proyecto voluntario", experience: "Experiencia" },
    partlySpanish: "",
    allCategories: "Todos",
    purchases: "compras",
    backToShop: "← Volver a la tienda",
    backToResources: "← Todos los recursos",
    notFoundTitle: "Esta página no existe",
    notFoundBody: "Puede que el enlace sea antiguo o tenga un error. Aquí tienes algunos lugares para empezar.",
    notFoundCta: "Volver al inicio",
  },

  home: {
    meta: {
      title: "Carla Montaño — Consultora de Tecnología y Soluciones",
      description:
        "Ingeniera de software, consultora de tecnología, educadora y emprendedora. Consultoría, talleres, productos digitales y proyectos que conectan personas, ideas y tecnología.",
    },
    hero: {
      eyebrow: "Consultora de Tecnología y Soluciones",
      title: "Creando soluciones. Impulsando personas.",
      lead: "Ingeniera de software, consultora de tecnología, educadora y emprendedora — ayudo a personas y organizaciones a entender la tecnología, resolver problemas y convertir ideas en soluciones prácticas.",
      ctaPrimary: "Trabaja conmigo",
      ctaSecondary: "Explora mi trabajo",
      portraitAlt: "Retrato de Carla Montaño",
    },
    intro: {
      eyebrow: "Hola",
      title: "Conecto personas, ideas y tecnología.",
      body: "Empecé como educadora y me convertí en ingeniera de software. Hoy ayudo a personas y organizaciones a darle sentido a la tecnología, a mejorar los sistemas que les quitan tiempo y a convertir ideas en soluciones prácticas — y enseño lo que voy aprendiendo en el camino.",
    },
    help: {
      eyebrow: "Cómo puedo ayudarte",
      title: "Elige el tipo de ayuda que necesitas",
      cards: [
        {
          title: "Tech Clarity",
          body: "Una sesión enfocada de 60 minutos para aclarar una decisión de tecnología, una herramienta o un proyecto — y salir con próximos pasos claros.",
        },
        {
          title: "Estrategia y asesoría",
          body: "Orientación práctica sobre sistemas, herramientas y flujos de trabajo para equipos pequeños, educadores y emprendedores.",
        },
        {
          title: "Talleres y charlas",
          body: "Sesiones prácticas que explican tecnología e IA en lenguaje claro para equipos, escuelas y comunidades.",
        },
      ],
      implementation: "¿Necesitas que alguien lo construya? El software, la automatización y las integraciones se realizan a través de Montano Systems.",
      implementationCta: "Ver proyectos",
      cta: "Ver todas las formas de trabajar juntas",
    },
    work: {
      eyebrow: "Trabajo seleccionado",
      title: "Proyectos reales, descritos con honestidad",
      cta: "Ver todo mi trabajo",
    },
    learn: {
      eyebrow: "Aprende y crea",
      title: "Plantillas, guías y tutoriales",
      body: "Recursos a tu ritmo para aprender, organizar tu trabajo y resolver problemas prácticos.",
      ctaShop: "Ver la tienda",
      ctaResources: "Leer los recursos",
      latestProducts: "De la tienda",
      latestPosts: "Últimos recursos",
    },
    ventures: {
      eyebrow: "Proyectos",
      title: "Tres proyectos, una sola persona detrás",
      cta: "Conocer más",
    },
    story: {
      eyebrow: "Mi historia",
      title: "De educadora a ingeniera — y por qué importa",
      body: "Sé lo que es aprender tecnología mientras trabajas tiempo completo y cuidas a tu familia. Por eso me importa tender puentes entre las personas y la tecnología — para que más gente pueda usarla con confianza.",
      cta: "Leer mi historia",
    },
    contact: {
      title: "Hablemos",
      body: "¿Una pregunta, un proyecto o una invitación para hablar? Leo cada mensaje.",
      cta: "Escríbeme",
      ctaSecondary: "Trabaja conmigo",
    },
  },

  about: {
    meta: {
      title: "Sobre mí — Carla Montaño",
      description: "Educadora, ingeniera de software y emprendedora. La historia detrás del trabajo.",
    },
    eyebrow: "Sobre mí",
    title: "Educadora, ingeniera, emprendedora.",
    lead: "Una carrera construida entre aulas, código y empresas — unida por una idea: la tecnología debe ayudar a las personas.",
    story: [
      "Empecé mi carrera como educadora en Venezuela. Me gradué de Educación Física, Deporte y Recreación en la Universidad de Carabobo en 2011 y daba clases desde 2010.",
      "En 2014 mi familia y yo nos mudamos a Estados Unidos. Reconstruí mi carrera desde cero — trabajando mientras aprendía inglés — y llegué a trabajar como profesora de español en el sistema público de Shelby County, Tennessee.",
      "La tecnología vino después. Tras un fin de semana como voluntaria construyendo un sitio web para una organización sin fines de lucro, completé un bootcamp de programación full stack sin dejar de dar clases a tiempo completo. En 2021 empecé a trabajar de forma remota como ingeniera de software — cerca de cuatro años en EdTech, construyendo y mejorando productos y sistemas.",
      "Desde mi regreso a Venezuela en 2025, trabajo de forma independiente y a través de mi propia empresa, In Motion Web Solutions: implementación de procesos, aplicaciones internas y automatizaciones, y apoyo como directora de tecnología de una fundación. También estudio una maestría en Tecnología de la Información.",
      "Lo que lo une todo: veo la tecnología como una forma de ayudar a las personas, y me encanta enseñarla. NEXT YOU, la comunidad que inicié alrededor de la reinvención profesional, nació de mi propio camino.",
    ],
    valuesTitle: "Lo que valoro",
    values: [
      { title: "Centrada en las personas", body: "La tecnología solo importa si le hace el trabajo o la vida más fácil a alguien." },
      { title: "Práctica", body: "Próximos pasos claros antes que jerga impresionante." },
      { title: "Curiosa", body: "Sigo aprendiendo en público — y comparto lo que funciona y lo que no." },
      { title: "Honesta", body: "Solo afirmo lo que es real: roles, resultados y lo que aún está en progreso." },
    ],
    todayTitle: "Lo que hago hoy",
    today: [
      "Consultoría en tecnología, talleres y charlas.",
      "Implementación de sistemas y automatización con Montano Systems.",
      "Construyendo Acadetech, una academia de aprendizaje estructurado.",
      "Creando productos digitales y recursos.",
      "Estudiando una maestría en Tecnología de la Información.",
    ],
    ctaTitle: "¿Quieres que trabajemos juntas?",
    cta: "Trabaja conmigo",
  },

  workWithMe: {
    meta: {
      title: "Trabaja conmigo — Carla Montaño",
      description: "Sesiones Tech Clarity, mentoría, talleres y charlas.",
    },
    eyebrow: "Trabaja conmigo",
    title: "Ayuda clara, ajustada a lo que necesitas.",
    lead: "Elige una sesión, un paquete de mentoría o un taller. Si necesitas que alguien construya algo, te oriento hacia el equipo correcto.",
    offers: [
      {
        key: "techClarity",
        name: "Sesión Tech Clarity",
        price: "$95",
        priceNote: "precio piloto · 60 minutos",
        body: "Trae una decisión de tecnología, una herramienta de la que dudas o un proyecto que sientes estancado. Lo aclaramos juntas y sales con próximos pasos claros y un breve resumen por escrito.",
        includes: ["Sesión por video de 60 minutos", "Breve resumen por escrito", "Alcance limitado: asesoría, no implementación"],
        cta: "Solicitar una sesión",
      },
      {
        key: "mentoring",
        name: "Mentoría de carrera y aprendizaje",
        price: "$100",
        priceNote: "por sesión · o 4 sesiones por $340",
        body: "Acompañamiento uno a uno para transiciones de carrera y rutas de aprendizaje en tecnología — desde los primeros pasos hasta un plan que puedas seguir.",
        includes: ["Sesiones individuales de 60 minutos", "Plan de acción personalizado", "El paquete de 4 sesiones incluye un mes de la comunidad"],
        cta: "Ver opciones de mentoría",
      },
      {
        key: "workshops",
        name: "Talleres y charlas",
        price: "Desde $250",
        priceNote: "sesión virtual estándar de 90 minutos",
        body: "Sesiones prácticas para equipos, escuelas y comunidades: tecnología e IA explicadas en lenguaje claro, con ejercicios que la gente puede usar ese mismo día.",
        includes: ["Virtual o presencial (cotización bajo petición)", "Adaptado a tu audiencia", "Cotizaciones a medida para formatos más largos"],
        cta: "Preguntar por un taller",
      },
    ],
    agencyTitle: "¿Necesitas que alguien lo construya?",
    agencyBody:
      "El software, los sistemas con IA, la automatización de flujos, las integraciones y la implementación se realizan a través de Montano Systems. Las auditorías de sistemas se ofrecen allí, para que tengas una sola oferta clara — no dos.",
    agencyCta: "Ver proyectos",
    howTitle: "Cómo funciona una sesión Tech Clarity",
    how: [
      { title: "1. Cuéntame qué está pasando", body: "Envía un breve formulario con tu situación y lo que quieres decidir." },
      { title: "2. La agendamos", body: "Confirmo que sea un buen encaje y te comparto cómo reservar y pagar." },
      { title: "3. Nos reunimos", body: "60 minutos enfocados en tu pregunta." },
      { title: "4. Recibes un resumen", body: "Un breve resumen por escrito con los próximos pasos acordados." },
    ],
    note: "Los precios mostrados son el piloto de lanzamiento actual.",
  },

  work: {
    meta: {
      title: "Mi trabajo — Carla Montaño",
      description: "Proyectos seleccionados y experiencia profesional en software, sistemas y EdTech.",
    },
    eyebrow: "Mi trabajo",
    title: "Proyectos y experiencia seleccionados.",
    lead: "Describo resultados solo cuando puedo verificarlos, y no nombro clientes sin su permiso.",
    roleLabel: "Rol",
    stackLabel: "Construido con",
    projects: [
      {
        name: "Plataforma carlamontano.io",
        status: "active",
        role: "Diseño y desarrollo",
        stack: ["Next.js", "Supabase", "Stripe", "Resend", "Netlify"],
        body: "Un sitio de marca personal con panel de administración y CRM, newsletter con segmentación de audiencias, tienda de productos digitales con descargas seguras, reseñas de productos y analítica.",
        href: "",
        linkLabel: "",
      },
      {
        name: "LigaFam (nombre provisional)",
        status: "beta",
        role: "Fundadora y desarrolladora",
        stack: [],
        body: "Una aplicación para ligas de béisbol con anotación y transmisión en vivo, que ahora se abre a usuarios beta.",
        href: "",
        linkLabel: "",
      },
      {
        name: "Contigo Venezuela",
        status: "volunteer",
        role: "Integrante del equipo voluntario",
        stack: [],
        body: "Una plataforma gratuita, construida con un equipo de voluntarios, que conecta a personas afectadas por una emergencia nacional con psicólogos.",
        href: "https://contigove.com/",
        linkLabel: "Visitar el proyecto",
      },
      {
        name: "Ingeniería de software en EdTech",
        status: "experience",
        role: "Ingeniera de software remota, cerca de cuatro años",
        stack: [],
        body: "Desarrollo de producto, implementación y mejora continua para una empresa de EdTech.",
        href: "",
        linkLabel: "",
      },
    ],
    ctaTitle: "¿Buscas un resumen para reclutadores?",
    ctaBody: "Encuéntrame en LinkedIn o escríbeme.",
    ctaLinkedIn: "LinkedIn",
    ctaContact: "Contacto",
  },

  ventures: {
    meta: {
      title: "Proyectos — Carla Montaño",
      description: "Montano Systems, Acadetech y NEXT YOU: los proyectos que estoy construyendo.",
    },
    eyebrow: "Proyectos",
    title: "Proyectos con su propio propósito.",
    lead: "Cada proyecto responde a una necesidad distinta. Las etiquetas de estado muestran qué está activo y qué se sigue construyendo.",
    items: [
      {
        key: "montanoSystems",
        name: "Montano Systems",
        note: "Marca de trabajo · entidad legal: In Motion Web Solutions LLC",
        status: "active",
        body: "Software, sistemas con IA, automatización de flujos de trabajo, integraciones, implementación y soporte técnico para pequeños negocios y organizaciones.",
        for: "Para ti si necesitas que construyan algo o que auditen un sistema.",
        cta: "Visitar Montano Systems",
      },
      {
        key: "acadetech",
        name: "Acadetech",
        note: "",
        status: "development",
        body: "Programas educativos estructurados en habilidades tecnológicas, inglés, español y emprendimiento — para estudiantes desde secundaria en adelante, incluyendo apoyo a jóvenes y a familias que educan en casa.",
        for: "Para ti si buscas un programa estructurado.",
        cta: "",
      },
      {
        key: "nextYou",
        name: "NEXT YOU",
        note: "También conocido como Reiniciar sin mapa",
        status: "initiative",
        body: "Acompañamiento y comunidad para la transición de carrera y la reinvención personal, con un método de tres fases: Giro, Ruta, Ritmo.",
        for: "Para ti si estás reinventando tu carrera.",
        cta: "Explorar NEXT YOU",
      },
    ],
    routingTitle: "¿Cuál necesito?",
    routing: [
      { need: "Consejo, aprendizaje o mi experiencia", where: "Quédate aquí — Trabaja conmigo" },
      { need: "Que construyan un sistema, automatización o software", where: "Montano Systems" },
      { need: "Un programa de aprendizaje estructurado", where: "Acadetech" },
      { need: "Reinvención profesional y comunidad", where: "NEXT YOU" },
    ],
  },

  nextYou: {
    meta: {
      title: "NEXT YOU — Carla Montaño",
      description: "Un método y una comunidad para la transición de carrera y la reinvención personal.",
    },
    eyebrow: "NEXT YOU · Reiniciar sin mapa",
    title: "No tienes que reinventarte sola.",
    lead: "NEXT YOU es una comunidad y un método para personas que atraviesan una transición de carrera. Nació de mi propio camino.",
    methodEyebrow: "El método",
    methodTitle: "Giro. Ruta. Ritmo.",
    methodLead: "Tres fases, en orden — cada una con un destino claro.",
    phases: [
      { name: "Giro", promise: "Rompes la creencia de que es imposible, y eliges un rumbo.", pillars: "Mentalidad + Dirección" },
      { name: "Ruta", promise: "Construyes lo que el mercado necesita ver de ti.", pillars: "Tecnología e IA + Empleabilidad + Inglés" },
      { name: "Ritmo", promise: "Lo sostienes sin quemarte.", pillars: "Productividad + Bienestar" },
    ],
    communityLabel: "Comunidad",
    communityNote: "No es una fase más — es el espacio que te acompaña en las 3. No reinventarte a solas.",
    actionsTitle: "Por dónde seguir",
    actions: [
      { title: "Haz el diagnóstico", body: "Ocho preguntas para ver qué área necesita tu atención primero.", key: "diagnostic" },
      { title: "Únete a la comunidad", body: "La comunidad en Skool, con sesiones en vivo y acompañamiento.", key: "community" },
      { title: "Lee la historia de origen", body: "El camino personal detrás de NEXT YOU.", key: "story" },
      { title: "Mentoría", body: "Mentoría uno a uno para tu transición.", key: "mentoring" },
    ],
  },

  diagnostic: {
    meta: {
      title: "Diagnóstico Next You — Carla Montaño",
      description: "Ocho preguntas para descubrir qué área de tu transición de carrera necesita atención primero.",
    },
    spanishOnly: "",
  },

  shop: {
    meta: {
      title: "Tienda — Carla Montaño",
      description: "Plantillas, guías, ebooks y herramientas para aprender, organizar tu trabajo y resolver problemas prácticos.",
    },
    eyebrow: "Tienda",
    title: "Productos digitales que puedes usar hoy.",
    lead: "Plantillas, guías y herramientas a tu ritmo. Directo a tu correo después de comprar.",
    empty: "Todavía no hay productos disponibles.",
    languageNote: "",
    related: "Relacionados",
    thanksTitle: "¡Gracias por tu compra!",
    thanksEyebrow: "Pago confirmado",
    thanksBody: "También te llegó el enlace de descarga por correo.",
    thanksFallback: "Te llegará el enlace de descarga por correo en unos minutos. Si no lo ves, revisa spam o escríbeme a hello@carlamontano.io.",
    download: "Descargar →",
    buyForm: { name: "Nombre", email: "Email", errorFields: "Completa tu nombre y un correo válido.", buy: "Comprar →", free: "Descargar gratis →", sending: "Enviando...", redirecting: "Redirigiendo a pago...", failed: "No se pudo iniciar el pago." },
    reviewsTitle: "Lo que dicen quienes ya lo compraron",
    verifiedBuyer: "Cliente verificado",
  },

  resources: {
    meta: {
      title: "Recursos — Carla Montaño",
      description: "Artículos, tutoriales e historias sobre tecnología, aprendizaje, carrera y cómo construir cosas.",
    },
    eyebrow: "Recursos",
    title: "Artículos, tutoriales e historias.",
    lead: "Escritura práctica sobre tecnología, aprendizaje, carrera y cómo construir cosas.",
    empty: "Pronto habrá nuevos recursos.",
    readingTime: "min de lectura",
    byline: "Por Carla Montaño",
    moreTitle: "Sigue leyendo",
    spanishOnly: "",
  },

  contact: {
    meta: {
      title: "Contacto — Carla Montaño",
      description: "Escríbeme sobre asesoría, talleres, desarrollos a medida, programas de aprendizaje, alianzas u oportunidades.",
    },
    eyebrow: "Contacto",
    title: "Hablemos.",
    lead: "Cuéntame qué buscas y enviaré tu mensaje al lugar correcto.",
    intentLabel: "¿De qué se trata?",
    intents: [
      { value: "advice", label: "Asesoría en tecnología / segunda opinión" },
      { value: "workshop", label: "Taller o charla" },
      { value: "custom-build", label: "Desarrollo a medida o automatización" },
      { value: "education", label: "Programa educativo" },
      { value: "partnership", label: "Alianza o colaboración" },
      { value: "recruiter", label: "Reclutador u oportunidad profesional" },
      { value: "product-support", label: "Soporte de un producto digital" },
      { value: "other", label: "Otra cosa" },
    ],
    nameLabel: "Nombre",
    emailLabel: "Correo electrónico",
    messageLabel: "Mensaje",
    send: "Enviar mensaje",
    sending: "Enviando...",
    success: "¡Gracias! Te responderé pronto.",
    error: "Algo salió mal. Inténtalo de nuevo o escribe a hello@carlamontano.io.",
    required: "Completa tu nombre, un correo válido y un mensaje.",
  },

  newsletter: {
    title: "Recibe nuevos recursos por correo",
    body: "Correos ocasionales y prácticos. Date de baja cuando quieras.",
    namePlaceholder: "Nombre",
    emailPlaceholder: "Correo",
    button: "Suscribirme",
    sending: "Enviando...",
    success: "Listo, ya estás dentro. Revisa tu bandeja.",
    error: "No se pudo suscribir. Inténtalo de nuevo.",
  },

  legal: {
    updated: "Última actualización: 15 de octubre de 2026",
    eyebrow: "Legal",
    privacy: {
      title: "Política de Privacidad",
      description: "Qué información recopilamos en carlamontano.io, cómo la usamos y qué derechos tienes.",
      intro:
        "Este sitio (carlamontano.io) es operado por Carla Montaño (“nosotros”, “nuestro”). Esta política explica qué información recopilamos, cómo la usamos y qué derechos tienes sobre ella.",
      sections: [
        {
          title: "Qué información recopilamos",
          bullets: [
            "Información de contacto: cuando te suscribes al newsletter, llenas el formulario de contacto, haces el diagnóstico o compras un producto, recopilamos tu nombre y correo electrónico.",
            "Información de pago: los pagos se procesan a través de Stripe. Nunca almacenamos los datos de tu tarjeta.",
            "Información de uso: usamos Google Analytics para entender cómo se usa el sitio (páginas visitadas, tiempo en el sitio, ubicación aproximada). Es información agregada y no te identifica individualmente.",
            "Comunidad: si te unes a la comunidad NEXT YOU, tu membresía y tu actividad se rigen también por la política de privacidad de Skool, la plataforma donde vive.",
          ],
        },
        {
          title: "Cómo usamos tu información",
          bullets: [
            "Para entregarte lo que pediste: tu compra, tu sesión, la respuesta a tu mensaje.",
            "Para enviarte el newsletter, si te suscribiste — puedes darte de baja con un clic desde cualquier correo.",
            "Para mejorar el sitio y el contenido según lo que resulta útil.",
            "Nunca vendemos tu información.",
          ],
        },
        {
          title: "Con quién la compartimos",
          paragraphs: ["Usamos los siguientes proveedores para operar el sitio. Cada uno recibe solo lo necesario para su función:"],
          bullets: [
            "Stripe — procesamiento de pagos.",
            "Resend — envío de correos.",
            "Google Analytics — analítica del sitio.",
            "Netlify — hosting.",
            "Supabase — almacenamiento seguro de la base de datos.",
            "Skool — plataforma de la comunidad NEXT YOU, si te unes.",
          ],
        },
        {
          title: "Cuánto tiempo la guardamos",
          paragraphs: ["Guardamos tu información mientras mantengas una relación activa con nosotros (suscriptora, cliente, miembro de la comunidad) o hasta que pidas que la eliminemos."],
        },
        {
          title: "Tus derechos",
          bullets: [
            "Pedir una copia de la información que tenemos sobre ti.",
            "Pedir que corrijamos información incorrecta.",
            "Pedir que eliminemos tu información, dentro de lo que la ley y nuestras obligaciones contables permitan.",
            "Darte de baja del newsletter en cualquier momento.",
          ],
          paragraphs: ["Para cualquiera de estos, escribe a hello@carlamontano.io."],
        },
        {
          title: "Cookies",
          paragraphs: ["Este sitio usa cookies de Google Analytics para entender el uso. Puedes bloquear o eliminar cookies desde la configuración de tu navegador. También guardamos una cookie para recordar tu elección de idioma."],
        },
        { title: "Menores de edad", paragraphs: ["Este sitio no está dirigido a menores de 18 años y no recopilamos intencionalmente su información."] },
        { title: "Cambios a esta política", paragraphs: ["Podemos actualizar esta política de vez en cuando. La fecha de “última actualización” arriba refleja la versión más reciente."] },
        { title: "Contacto", paragraphs: ["¿Preguntas sobre esta política? Escribe a hello@carlamontano.io."] },
      ],
    },
    terms: {
      title: "Términos y Condiciones",
      description: "Los términos que rigen el uso de carlamontano.io y la compra de nuestros productos y servicios.",
      intro: "Al usar este sitio (carlamontano.io) o comprar cualquiera de nuestros productos o servicios, aceptas estos términos.",
      sections: [
        {
          title: "Quiénes somos",
          paragraphs: ["Este sitio es operado por Carla Montaño. Contacto: hello@carlamontano.io. Los servicios de implementación y de agencia los presta Montano Systems (marca de trabajo de In Motion Web Solutions LLC) bajo sus propios acuerdos."],
        },
        {
          title: "Qué ofrecemos",
          bullets: [
            "Contenido educativo gratuito (artículos, tutoriales, recursos).",
            "Productos digitales: guías, workbooks, plantillas y herramientas.",
            "Sesiones de consultoría, mentoría, talleres y charlas.",
            "La comunidad NEXT YOU, alojada en Skool.",
          ],
        },
        {
          title: "Productos digitales",
          bullets: [
            "Al comprar, recibes un enlace de descarga por correo y en la página de confirmación.",
            "El enlace es personal — no lo compartas ni lo revendas.",
            "Por la naturaleza de los productos digitales, no ofrecemos reembolsos una vez entregado el enlace de descarga, salvo que la ley exija lo contrario. Si algo sale mal (archivo dañado, el correo no llegó), escribe a hello@carlamontano.io y lo resolvemos.",
            "Las plantillas de sitio web se entregan “tal cual” y no incluyen soporte de instalación salvo que se indique en la descripción del producto.",
          ],
        },
        {
          title: "Sesiones, mentoría y talleres",
          bullets: [
            "Las sesiones se agendan según la disponibilidad mostrada en el sitio o acordada por correo.",
            "Para cancelar o reprogramar, avísanos con al menos 24 horas de anticipación en hello@carlamontano.io.",
            "Los paquetes de sesiones deben usarse dentro de los 3 meses siguientes a la compra.",
            "Las sesiones Tech Clarity son de asesoría y de alcance limitado; no incluyen trabajo de implementación.",
          ],
        },
        {
          title: "Comunidad NEXT YOU",
          bullets: [
            "El acceso a la comunidad se gestiona a través de Skool y está sujeto también a los términos de esa plataforma.",
            "Puedes cancelar tu membresía en cualquier momento desde tu cuenta de Skool.",
          ],
        },
        {
          title: "Propiedad intelectual",
          paragraphs: ["Todo el contenido de este sitio —textos, guiones, gráficas, el método NEXT YOU y los productos digitales— es propiedad de Carla Montaño. No puedes copiarlo, redistribuirlo ni revenderlo sin permiso escrito, salvo las plantillas de sitio web, que están pensadas para que las adaptes como base de tu propio sitio."],
        },
        {
          title: "No es asesoría profesional",
          paragraphs: ["El contenido, las sesiones y la comunidad son de carácter educativo y de acompañamiento. No sustituyen asesoría legal, migratoria, financiera, psicológica o médica. Los resultados dependen del esfuerzo y las circunstancias de cada persona, y no garantizamos resultados específicos."],
        },
        {
          title: "Limitación de responsabilidad",
          paragraphs: ["Ofrecemos el sitio y nuestros servicios de buena fe, pero no somos responsables por daños indirectos derivados de su uso, en la medida permitida por la ley."],
        },
        { title: "Cambios a estos términos", paragraphs: ["Podemos actualizar estos términos de vez en cuando. La fecha de “última actualización” arriba refleja la versión más reciente."] },
        { title: "Ley aplicable", paragraphs: ["Estos términos se rigen por las leyes aplicables en la jurisdicción donde opera este negocio."] },
        { title: "Contacto", paragraphs: ["¿Preguntas sobre estos términos? Escribe a hello@carlamontano.io."] },
      ],
    },
  },
};
