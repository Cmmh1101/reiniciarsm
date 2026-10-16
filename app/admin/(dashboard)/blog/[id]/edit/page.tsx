import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { getPostById, postLocale, type BlogPost } from "@/lib/posts";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  if (!post) notFound();

  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from("blog_posts").select("*").neq("id", post.id).order("created_at", { ascending: false });
  const others = (data ?? []) as BlogPost[];
  const candidates = others.map((p) => ({ id: p.id, title: p.title, locale: postLocale(p) }));
  // The post this one is currently linked to as a translation (same group, other language).
  const linked = post.translation_group ? others.find((p) => p.translation_group === post.translation_group) : undefined;

  return <PostEditor post={post} candidates={candidates} linkedPostId={linked?.id ?? ""} />;
}
