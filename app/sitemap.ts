import type { MetadataRoute } from "next";
import { availableLocales, getPublishedPosts } from "@/lib/posts";
import { getActiveProducts } from "@/lib/products";
import { LOCALES } from "@/lib/i18n/config";
import { localizedPath, type RouteKey } from "@/lib/i18n/routes";

// Posts and products publish at runtime — fetch fresh every request.
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carlamontano.io";

// Pages that exist in both languages.
const BILINGUAL_ROUTES: RouteKey[] = ["home", "about", "workWithMe", "mentoring", "work", "ventures", "nextYou", "nextYouStory", "diagnostic", "nextStep", "schools", "shop", "resources", "contact", "privacy", "terms", "accessibility"];

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

  // Products are shown in both languages (names are not translated yet).
  for (const p of products) {
    const languages = Object.fromEntries(LOCALES.map((l) => [l, abs(localizedPath(l, "shopProduct", { slug: p.slug }))]));
    for (const locale of LOCALES) {
      entries.push({ url: abs(localizedPath(locale, "shopProduct", { slug: p.slug })), lastModified: new Date(p.created_at), alternates: { languages } });
    }
  }

  // Both languages share a slug. An article is listed once per language it is written in, and when it
  // exists in both, the two pages point at each other as hreflang alternates.
  for (const post of posts) {
    const langs = availableLocales(post);
    const languages = Object.fromEntries(langs.map((l) => [l, abs(localizedPath(l, "resourcePost", { slug: post.slug }))]));
    for (const l of langs) {
      entries.push({
        url: languages[l],
        lastModified: post.published_at ? new Date(post.published_at) : now,
        ...(langs.length > 1 ? { alternates: { languages } } : {}),
      });
    }
  }

  return entries;
}
