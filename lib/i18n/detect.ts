import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

const SPANISH_SPEAKING_COUNTRIES = new Set([
  "AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "SV", "GQ", "GT", "HN", "MX", "NI", "PA", "PY", "PE", "PR", "ES", "UY", "VE",
]);

// Picks the first of en/es the browser prefers, honouring q-values. Returns null if neither is listed.
function fromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = Number(params.find((p) => p.trim().startsWith("q="))?.split("=")[1] ?? 1);
      return { lang: tag.toLowerCase().split("-")[0], q: Number.isNaN(q) ? 0 : q, index };
    })
    .filter((entry) => entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  for (const entry of ranked) {
    if (isLocale(entry.lang)) return entry.lang;
  }
  return null;
}

/** Saved choice first, then the browser's language, then the visitor's country, then English. */
export function detectLocale(input: { cookie?: string | null; acceptLanguage?: string | null; country?: string | null }): Locale {
  if (isLocale(input.cookie)) return input.cookie;
  const fromBrowser = fromAcceptLanguage(input.acceptLanguage);
  if (fromBrowser) return fromBrowser;
  if (input.country && SPANISH_SPEAKING_COUNTRIES.has(input.country.toUpperCase())) return "es";
  return DEFAULT_LOCALE;
}
