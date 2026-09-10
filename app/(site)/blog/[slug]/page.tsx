import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";

// Posts (and edits to them) publish through the admin CMS at runtime — fetch fresh every request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  const title = `${post.title} — Carla Montaño`;
  const description = post.excerpt ?? undefined;
  return {
    title,
    description,
    openGraph: { title, description, url: `/blog/${post.slug}`, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const related = (await getPublishedPosts())
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <main>
      <header className="bg-ink text-paper px-[8vw] pt-[70px] pb-[50px]">
        <Link
          href="/blog"
          className="font-mono text-[11px] uppercase tracking-wide opacity-50 no-underline inline-flex items-center gap-1.5 mb-7"
        >
          ← Ir a todos los posts
        </Link>
        <div className="flex gap-2.5 mb-5 flex-wrap">
          <span className="font-mono text-[10.5px] uppercase text-clay-soft border border-[rgba(237,230,216,0.14)] px-3 py-1.5 rounded-full">
            {post.pillar}
          </span>
          {post.arc_phase && (
            <span className="font-mono text-[10.5px] uppercase text-clay-soft border border-[rgba(237,230,216,0.14)] px-3 py-1.5 rounded-full">
              {post.arc_phase}
            </span>
          )}
        </div>
        <h1 className="font-display text-[clamp(28px,4.4vw,46px)] max-w-[22ch] mb-4 leading-[1.1]">
          {post.title}
        </h1>
        {post.excerpt && <p className="opacity-70 text-[17px] max-w-[60ch]">{post.excerpt}</p>}
        <div className="flex gap-4 items-center mt-7 font-mono text-xs opacity-55 flex-wrap">
          <span>Por Carla Montaño</span>
          <span>·</span>
          {post.published_at && (
            <span>
              {new Date(post.published_at).toLocaleDateString("es", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
          {post.reading_time_minutes && (
            <>
              <span>·</span>
              <span>{post.reading_time_minutes} min de lectura</span>
            </>
          )}
        </div>
      </header>

      {post.featured_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.featured_image_url} alt="" className="w-full aspect-[16/7] object-cover" />
      ) : (
        <div className="aspect-[16/7] bg-gradient-to-br from-[#8a7458] to-[#3a4562]" />
      )}

      <article
        className="max-w-[680px] mx-auto px-[8vw] py-[70px] prose-post"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <section className="bg-clay text-paper text-center px-[8vw] py-[70px]">
        <p className="font-mono text-xs uppercase tracking-widest text-ink opacity-70 mb-5 flex justify-center">
          Tu próxima versión te espera
        </p>
        <h2 className="font-display text-[clamp(24px,3.4vw,38px)] mb-5 max-w-[20ch] mx-auto">
          No necesitas tener todo resuelto para dar tu siguiente paso.
        </h2>
        <Link
          href="/diagnostico-next-you"
          className="font-mono text-xs tracking-wide uppercase px-[26px] py-3.5 rounded-[2px] bg-ink text-paper inline-flex items-center gap-2"
        >
          Haz el Diagnóstico Next You →
        </Link>
      </section>

      {related.length > 0 && (
        <section className="bg-paper-soft px-[8vw] py-[70px]">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-3">Sigue leyendo</p>
          <h2 className="font-display text-2xl mb-8">Más historias</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="flex flex-col gap-2.5">
                {r.featured_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.featured_image_url} alt="" className="w-full aspect-[4/3] rounded-[2px] object-cover" />
                ) : (
                  <div className="aspect-[4/3] rounded-[2px] bg-gradient-to-br from-[#6E7F5C] to-[#2f3a26]" />
                )}
                <span className="font-mono text-[10px] uppercase text-clay">{r.pillar}</span>
                <h4 className="text-base leading-snug">{r.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
