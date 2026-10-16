import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByLocale, postLocale, type BlogPost } from "@/lib/posts";
import { pillarLabel } from "@/lib/taxonomy";
import NewsletterForm from "@/components/NewsletterForm";
import { isLocale, type Locale } from "@/lib/i18n/config";
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

function PostGrid({ posts, locale }: { posts: BlogPost[]; locale: Locale }) {
  const { resources } = getDictionary(locale);
  return (
    <div className="grid md:grid-cols-3 gap-7">
      {posts.map((post) => {
        const pl = postLocale(post);
        return (
          // Each post links to its own language's URL, so the page language always matches the article.
          <Link key={post.id} href={localizedPath(pl, "resourcePost", { slug: post.slug })} className="flex flex-col gap-3.5">
            {post.featured_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.featured_image_url} alt="" className="w-full aspect-[4/3] rounded-[2px] object-cover" />
            ) : (
              <div className="aspect-[4/3] rounded-[2px] bg-gradient-to-br from-[#8a7458] to-[#3a4562]" />
            )}
            <span className="font-mono text-[10px] tracking-wide uppercase text-clay">{pillarLabel(post.pillar, pl)}</span>
            <h3 className="text-[19px] leading-snug font-display">{post.title}</h3>
            {post.excerpt && <p className="text-[13.5px] opacity-65">{post.excerpt}</p>}
            <span className="font-mono text-[10.5px] opacity-45 mt-auto">
              {post.published_at && new Date(post.published_at).toLocaleDateString(pl, { day: "numeric", month: "short", year: "numeric" })}
              {post.reading_time_minutes ? ` · ${post.reading_time_minutes} ${getDictionary(pl).resources.readingTime}` : ""}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default async function ResourcesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { resources, newsletter } = getDictionary(locale);
  const { native, other } = await getPostsByLocale(locale);

  return (
    <main>
      <header className="bg-ink text-paper px-[8vw] pt-20 pb-14">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">{resources.eyebrow}</p>
        <h1 className="font-display text-[clamp(32px,4.4vw,52px)] leading-[1.08] mb-4 max-w-[20ch]">{resources.title}</h1>
        <p className="opacity-75 max-w-[56ch] text-base">{resources.lead}</p>
      </header>

      {native.length > 0 && (
        <section className="px-[8vw] py-16">
          <PostGrid posts={native} locale={locale} />
        </section>
      )}

      {other.length > 0 && (
        <section className={`px-[8vw] ${native.length > 0 ? "pb-16" : "py-16"}`}>
          <h2 className="font-mono text-xs uppercase tracking-widest opacity-60 mb-6">{resources.otherLanguageTitle}</h2>
          <PostGrid posts={other} locale={locale} />
        </section>
      )}

      {native.length === 0 && other.length === 0 && <p className="opacity-60 px-[8vw] py-16">{resources.empty}</p>}

      <section className="bg-paper-soft px-[8vw] py-[70px]">
        <div className="max-w-[560px]">
          <h2 className="font-display text-[clamp(24px,3vw,34px)] mb-3.5">{newsletter.title}</h2>
          <p className="opacity-70 mb-7">{newsletter.body}</p>
          <NewsletterForm locale={locale} copy={newsletter} withName={false} />
        </div>
      </section>
    </main>
  );
}
