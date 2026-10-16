import type { MetadataRoute } from "next";
import { getPublishedPosts, postLocale } from "@/lib/posts";
import { getActiveProducts } from "@/lib/products";
import { LOCALES } from "@/lib/i18n/config";
import { localizedPath, type RouteKey } from "@/lib/i18n/routes";

// Posts and products publish at runtime — fetch fresh every request.
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carlamontano.io";

// Pages that exist in both languages.
const BILINGUAL_ROUTES: RouteKey[] = ["home", "about", "workWithMe", "mentoring", "work", "ventures", "nextYou", "nextYouStory", "diagnostic", "shop", "resources", "contact", "privacy", "terms"];

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

  // Each article is listed at its own language's URL, with its linked translation as the hreflang alternate.
  for (const post of posts) {
    const own = postLocale(post);
    const translation = post.translation_group ? posts.find((p) => p.id !== post.id && p.translation_group === post.translation_group) : undefined;
    const languages: Record<string, string> = { [own]: abs(localizedPath(own, "resourcePost", { slug: post.slug })) };
    if (translation) languages[postLocale(translation)] = abs(localizedPath(postLocale(translation), "resourcePost", { slug: translation.slug }));
    entries.push({
      url: languages[own],
      lastModified: post.published_at ? new Date(post.published_at) : now,
      ...(translation ? { alternates: { languages } } : {}),
    });
  }

  return entries;
}
