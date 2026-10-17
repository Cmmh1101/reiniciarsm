import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocalizedPosts } from "@/lib/posts";
import { pillarLabel } from "@/lib/taxonomy";
import NewsletterForm from "@/components/NewsletterForm";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localizedPath } from "@/lib/i18n/routes";

// Posts publish through the admin CMS at runtime — fetch fresh every request.
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { resources } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "resources", title: resources.meta.title, description: resources.meta.description });
}

export default async function ResourcesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { resources, newsletter } = getDictionary(locale);
  // Every article is shown in the visitor's language, or in the other one if that is the only version written.
  const posts = await getLocalizedPosts(locale);

  return (
    <main>
      <header className="hero-dark bg-ink text-paper px-page pt-20 pb-14">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">{resources.eyebrow}</p>
        <h1 className="font-display text-[clamp(32px,4.4vw,52px)] leading-[1.08] mb-4 max-w-[20ch]">{resources.title}</h1>
        <p className="opacity-75 max-w-[56ch] text-base">{resources.lead}</p>
      </header>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-7 px-page py-16">
          {posts.map((post) => (
            <Link key={post.id} href={localizedPath(locale, "resourcePost", { slug: post.slug })} className="flex flex-col gap-3.5">
              {post.featured_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.featured_image_url} alt="" className="w-full aspect-[4/3] rounded-[2px] object-cover" />
              ) : (
                <div className="aspect-[4/3] rounded-[2px] bg-gradient-to-br from-[#8a7458] to-[#3a4562]" />
              )}
              <span className="font-mono text-[10px] tracking-wide uppercase text-clay">
                {pillarLabel(post.pillar, locale)}
                {post.shown !== locale && <span className="opacity-70"> · {post.shown.toUpperCase()}</span>}
              </span>
              <h3 className="text-[19px] leading-snug font-display" lang={post.shown}>{post.title}</h3>
              {post.excerpt && <p className="text-[13.5px] opacity-65" lang={post.shown}>{post.excerpt}</p>}
              <span className="font-mono text-[10.5px] opacity-45 mt-auto">
                {post.published_at && new Date(post.published_at).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
                {post.reading_time_minutes ? ` · ${post.reading_time_minutes} ${resources.readingTime}` : ""}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="opacity-60 px-page py-16">{resources.empty}</p>
      )}

      <section className="bg-paper-soft px-page py-[70px]">
        <div className="max-w-[560px]">
          <h2 className="font-display text-[clamp(24px,3vw,34px)] mb-3.5">{newsletter.title}</h2>
          <p className="opacity-70 mb-7">{newsletter.body}</p>
          <NewsletterForm locale={locale} copy={newsletter} withName={false} />
        </div>
      </section>
    </main>
  );
}
