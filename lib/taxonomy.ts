// Fixed blog taxonomy (docs/CM-plan-admin-crm-analytics.md §2) — closed dropdowns,
// not free text, so pillar/phase values stay consistent across posts.

export const PILLARS = [
  "Mentalidad",
  "Dirección",
  "Tecnología e IA",
  "Empleabilidad",
  "Inglés profesional",
  "Productividad",
  "Bienestar",
  "Comunidad",
] as const;

// Literal strings match the options already used in Notion — keep them identical
// so both systems stay consistent. "No aplica" is a UI-only sentinel: it maps to
// a null arc_phase in the database (not every post is autobiographical), never
// stored as the literal string.
export const ARC_PHASES = [
  "01 Mundo ordinario",
  "02 Llamado forzado",
  "03 Travesía del umbral",
  "04 Método propio",
  "05 Prueba mayor",
  "06 Regreso transformado",
  "07 Elixir",
] as const;

export const ARC_PHASE_NOT_APPLICABLE = "No aplica";

// Fixed product categories (digital products, Fase 5+) — same closed-dropdown reasoning as
// above: keeps values consistent for the public /productos category filter.
export const PRODUCT_CATEGORIES = ["Ebook", "Plantilla", "Guía", "Curso", "Otro"] as const;
