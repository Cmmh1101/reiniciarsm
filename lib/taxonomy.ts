// Blog taxonomy. A post has ONE category (closed list, so the public label and any category page stay
// consistent) and any number of free-form tags (for filtering, and for pages that show only some
// articles — e.g. a schools landing listing posts tagged "schools").
//
// The category is stored in the blog_posts.pillar column. Posts saved before the categories existed
// hold one of the old Spanish pillar names; categoryKey() maps those, so nothing needs migrating.

export interface BlogCategory {
  key: string;
  es: string;
  en: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { key: "tecnologia-ia", es: "Tecnología e IA", en: "Technology & AI" },
  { key: "sistemas-herramientas", es: "Sistemas y herramientas", en: "Systems & tools" },
  { key: "escuelas-educacion", es: "Escuelas y educación", en: "Schools & education" },
  { key: "organizaciones", es: "Organizaciones y equipos", en: "Organizations & teams" },
  { key: "carrera", es: "Carrera y empleabilidad", en: "Career & employability" },
  { key: "ingles-profesional", es: "Inglés profesional", en: "Professional English" },
  { key: "productividad-bienestar", es: "Productividad y bienestar", en: "Productivity & wellbeing" },
  { key: "comunidad", es: "Comunidad NEXT YOU", en: "NEXT YOU community" },
  { key: "mi-historia", es: "Mi historia", en: "My story" },
];

const LEGACY_PILLAR_CATEGORY: Record<string, string> = {
  Mentalidad: "carrera",
  "Dirección": "carrera",
  "Tecnología e IA": "tecnologia-ia",
  Empleabilidad: "carrera",
  "Inglés profesional": "ingles-profesional",
  Productividad: "productividad-bienestar",
  Bienestar: "productividad-bienestar",
  Comunidad: "comunidad",
};

/** The category key for whatever is stored in the post (a current key or an old Spanish pillar name). */
export function categoryKey(stored: string): string {
  if (BLOG_CATEGORIES.some((c) => c.key === stored)) return stored;
  return LEGACY_PILLAR_CATEGORY[stored] ?? stored;
}

export function categoryLabel(stored: string, locale: "en" | "es"): string {
  const key = categoryKey(stored);
  const category = BLOG_CATEGORIES.find((c) => c.key === key);
  return category ? category[locale] : stored;
}

/** Tags that mark who an article is for — the quick picks in the editor, and what audience pages filter on. */
export const AUDIENCE_TAGS = ["individuals", "schools", "organizations"] as const;

export const MAX_TAGS = 12;

/** Lowercase, accent-free, hyphenated — "Escuelas Públicas" and "escuelas-publicas" are the same tag. */
export function normalizeTag(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

// Fixed product categories (digital products, Fase 5+) — same closed-dropdown reasoning as
// above: keeps values consistent for the public /productos category filter.
export const PRODUCT_CATEGORIES = ["Ebook", "Plantilla", "Guía", "Curso", "Otro"] as const;

// English display labels for the (Spanish-valued) product categories — products always store the Spanish value.
export const PRODUCT_CATEGORY_LABEL_EN: Record<string, string> = {
  Ebook: "Ebook",
  Plantilla: "Template",
  "Guía": "Guide",
  Curso: "Course",
  Otro: "Other",
};

export function productCategoryLabel(category: string, locale: "en" | "es"): string {
  return locale === "en" ? PRODUCT_CATEGORY_LABEL_EN[category] ?? category : category;
}
