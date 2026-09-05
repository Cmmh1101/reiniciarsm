import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import type { BlogPost } from "@/lib/posts";

async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("admin getAllPosts failed", error);
    return [];
  }
  return (data ?? []) as BlogPost[];
}

export default async function AdminBlogListPage() {
  const posts = await getAllPosts();

  return (
    <main className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay text-white"
        >
          + Nuevo post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="opacity-60">Todavía no hay posts.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Título</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Pilar</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Estado</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-[rgba(20,25,43,0.08)]">
                <td className="py-3">
                  <Link href={`/admin/blog/${post.id}/edit`} className="hover:underline">
                    {post.title}
                  </Link>
                </td>
                <td className="py-3 opacity-70">{post.pillar}</td>
                <td className="py-3">
                  {post.published_at ? (
                    <span className="text-sage">Publicado</span>
                  ) : (
                    <span className="opacity-50">Borrador</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
