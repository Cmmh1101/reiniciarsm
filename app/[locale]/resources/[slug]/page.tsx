import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsletterForm from "@/components/NewsletterForm";
import { availableLocales, getLocalizedPosts, getPostBySlug, localizePost } from "@/lib/posts";
import { pillarLabel } from "@/lib/taxonomy";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizedPath } from "@/lib/i18n/routes";

// Posts (and edits to them) publish through the admin CMS at runtime — fetch fresh every request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const raw = await getPostBySlug(params.slug);
  if (!raw) return {};
  const post = localizePost(raw, params.locale);

  // Both languages share one slug. The canonical page is in the language that is actually shown, and
  // when the article exists in both, each language page points at the other as its hreflang alternate.
  const languages: Record<string, string> = {};
  for (const l of post.languages) languages[l] = localizedPath(l, "resourcePost", { slug: post.slug });
  languages["x-default"] = languages.en ?? languages[post.shown];
  const canonical = localizedPath(post.shown, "resourcePost", { slug: post.slug });

  const title = `${post.title} — Carla Montaño`;
  const description = post.excerpt ?? getDictionary(post.shown).resources.meta.description;
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: { title, description, url: canonical, locale: post.shown === "es" ? "es_ES" : "en_US", type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ResourcePostPage({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { resources, common, home, newsletter } = getDictionary(locale);

  const raw = await getPostBySlug(params.slug);
  if (!raw || availableLocales(raw).length === 0) notFound();
  const post = localizePost(raw, locale);
  const inOtherLanguage = post.shown !== locale;

  const related = (await getLocalizedPosts(locale)).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <main>
      <header className="bg-ink text-paper px-[8vw] pt-[70px] pb-[50px]">
        <Link
          href={localizedPath(locale, "resources")}
          className="font-mono text-[11px] uppercase tracking-wide opacity-50 no-underline inline-flex items-center gap-1.5 mb-7"
        >
          {common.backToResources}
        </Link>
        <div className="flex gap-2.5 mb-5 flex-wrap">
          <span className="font-mono text-[10.5px] uppercase text-clay-soft border border-[rgba(237,230,216,0.14)] px-3 py-1.5 rounded-full">{pillarLabel(post.pillar, locale)}</span>
        </div>
        <h1 className="font-display text-[clamp(28px,4.4vw,46px)] max-w-[22ch] mb-4 leading-[1.1]">{post.title}</h1>
        {post.excerpt && <p className="opacity-70 text-[17px] max-w-[60ch]">{post.excerpt}</p>}
        <div className="flex gap-4 items-center mt-7 font-mono text-xs opacity-55 flex-wrap">
          <span>{resources.byline}</span>
          {post.published_at && (
            <>
              <span>·</span>
              <span>{new Date(post.published_at).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}</span>
            </>
          )}
          {post.reading_time_minutes && (
            <>
              <span>·</span>
              <span>
                {post.reading_time_minutes} {resources.readingTime}
              </span>
            </>
          )}
        </div>
        {inOtherLanguage && <p className="font-mono text-[11px] opacity-55 mt-5">{resources.postOtherLanguage}</p>}
      </header>

      {post.featured_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.featured_image_url} alt="" className="w-full aspect-[16/7] object-cover" />
      ) : (
        <div className="aspect-[16/7] bg-gradient-to-br from-[#8a7458] to-[#3a4562]" />
      )}

      <article lang={post.shown} className="max-w-[680px] mx-auto px-[8vw] py-[70px] prose-post" dangerouslySetInnerHTML={{ __html: post.content }} />

      <section className="bg-paper-soft px-[8vw] py-[60px]">
        <div className="max-w-[560px] mx-auto">
          <h2 className="font-display text-[clamp(22px,2.8vw,30px)] mb-3">{newsletter.title}</h2>
          <p className="opacity-70 mb-6">{newsletter.body}</p>
          <NewsletterForm locale={locale} copy={newsletter} withName={false} />
        </div>
      </section>

      <section className="bg-clay text-paper text-center px-[8vw] py-[70px]">
        <h2 className="font-display text-[clamp(24px,3.4vw,38px)] mb-5 max-w-[20ch] mx-auto">{home.contact.title}</h2>
        <p className="opacity-90 mb-7 max-w-[48ch] mx-auto">{home.contact.body}</p>
        <Link
          href={localizedPath(locale, "workWithMe")}
          className="font-mono text-xs tracking-wide uppercase px-[26px] py-3.5 rounded-[2px] bg-ink text-paper inline-flex items-center gap-2"
        >
          {home.contact.ctaSecondary} →
        </Link>
      </section>

      {related.length > 0 && (
        <section className="bg-paper-soft px-[8vw] py-[70px]">
          <h2 className="font-display text-2xl mb-8">{resources.moreTitle}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link key={r.id} href={localizedPath(locale, "resourcePost", { slug: r.slug })} className="flex flex-col gap-2.5">
                {r.featured_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.featured_image_url} alt="" className="w-full aspect-[4/3] rounded-[2px] object-cover" />
                ) : (
                  <div className="aspect-[4/3] rounded-[2px] bg-gradient-to-br from-[#6E7F5C] to-[#2f3a26]" />
                )}
                <span className="font-mono text-[10px] uppercase text-clay">{pillarLabel(r.pillar, locale)}</span>
                <h4 className="text-base leading-snug" lang={r.shown}>{r.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
