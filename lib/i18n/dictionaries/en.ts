// Source of truth for the dictionary shape. es.ts must satisfy the same type.
// Prices and offers below are PROPOSED (per the redesign brief) until Carla confirms them.

interface LegalSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface Card {
  title: string;
  body: string;
}

export const en = {
  site: {
    name: "Carla Montaño",
    descriptor: "Technology & Solutions Consultant",
    supporting: "Software Engineer · Educator · Entrepreneur",
    tagline: "Building solutions. Empowering people.",
    philosophy: "Connecting people, ideas, and technology.",
    description:
      "Technology & solutions consultant, software engineer, educator and entrepreneur helping people and organizations understand technology, solve problems and turn ideas into practical solutions.",
    skipToContent: "Skip to content",
  },

  nav: {
    home: "Home",
    about: "About",
    workWithMe: "Work with me",
    work: "My work",
    ventures: "Ventures",
    shop: "Shop",
    resources: "Resources",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchTo: "Español",
    switchAria: "Cambiar a español",
  },

  footer: {
    explore: "Explore",
    connect: "Connect",
    ventures: "Ventures",
    legal: "Legal",
    privacy: "Privacy",
    terms: "Terms",
    rights: "© 2026 Carla Montaño",
    montanoSystems: "Montano Systems",
    acadetech: "Acadetech",
    nextYou: "NEXT YOU",
  },

  common: {
    free: "Free",
    viewAll: "View all",
    readMore: "Read more",
    status: { active: "Active", development: "In development", initiative: "Initiative", beta: "Beta", volunteer: "Volunteer project", experience: "Experience" },
    allCategories: "All",
    purchases: "purchases",
    backToShop: "← Back to the shop",
    backToResources: "← All resources",
    notFoundTitle: "This page doesn't exist",
    notFoundBody: "The link may be old or mistyped. Here are a few places to start.",
    notFoundCta: "Back to home",
  },

  home: {
    meta: {
      title: "Carla Montaño — Technology & Solutions Consultant",
      description:
        "Software engineer, technology consultant, educator and entrepreneur. Consulting, workshops, digital products and ventures that connect people, ideas and technology.",
    },
    hero: {
      eyebrow: "Technology & Solutions Consultant",
      title: "Building solutions. Empowering people.",
      lead: "Software engineer, technology consultant, educator and entrepreneur — helping people and organizations understand technology, solve problems and turn ideas into practical solutions.",
      ctaPrimary: "Work with me",
      ctaSecondary: "Explore my work",
      portraitAlt: "Portrait of Carla Montaño",
    },
    intro: {
      eyebrow: "Hello",
      title: "I connect people, ideas and technology.",
      body: "I started as an educator and became a software engineer. Today I help people and organizations make sense of technology, fix the systems that slow them down and turn ideas into practical solutions — and I teach what I learn along the way.",
    },
    help: {
      eyebrow: "How I can help",
      title: "Pick the kind of help you need",
      cards: [
        {
          title: "Tech SOS",
          body: "A quick 30-minute call for the small, urgent things — setting up an account, a phone line, a tool or an app that won't cooperate.",
        },
        {
          title: "1:1 sessions",
          body: "60 minutes on your real situation: a technology decision, a project, a learning path or a career move — and a clear plan when we're done.",
        },
        {
          title: "Workshops & speaking",
          body: "Hands-on sessions that explain technology and AI in plain language for teams, schools and communities.",
        },
      ] as Card[],
      implementation: "Need something built? Software, automation and integrations are delivered through Montano Systems.",
      implementationCta: "See ventures",
      cta: "See all the ways to work together",
    },
    work: {
      eyebrow: "Selected work",
      title: "Real projects, described honestly",
      cta: "See all my work",
    },
    learn: {
      eyebrow: "Learn and create",
      title: "Templates, guides and tutorials",
      body: "Self-serve resources to learn, organize your work and solve practical problems.",
      ctaShop: "Browse the shop",
      ctaResources: "Read the resources",
      latestProducts: "From the shop",
      latestPosts: "Latest resources",
    },
    ventures: {
      eyebrow: "Ventures",
      title: "Three projects, one person behind them",
      cta: "Learn more",
    },
    story: {
      eyebrow: "My story",
      title: "From educator to engineer — and why it matters",
      body: "I know what it's like to learn technology while working full time and raising a family. That's why I care about bridging people and technology — so more people can use it with confidence.",
      cta: "Read my story",
    },
    contact: {
      title: "Let's talk",
      body: "A question, a project or an invitation to speak? I read every message.",
      cta: "Get in touch",
      ctaSecondary: "Work with me",
    },
  },

  about: {
    meta: {
      title: "About — Carla Montaño",
      description: "Educator, software engineer and entrepreneur. The story behind the work.",
    },
    eyebrow: "About",
    title: "Educator, engineer, entrepreneur.",
    lead: "A career built across classrooms, codebases and companies — held together by one idea: technology should help people.",
    story: [
      "I began my career as an educator in Venezuela. I earned my degree in Physical Education, Sports and Recreation at Universidad de Carabobo in 2011 and had been teaching since 2010.",
      "In 2014 my family and I moved to the United States. I rebuilt my career from scratch — working while learning English — and eventually joined the public school system in Shelby County, Tennessee, as a Spanish teacher.",
      "Technology came next. After a volunteer weekend building a website for a nonprofit, I completed a full-stack programming bootcamp while still teaching full time. In 2021 I started working remotely as a software engineer — about four years in EdTech, building and improving products and systems.",
      "Since returning to Venezuela in 2025, I've worked independently and through my own company, In Motion Web Solutions: implementing processes, building internal applications and automations, and serving as technology director supporting a foundation. I'm also pursuing a Master's degree in Information Technology.",
      "What ties it together: I see technology as a way to help people, and I love teaching it. NEXT YOU, the community I started around career reinvention, grew out of my own journey.",
    ],
    valuesTitle: "What I value",
    values: [
      { title: "Human-centered", body: "Technology only matters if it makes someone's work or life easier." },
      { title: "Practical", body: "Clear next steps over impressive jargon." },
      { title: "Curious", body: "I keep learning in public — and share what works and what doesn't." },
      { title: "Honest", body: "I only claim what's real: roles, results and what's still in progress." },
    ] as Card[],
    todayTitle: "What I do today",
    today: [
      "Technology consulting, workshops and speaking.",
      "Systems implementation and automation through Montano Systems.",
      "Building Acadetech, a structured learning academy.",
      "Creating digital products and resources.",
      "Studying for a Master's in Information Technology.",
    ],
    ctaTitle: "Want to work together?",
    cta: "Work with me",
  },

  workWithMe: {
    meta: {
      title: "Work with me — Carla Montaño",
      description: "Book a Tech SOS call or a 1:1 session. Workshops and speaking on request.",
    },
    eyebrow: "Work with me",
    title: "Clear help, scoped to what you need.",
    lead: "Book a quick support call or a full session — pick a time and pay securely online. If you need something built, I'll point you to the right team.",
    offers: [
      {
        key: "sos",
        name: "Tech SOS",
        price: "$50",
        priceNote: "30 minutes",
        body: "Stuck on something small but urgent? Activating a phone line, setting up an account, getting a device, an email or an app to work. Book a short call and we solve it together.",
        includes: ["30-minute video call", "One concrete problem, solved or clearly diagnosed", "Best for quick, practical help"],
        cta: "Book a Tech SOS",
      },
      {
        key: "session",
        name: "1:1 Session",
        price: "$100",
        priceNote: "60 minutes · or 4 sessions for $340",
        body: "Technology help, a tool or project decision, a learning path or a career transition. We work on your real situation and you leave with a clear plan.",
        includes: [
          "60-minute video session",
          "Technology, AI, tools and systems — in plain language",
          "Career and learning guidance",
          "Short written next steps",
          "The 4-session package includes one month of the community",
        ],
        cta: "Book a session",
      },
      {
        key: "workshops",
        name: "Workshops & speaking",
        price: "From $250",
        priceNote: "standard 90-minute virtual session",
        body: "Practical sessions for teams, schools and communities: technology and AI explained in plain language, with exercises people can use the same day.",
        includes: ["Virtual or in person (quote on request)", "Tailored to your audience", "Custom quotes for longer formats"],
        cta: "Ask about a workshop",
      },
    ],
    mentoringTitle: "Looking for ongoing career mentoring?",
    mentoringBody: "The mentoring program for career reinvention has its own page, with a full FAQ.",
    mentoringCta: "See the mentoring program",
    agencyTitle: "Need something built?",
    agencyBody:
      "Software, AI-enabled systems, workflow automation, integrations and implementation are delivered through Montano Systems. System audits are offered there, so you get one clear offer — not two.",
    agencyCta: "See ventures",
    howTitle: "How booking works",
    how: [
      { title: "1. Choose your session", body: "Tech SOS for something quick, or a 1:1 session for a bigger question." },
      { title: "2. Pick a time", body: "Choose an open slot — times are shown in your own time zone." },
      { title: "3. Pay securely", body: "Card payment through Stripe. Zelle, PayPal or Pago Móvil on request." },
      { title: "4. Get your confirmation", body: "An email arrives with the details and the video call link before we meet." },
    ] as Card[],
    note: "Prices shown are the current launch prices.",
  },

  work: {
    meta: {
      title: "My work — Carla Montaño",
      description: "Selected projects and professional experience in software, systems and EdTech.",
    },
    eyebrow: "My work",
    title: "Selected projects and experience.",
    lead: "I describe outcomes only where I can verify them, and I don't name clients without permission.",
    roleLabel: "Role",
    stackLabel: "Built with",
    projects: [
      {
        name: "carlamontano.io platform",
        status: "active",
        role: "Design and development",
        stack: ["Next.js", "Supabase", "Stripe", "Resend", "Netlify"],
        body: "A personal-brand site with an admin dashboard and CRM, newsletter with audience segmentation, a digital-product store with secure downloads, product reviews and analytics.",
        href: "",
        linkLabel: "",
      },
      {
        name: "LigaFam",
        status: "beta",
        role: "Founder and developer",
        stack: [],
        body: "A baseball league app for live scoring and streaming. The MVP is live and open to beta users.",
        href: "https://ligafam.netlify.app/es",
        linkLabel: "Try the beta (in Spanish)",
      },
      {
        name: "Contigo Venezuela",
        status: "volunteer",
        role: "Volunteer team member",
        stack: [],
        body: "A free platform, built with a team of volunteers, connecting people affected by a national emergency with psychologists.",
        href: "https://contigove.com/",
        linkLabel: "Visit the project",
      },
      {
        name: "EdTech software engineering",
        status: "experience",
        role: "Remote software engineer, about four years",
        stack: [],
        body: "Product development, implementation and continuous improvement for an EdTech company.",
        href: "",
        linkLabel: "",
      },
    ],
    ctaTitle: "Looking for a recruiter-friendly summary?",
    ctaBody: "Find me on LinkedIn or get in touch.",
    ctaLinkedIn: "LinkedIn",
    ctaContact: "Contact",
  },

  ventures: {
    meta: {
      title: "Ventures — Carla Montaño",
      description: "Montano Systems, Acadetech and NEXT YOU: the projects I'm building.",
    },
    eyebrow: "Ventures",
    title: "Projects with their own purpose.",
    lead: "Each venture serves a different need. Status labels show what's live and what's still being built.",
    items: [
      {
        key: "montanoSystems",
        name: "Montano Systems",
        note: "Working brand · legal entity: In Motion Web Solutions LLC",
        status: "active",
        body: "Software, AI-enabled systems, workflow automation, integrations, implementation and technical support for small businesses and organizations.",
        for: "For you if you need something built or a system audited.",
        cta: "Visit Montano Systems",
      },
      {
        key: "acadetech",
        name: "Acadetech",
        note: "",
        status: "development",
        body: "Structured educational programs in technology skills, English, Spanish and entrepreneurship — for learners from high school up, including youth and homeschool support.",
        for: "For you if you're looking for a structured program.",
        cta: "",
      },
      {
        key: "nextYou",
        name: "NEXT YOU",
        note: "Also known as Reiniciar sin mapa",
        status: "initiative",
        body: "Guidance and community for career transition and personal reinvention, with a method of three phases: Giro, Ruta, Ritmo.",
        for: "For you if you're reinventing your career.",
        cta: "Explore NEXT YOU",
      },
    ],
    routingTitle: "Which one do I need?",
    routing: [
      { need: "Advice, learning or my expertise", where: "Stay here — Work with me" },
      { need: "A system, automation or software built", where: "Montano Systems" },
      { need: "A structured learning program", where: "Acadetech" },
      { need: "Career reinvention and community", where: "NEXT YOU" },
    ],
  },

  nextYou: {
    meta: {
      title: "NEXT YOU — Carla Montaño",
      description: "A method and community for career transition and personal reinvention.",
    },
    eyebrow: "NEXT YOU · Reiniciar sin mapa",
    title: "You don't have to reinvent yourself alone.",
    lead: "NEXT YOU is a community and method for people navigating a career transition. It grew out of my own journey.",
    methodEyebrow: "The method",
    methodTitle: "Giro. Ruta. Ritmo.",
    methodLead: "Three phases, in order — each with a clear destination.",
    phases: [
      { name: "Giro", promise: "You break the belief that it's impossible, and choose a direction.", pillars: "Mindset + Direction" },
      { name: "Ruta", promise: "You build what the market needs to see in you.", pillars: "Technology & AI + Employability + English" },
      { name: "Ritmo", promise: "You sustain it without burning out.", pillars: "Productivity + Well-being" },
    ],
    communityLabel: "Community",
    communityNote: "Not a phase — the space that accompanies all three. You don't reinvent alone.",
    actionsTitle: "Where to go from here",
    actions: [
      { title: "Take the diagnostic", body: "Eight questions to see which area needs your attention first.", key: "diagnostic" },
      { title: "Join the community", body: "A community on Skool, with live sessions and accountability. Sessions are mostly in Spanish today.", key: "community" },
      { title: "Read the origin story", body: "The personal journey behind NEXT YOU.", key: "story" },
      { title: "Mentoring", body: "One-to-one mentoring for your transition.", key: "mentoring" },
    ],
  },

  diagnostic: {
    meta: {
      title: "NEXT YOU Diagnostic — Carla Montaño",
      description: "Eight questions to discover which area of your career transition needs attention first.",
    },
  },

  shop: {
    meta: {
      title: "Shop — Carla Montaño",
      description: "Templates, guides, ebooks and tools to learn, organize your work and solve practical problems.",
    },
    eyebrow: "Shop",
    title: "Digital products you can use today.",
    lead: "Self-serve templates, guides and tools. Delivered to your inbox after purchase.",
    empty: "No products are available yet.",
    languageNote: "Some products are currently available in Spanish only. Language is shown on each product.",
    related: "Related",
    thanksTitle: "Thank you for your purchase!",
    thanksEyebrow: "Payment confirmed",
    thanksBody: "We also emailed you the download link.",
    thanksFallback: "Your download link will arrive by email in a few minutes. If you don't see it, check spam or write to hello@carlamontano.io.",
    download: "Download →",
    buyForm: { name: "Name", email: "Email", errorFields: "Please enter your name and a valid email.", buy: "Buy →", free: "Download free →", sending: "Sending...", redirecting: "Redirecting to payment...", failed: "Payment couldn't be started." },
    reviewsTitle: "What buyers say",
    verifiedBuyer: "Verified buyer",
  },

  resources: {
    meta: {
      title: "Resources — Carla Montaño",
      description: "Articles, tutorials and stories about technology, learning, careers and building.",
    },
    eyebrow: "Resources",
    title: "Articles, tutorials and stories.",
    lead: "Practical writing about technology, learning, careers and building things.",
    empty: "New resources are on the way.",
    readingTime: "min read",
    byline: "By Carla Montaño",
    moreTitle: "Keep reading",
    otherLanguageTitle: "Also available in Spanish",
    postOtherLanguage: "This article is available in Spanish only.",
  },

  contact: {
    meta: {
      title: "Contact — Carla Montaño",
      description: "Get in touch about advice, workshops, custom builds, learning programs, partnerships or opportunities.",
    },
    eyebrow: "Contact",
    title: "Let's talk.",
    lead: "Tell me what you're looking for and I'll route your message to the right place.",
    intentLabel: "What is this about?",
    intents: [
      { value: "advice", label: "Tech advice / second opinion" },
      { value: "workshop", label: "Workshop or speaking" },
      { value: "custom-build", label: "Custom build or automation" },
      { value: "education", label: "Education program" },
      { value: "partnership", label: "Partnership or collaboration" },
      { value: "recruiter", label: "Recruiter or professional opportunity" },
      { value: "product-support", label: "Digital product support" },
      { value: "other", label: "Something else" },
    ],
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    send: "Send message",
    sending: "Sending...",
    success: "Thanks! I'll get back to you soon.",
    error: "Something went wrong. Please try again or write to hello@carlamontano.io.",
    required: "Please fill in your name, a valid email and a message.",
  },

  booking: {
    sectionEyebrow: "Book now",
    sectionTitle: "Choose a session and a time",
    plans: {
      sos: { name: "Tech SOS", meta: "$50 · 30 minutes" },
      session: { name: "1:1 Session", meta: "$100 · 60 minutes" },
      pack: { name: "Package of 4 sessions", meta: "$340 · includes 1 month of the community" },
    },
    pay: { sos: "Pay and book — $50", session: "Pay and book — $100", pack: "Buy package — $340" },
    chooseTime: "Choose a time",
    timezoneNote: "Times shown in your time zone",
    week: "Week",
    month: "Month",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    name: "Name",
    email: "Email",
    errorFields: "Please enter your name and a valid email.",
    errorSlot: "Pick an available time.",
    errorGeneric: "We couldn't start the payment.",
    redirecting: "Redirecting to payment...",
    noSlotsBefore: "No times are open right now — write to me at",
    noSlotsAfter: "and we'll arrange something.",
    altPaymentBefore: "Can't pay by card? Write to",
    altPaymentAfter: "to arrange Zelle, PayPal or Pago Móvil (Venezuela only).",
    thanksEyebrow: "Payment confirmed",
    thanksTitle: "Thank you!",
    thanksSession: "Your session is booked. You'll get a confirmation email with the video call link.",
    thanksPack: "Your 4-session package is confirmed, along with your month of the community. I'll email you in the next few days to schedule your times.",
    canceled: "The payment was canceled. You can pick a time and try again whenever you like.",
  },

  mentoring: {
    meta: {
      title: "NEXT YOU Mentoring — Carla Montaño",
      description: "Personalized 1:1 sessions to work on your next concrete step across the NEXT YOU™ pillars.",
    },
    eyebrow: "NEXT YOU Mentoring · 1:1",
    heroLine1: "You don't need another course.",
    heroBefore: "You need a ",
    heroEmphasis: "clear plan",
    heroAfter: " and someone to walk it with you.",
    lead: "Personalized 1:1 sessions where we work on your next concrete step — mindset, direction, technology, employability or any of the NEXT YOU™ pillars. No generic advice, no endless resource lists: a plan made for your real situation.",
    ctaBook: "Book your session →",
    ctaFaq: "Read the FAQ",
    badges: ["Online sessions · 60 minutes", "Limited spots every week", "100% tailored to your priority pillar"],
    signsEyebrow: "Is it for you?",
    signsTitle: "Three signs you need this mentoring",
    signs: [
      { title: "You're moving forward alone", body: "And you can't tell whether what you're doing really brings you closer to your next version or just keeps you busy." },
      { title: "You have too much information", body: "Courses, videos, advice from everywhere — and no real clarity about your next concrete step." },
      { title: "You've started, but you're stuck", body: "You know which pillar is holding you back (mindset, direction, employability...) but can't move it on your own." },
    ] as Card[],
    areasEyebrow: "What do we work on together?",
    areasTitle: "A plan made for your priority pillar",
    areasLead: "Every session starts from where you really are — not from a generic syllabus. These are the areas where I support my mentees most:",
    areas: [
      { title: "Mindset and limiting beliefs", body: "Identify the story you keep telling yourself that holds you back." },
      { title: "Direction and next project", body: "Define a clear roadmap, not an endless list of options." },
      { title: "Applied technology and AI", body: "Use AI and current tools to learn and move faster." },
      { title: "Employability", body: "Resume, LinkedIn, portfolio and real interview preparation." },
      { title: "Technical review", body: "Code, projects and good practices, if your path is technology." },
      { title: "Productivity", body: "How to sustain change without sacrificing work, family and rest." },
      { title: "Organizing your learning", body: "What to study first, what to leave for later, and why." },
      { title: "Next step in the community", body: "How to complement mentoring with ongoing support." },
    ] as Card[],
    howEyebrow: "How it works",
    howTitle: "Three steps, no complications",
    how: [
      { title: "Book your session", body: "Pick the day and time that suit you. Automatic confirmation by email." },
      { title: "We meet", body: "We talk about your real situation, identify your priority pillar and answer your concrete questions." },
      { title: "You leave with a plan", body: "Clear, practical and focused on your next step — not an endless to-do list." },
    ] as Card[],
    idealEyebrow: "Ideal for you if...",
    idealTitle: "You recognize one of these situations",
    ideal: [
      { title: "You want to change careers", body: "And you need a realistic plan, not just motivation to try again." },
      { title: "You want to land your next job", body: "In technology or any field where your profile isn't showing as well as it could." },
      { title: "You want to use technology and AI in your favor", body: "Without having to become a programmer if that isn't your path." },
      { title: "You want to organize your restart, not just your learning", body: "Because the disorder isn't only in information — it's in time, energy and direction." },
    ] as Card[],
    agendaEyebrow: "Book your session",
    agendaTitle: "Choose your plan and take your next step",
    agendaBullets: ["Online sessions by video call", "60 minutes, 100% personalized", "Close, practical attention", "Limited spots every week"],
    faqEyebrow: "Frequently asked questions",
    faqTitle: "Before you book",
    faq: [
      { title: "Do I need to know how to code to book a session?", body: "No. The mentoring covers the NEXT YOU™ pillars, not just technology. Many people arrive not knowing where to start, in any area of their professional restart." },
      { title: "Is the session recorded?", body: "Yes, if you'd like. That way you can review it later at your own pace, without worrying about taking notes during the conversation." },
      { title: "What tools do we work with?", body: "It depends on your pillar and goals: it might be VS Code, GitHub, generative AI, LinkedIn, or organization and productivity tools. The session adapts entirely to you." },
      { title: "How long is a session?", body: "About 60 minutes — enough time to answer questions, review your current situation and leave with a clear plan." },
      { title: "Can I reschedule if I can't attend?", body: "Yes, with notice — write to hello@carlamontano.io." },
      { title: "How is this different from the NEXT YOU community?", body: "The community is your day-to-day space for support and belonging, at a lower cost. Mentoring is a more structured, personalized transformation with direct follow-up with me." },
      { title: "What makes this mentoring different?", body: "I don't hand you an endless list of courses. Together we identify your priority pillar, answer your real questions and you leave with an action plan — using the same method I used to restart many times." },
    ] as Card[],
    finalEyebrow: "You don't have to do it alone",
    finalTitle: "Book your session and let's start building your next step.",
    finalNote: "Limited spots every week.",
    finalCta: "Book your 1:1 session →",
  },

  newsletter: {
    title: "Get new resources by email",
    body: "Occasional, practical emails. Unsubscribe anytime.",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    button: "Subscribe",
    sending: "Sending...",
    success: "You're in. Check your inbox.",
    error: "Couldn't subscribe. Please try again.",
  },

  legal: {
    updated: "Last updated: October 15, 2026",
    eyebrow: "Legal",
    privacy: {
      title: "Privacy Policy",
      description: "What information we collect on carlamontano.io, how we use it and your rights.",
      intro:
        "This website (carlamontano.io) is operated by Carla Montaño (“we”, “us”). This policy explains what information we collect, how we use it and what rights you have.",
      sections: [
        {
          title: "Information we collect",
          bullets: [
            "Contact information: when you subscribe to the newsletter, fill in the contact form, take the diagnostic or buy a product, we collect your name and email.",
            "Payment information: payments are processed by Stripe. We never store your card details.",
            "Usage information: we use Google Analytics to understand how the site is used (pages visited, time on site, approximate location). It is aggregated and does not identify you personally.",
            "Community: if you join the NEXT YOU community, your membership and activity are also governed by the privacy policy of Skool, the platform that hosts it.",
          ],
        },
        {
          title: "How we use your information",
          bullets: [
            "To deliver what you asked for: your purchase, your session, a reply to your message.",
            "To send newsletters if you subscribed — you can unsubscribe with one click from any email.",
            "To improve the site and our content based on what is useful.",
            "We never sell your information.",
          ],
        },
        {
          title: "Who we share it with",
          paragraphs: ["We use the following providers to operate the site. Each receives only what it needs for its function:"],
          bullets: [
            "Stripe — payment processing.",
            "Resend — email delivery.",
            "Google Analytics — site analytics.",
            "Netlify — hosting.",
            "Supabase — secure database storage.",
            "Skool — the NEXT YOU community platform, if you join.",
          ],
        },
        {
          title: "How long we keep it",
          paragraphs: ["We keep your information while you have an active relationship with us (subscriber, customer, community member) or until you ask us to delete it."],
        },
        {
          title: "Your rights",
          bullets: [
            "Ask for a copy of the information we hold about you.",
            "Ask us to correct inaccurate information.",
            "Ask us to delete your information, within what the law and our accounting obligations allow.",
            "Unsubscribe from the newsletter at any time.",
          ],
          paragraphs: ["To exercise any of these, write to hello@carlamontano.io."],
        },
        {
          title: "Cookies",
          paragraphs: ["This site uses Google Analytics cookies to understand usage. You can block or delete cookies in your browser settings. We also store a cookie to remember your language choice."],
        },
        { title: "Children", paragraphs: ["This site is not directed at people under 18, and we do not knowingly collect their information."] },
        { title: "Changes to this policy", paragraphs: ["We may update this policy from time to time. The “last updated” date above shows the latest version."] },
        { title: "Contact", paragraphs: ["Questions about this policy? Write to hello@carlamontano.io."] },
      ] as LegalSection[],
    },
    terms: {
      title: "Terms & Conditions",
      description: "The terms that govern the use of carlamontano.io and the purchase of our products and services.",
      intro: "By using this website (carlamontano.io) or buying any of our products or services, you agree to these terms.",
      sections: [
        {
          title: "Who we are",
          paragraphs: ["This site is operated by Carla Montaño. Contact: hello@carlamontano.io. Implementation and agency services are delivered by Montano Systems (a working brand of In Motion Web Solutions LLC) under their own agreements."],
        },
        {
          title: "What we offer",
          bullets: [
            "Free educational content (articles, tutorials, resources).",
            "Digital products: guides, workbooks, templates and tools.",
            "Consulting sessions, mentoring, workshops and speaking.",
            "The NEXT YOU community, hosted on Skool.",
          ],
        },
        {
          title: "Digital products",
          bullets: [
            "After buying, you receive a download link by email and on the confirmation page.",
            "The link is personal — please don't share or resell it.",
            "Because of the nature of digital products, we don't offer refunds once the download link has been delivered, unless the law requires otherwise. If something goes wrong (damaged file, email didn't arrive), write to hello@carlamontano.io and we'll fix it.",
            "Website templates are provided “as is” and don't include installation support unless stated in the product description.",
          ],
        },
        {
          title: "Sessions, mentoring and workshops",
          bullets: [
            "Sessions are scheduled according to the availability shown on the site or agreed by email.",
            "To cancel or reschedule, give us at least 24 hours' notice at hello@carlamontano.io.",
            "Session packages must be used within 3 months of purchase.",
            "Tech SOS and 1:1 sessions are advisory and scope-limited; they don't include implementation work.",
          ],
        },
        {
          title: "NEXT YOU community",
          bullets: [
            "Access to the community is managed through Skool and is also subject to Skool's terms.",
            "You can cancel your membership at any time from your Skool account.",
          ],
        },
        {
          title: "Intellectual property",
          paragraphs: ["All content on this site — text, scripts, graphics, the NEXT YOU method and digital products — belongs to Carla Montaño. You may not copy, redistribute or resell it without written permission, except website templates, which are meant to be adapted as the base of your own site."],
        },
        {
          title: "Not professional advice",
          paragraphs: ["Content, sessions and the community are educational and supportive. They do not replace legal, immigration, financial, psychological or medical advice. Results depend on each person's effort and circumstances, and we don't guarantee specific outcomes."],
        },
        {
          title: "Limitation of liability",
          paragraphs: ["We provide the site and our services in good faith, but we are not liable for indirect damages arising from their use, to the extent permitted by law."],
        },
        { title: "Changes to these terms", paragraphs: ["We may update these terms from time to time. The “last updated” date above shows the latest version."] },
        { title: "Governing law", paragraphs: ["These terms are governed by the laws applicable in the jurisdiction where this business operates."] },
        { title: "Contact", paragraphs: ["Questions about these terms? Write to hello@carlamontano.io."] },
      ] as LegalSection[],
    },
  },
};

export type Dictionary = typeof en;
