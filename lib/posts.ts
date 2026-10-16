import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import type { Locale } from "@/lib/i18n/config";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  pillar: string;
  arc_phase: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  reading_time_minutes: number | null;
  // Added by migration 0018 — absent on a database that hasn't run it, where every post is Spanish.
  locale?: Locale;
  translation_group?: string | null;
}

export function postLocale(post: BlogPost): Locale {
  return post.locale === "en" ? "en" : "es";
}

async function fetchPublished(): Promise<BlogPost[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getPublishedPosts failed", error);
    return [];
  }
  return (data ?? []) as BlogPost[];
}

export async function getPublishedPosts(limit?: number): Promise<BlogPost[]> {
  const posts = await fetchPublished();
  return limit ? posts.slice(0, limit) : posts;
}

/** Published posts split into those written in `locale` and those written in the other language. */
export async function getPostsByLocale(locale: Locale): Promise<{ native: BlogPost[]; other: BlogPost[] }> {
  const posts = await fetchPublished();
  return {
    native: posts.filter((p) => postLocale(p) === locale),
    other: posts.filter((p) => postLocale(p) !== locale),
  };
}

/** Up to `limit` posts, preferring ones written in `locale` and filling with the other language if there are too few. */
export async function getPostsPreferLocale(locale: Locale, limit: number): Promise<BlogPost[]> {
  const { native, other } = await getPostsByLocale(locale);
  return [...native, ...other].slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .single();

  if (error) return null;
  return data as BlogPost;
}

/** The published translation of `post` in `locale`, if one has been linked in the admin. */
export async function getTranslation(post: BlogPost, locale: Locale): Promise<BlogPost | null> {
  if (!post.translation_group) return null;
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("translation_group", post.translation_group)
    .eq("locale", locale)
    .not("published_at", "is", null)
    .limit(1);
  return data && data.length > 0 ? (data[0] as BlogPost) : null;
}

/** Admin-only — unlike getPostBySlug, returns drafts too. */
export async function getPostById(id: string): Promise<BlogPost | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  if (error) return null;
  return data as BlogPost;
}
