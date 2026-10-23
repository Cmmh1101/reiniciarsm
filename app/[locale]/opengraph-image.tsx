import { brandOgImage, OG_SIZE } from "@/lib/ogImage";
import { isLocale, DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";

export const alt = "Carla Montaño — Technology & Solutions Consultant";
export const size = OG_SIZE;
export const contentType = "image/png";

// Rendered once per language at build time, where the font and picture files are on disk; reading them while
// the site is running fails on the host, which does not ship those files with its functions.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: { locale: string } }) {
  return brandOgImage(isLocale(params.locale) ? params.locale : DEFAULT_LOCALE);
}
