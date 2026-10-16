import PostEditor from "@/components/admin/PostEditor";
import { postLocale } from "@/lib/posts";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export default async function NewPostPage() {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  const candidates = (data ?? []).map((p) => ({ id: p.id as string, title: p.title as string, locale: postLocale(p) }));
  return <PostEditor candidates={candidates} />;
}
