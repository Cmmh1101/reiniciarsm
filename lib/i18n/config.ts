export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

// English first; Spanish is chosen automatically when the visitor's browser language or country says so.
export const DEFAULT_LOCALE: Locale = "en";

// Set when a visitor uses the language switcher, so their choice beats auto-detection on later visits.
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
