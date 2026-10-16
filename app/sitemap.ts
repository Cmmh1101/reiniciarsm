import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { getActiveProducts } from "@/lib/products";
import { LOCALES } from "@/lib/i18n/config";
import { localizedPath, type RouteKey } from "@/lib/i18n/routes";

// Posts and products publish at runtime — fetch fresh every request.
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carlamontano.io";

// Pages that exist in both languages.
const BILINGUAL_ROUTES: RouteKey[] = ["home", "about", "workWithMe", "work", "ventures", "nextYou", "shop", "resources", "contact", "privacy", "terms"];
// Pages that are Spanish-only for now (listed under their Spanish URL only).
const SPANISH_ONLY_ROUTES: RouteKey[] = ["mentoring", "diagnostic", "nextYouStory"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, products] = await Promise.all([getPublishedPosts(), getActiveProducts()]);
  const now = new Date();
  const abs = (path: string) => `${SITE_URL}${path}`;

  const entries: MetadataRoute.Sitemap = [];

  for (const route of BILINGUAL_ROUTES) {
    const languages = Object.fromEntries(LOCALES.map((l) => [l, abs(localizedPath(l, route))]));
    for (const locale of LOCALES) {
      entries.push({ url: abs(localizedPath(locale, route)), lastModified: now, alternates: { languages } });
    }
  }

  for (const route of SPANISH_ONLY_ROUTES) {
    entries.push({ url: abs(localizedPath("es", route)), lastModified: now });
  }

  // Products are shown in both languages (names are not translated yet).
  for (const p of products) {
    const languages = Object.fromEntries(LOCALES.map((l) => [l, abs(localizedPath(l, "shopProduct", { slug: p.slug }))]));
    for (const locale of LOCALES) {
      entries.push({ url: abs(localizedPath(locale, "shopProduct", { slug: p.slug })), lastModified: new Date(p.created_at), alternates: { languages } });
    }
  }

  // Posts are Spanish-only today.
  for (const post of posts) {
    entries.push({
      url: abs(localizedPath("es", "resourcePost", { slug: post.slug })),
      lastModified: post.published_at ? new Date(post.published_at) : now,
    });
  }

  return entries;
}
