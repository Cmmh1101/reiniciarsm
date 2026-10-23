import type { Metadata } from "next";
import { LOCALES, type Locale } from "./config";
import { localizedPath, type RouteKey } from "./routes";

const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_ES" };

interface PageMetadataInput {
  locale: Locale;
  route: RouteKey;
  params?: Record<string, string>;
  title: string;
  description: string;
  // Locales that actually have this page. Defaults to all; pass fewer when a page exists in one language only.
  availableIn?: readonly Locale[];
  type?: "website" | "article";
  // A page's own picture (a post's featured image, a product's cover). Defaults to the brand card.
  image?: string | null;
}

/** The brand card rendered by app/[locale]/opengraph-image.tsx, in the page's language. */
export function socialImages(locale: Locale, title: string, image?: string | null) {
  return image
    ? [{ url: image, alt: title }]
    : [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: title }];
}

/** Title, description, canonical, hreflang alternates and social preview for one page. */
export function pageMetadata({ locale, route, params, title, description, availableIn = LOCALES, type = "website", image }: PageMetadataInput): Metadata {
  const canonical = localizedPath(locale, route, params);
  const languages: Record<string, string> = {};
  for (const l of availableIn) languages[l] = localizedPath(l, route, params);
  if (availableIn.includes("en")) languages["x-default"] = localizedPath("en", route, params);

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: { title, description, url: canonical, locale: OG_LOCALE[locale], type, siteName: "Carla Montaño", images: socialImages(locale, title, image) },
    twitter: { card: "summary_large_image", title, description, images: socialImages(locale, title, image).map((i) => i.url) },
  };
}
