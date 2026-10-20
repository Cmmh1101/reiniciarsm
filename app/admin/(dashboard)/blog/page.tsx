import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { availableLocales, type BlogPost } from "@/lib/posts";
import { getAdminDictionary } from "@/lib/admin/dictionary";
import { getAdminLocale } from "@/lib/admin/i18n";
import { pillarLabel } from "@/lib/taxonomy";

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
  const locale = getAdminLocale();
  const { blog: t } = getAdminDictionary(locale);

  return (
    <main className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl">{t.title}</h1>
        <Link
          href="/admin/blog/new"
          className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay-deep text-white"
        >
          {t.new}
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="opacity-70">{t.none}</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-70">{t.columns.title}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-70">{t.columns.languages}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-70">{t.columns.pillar}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-70">{t.columns.status}</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-[rgba(20,25,43,0.08)]">
                <td className="py-3">
                  <Link href={`/admin/blog/${post.id}/edit`} className="hover:underline">
                    {post.title || post.title_en}
                  </Link>
                </td>
                <td className="py-3 font-mono text-xs opacity-70">{availableLocales(post).length ? [...availableLocales(post)].reverse().map((l) => l.toUpperCase()).join(" · ") : "—"}</td>
                <td className="py-3 opacity-70">{pillarLabel(post.pillar, locale)}</td>
                <td className="py-3">
                  {post.published_at ? (
                    <span className="text-sage-deep">{t.published}</span>
                  ) : (
                    <span className="opacity-70">{t.draft}</span>
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
