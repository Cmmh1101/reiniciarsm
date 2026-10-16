// Shared by the admin create/update routes: reads the Spanish and English versions of a post from the request body.
export interface PostLanguage {
  title: string;
  excerpt: string;
  content: string;
}

export function readLanguages(body: Record<string, unknown>): { es: PostLanguage; en: PostLanguage } {
  const s = (v: unknown) => (typeof v === "string" ? v : "");
  const clean = (c: string) => (!c.trim() || c.trim() === "<p></p>" ? "" : c);
  return {
    es: { title: s(body.title_es).trim(), excerpt: s(body.excerpt_es).trim(), content: clean(s(body.content_es)) },
    en: { title: s(body.title_en).trim(), excerpt: s(body.excerpt_en).trim(), content: clean(s(body.content_en)) },
  };
}

/** A language counts as written once it has both a title and content. */
export function hasLanguage(l: PostLanguage): boolean {
  return !!l.title && !!l.content;
}
