import { brandOgImage, OG_SIZE } from "@/lib/ogImage";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/config";

export const alt = "Carla Montaño — Technology & Solutions Consultant";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: { locale: string } }) {
  return brandOgImage(isLocale(params.locale) ? params.locale : DEFAULT_LOCALE);
}
