import { createSupabaseAdminClient, createSupabasePublicReadClient } from "@/lib/supabaseAdmin";
import type { Locale } from "@/lib/i18n/config";

// One row per article. title/excerpt/content hold the Spanish version (the original posts);
// the *_en columns (migration 0018) hold the English one. The slug is shared by both languages.
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
  title_en?: string | null;
  excerpt_en?: string | null;
  content_en?: string | null;
}

/** A post resolved to one language, with the language actually shown (it falls back when the other is empty). */
export interface LocalizedPost extends BlogPost {
  shown: Locale;
  languages: Locale[];
}

const filled = (s: string | null | undefined) => !!s && s.trim().length > 0 && s.trim() !== "<p></p>";

/** Languages the article actually has content in. */
export function availableLocales(post: BlogPost): Locale[] {
  const langs: Locale[] = [];
  if (filled(post.title_en) && filled(post.content_en)) langs.push("en");
  if (filled(post.title) && filled(post.content)) langs.push("es");
  return langs;
}

/** The article in `locale`, or in the other language when `locale` has no content. */
export function localizePost(post: BlogPost, locale: Locale): LocalizedPost {
  const languages = availableLocales(post);
  const shown: Locale = languages.includes(locale) ? locale : languages[0] ?? "es";
  if (shown === "en") {
    return { ...post, title: post.title_en ?? "", excerpt: post.excerpt_en ?? null, content: post.content_en ?? "", shown, languages };
  }
  return { ...post, shown, languages };
}

export async function getPublishedPosts(limit?: number): Promise<BlogPost[]> {
  const supabase = createSupabasePublicReadClient();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("getPublishedPosts failed", error);
    return [];
  }
  return ((data ?? []) as BlogPost[]).filter((p) => availableLocales(p).length > 0);
}

export async function getLocalizedPosts(locale: Locale, limit?: number): Promise<LocalizedPost[]> {
  return (await getPublishedPosts(limit)).map((p) => localizePost(p, locale));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createSupabasePublicReadClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .single();

  if (error) return null;
  return data as BlogPost;
}

/** Admin-only — unlike getPostBySlug, returns drafts too. */
export async function getPostById(id: string): Promise<BlogPost | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  if (error) return null;
  return data as BlogPost;
}
