import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";

// New posts publish through the admin CMS at runtime — fetch fresh every request, same reason
// Home/Blog/Mentorías need this (see app/(site)/blog/page.tsx).
export const dynamic = "force-dynamic";

const STATIC_ROUTES = ["", "/blog", "/mentorias", "/diagnostico-next-you", "/comunidad", "/mi-historia", "/contacto"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carlamontano.io";
  const posts = await getPublishedPosts();

  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const postEntries = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
  }));

  return [...staticEntries, ...postEntries];
}
