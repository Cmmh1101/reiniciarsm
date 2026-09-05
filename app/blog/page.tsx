import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { NewsletterFormCompact } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Recursos — Carla Montaño",
  description: "Historias, guías y método para tu reinicio, organizados por pilar.",
};

export default async function BlogArchivePage() {
  const posts = await getPublishedPosts();

  return (
    <main>
      <header className="bg-ink text-paper px-[8vw] pt-20 pb-14">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">Recursos</p>
        <h1 className="font-display text-[clamp(32px,4.4vw,52px)] leading-[1.1] mb-4">
          Historias, guías y método para tu reinicio
        </h1>
        <p className="opacity-75 max-w-[56ch] text-base">
          Recursos organizados por pilar — no por fecha — para que encuentres justo lo que tu
          próxima versión necesita ahora mismo.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-7 px-[8vw] py-16">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="flex flex-col gap-3.5">
              <div className="aspect-[4/3] rounded-[2px] bg-gradient-to-br from-[#8a7458] to-[#3a4562]" />
              <span className="font-mono text-[10px] tracking-wide uppercase text-clay">{post.pillar}</span>
              <h3 className="text-[19px] leading-snug">{post.title}</h3>
              {post.excerpt && <p className="text-[13.5px] opacity-65">{post.excerpt}</p>}
              <span className="font-mono text-[10.5px] opacity-45 mt-auto">
                {post.published_at &&
                  new Date(post.published_at).toLocaleDateString("es", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                {post.reading_time_minutes ? ` · ${post.reading_time_minutes} min de lectura` : ""}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="opacity-60 px-[8vw] py-16">Los primeros posts están en camino.</p>
      )}

      <section className="bg-paper-soft text-center px-[8vw] py-[70px]">
        <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-3.5 flex justify-center">
          Newsletter
        </p>
        <h2 className="font-display text-[clamp(24px,3vw,34px)] mb-3.5">Un paso a la vez, cada semana</h2>
        <p className="opacity-70 mb-7">Recursos, historias y método directo a tu bandeja. Gratis, siempre.</p>
        <NewsletterFormCompact />
      </section>
    </main>
  );
}
