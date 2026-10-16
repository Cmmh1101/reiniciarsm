// Admin panel copy in English and Spanish. Data only (no functions) so it can be passed to client
// components through the provider; use fmt() for placeholders like {n}.
import { en } from "./dictionaries/en";
import { es } from "./dictionaries/es";
import type { Locale } from "@/lib/i18n/config";

export type AdminDictionary = typeof en;

const DICTIONARIES: Record<Locale, AdminDictionary> = { en, es };

export function getAdminDictionary(locale: Locale): AdminDictionary {
  return DICTIONARIES[locale];
}

/** fmt("{n} open", { n: 3 }) -> "3 open" */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}
