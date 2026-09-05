import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

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
}

export async function getPublishedPosts(limit?: number): Promise<BlogPost[]> {
  const supabase = createSupabaseAdminClient();
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
  return (data ?? []) as BlogPost[];
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

/** Admin-only — unlike getPostBySlug, returns drafts too. */
export async function getPostById(id: string): Promise<BlogPost | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  if (error) return null;
  return data as BlogPost;
}
