import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPostBySlug, getPostsByLocale, getTranslation, postLocale } from "@/lib/posts";
import { pillarLabel } from "@/lib/taxonomy";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizedPath } from "@/lib/i18n/routes";

// Posts (and edits to them) publish through the admin CMS at runtime — fetch fresh every request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  // The canonical page is always the one in the article's own language; a linked translation
  // is advertised as its hreflang alternate.
  const own = postLocale(post);
  const otherLocale: Locale = own === "en" ? "es" : "en";
  const translation = await getTranslation(post, otherLocale);
  const ownUrl = localizedPath(own, "resourcePost", { slug: post.slug });
  const languages: Record<string, string> = { [own]: ownUrl };
  if (translation) languages[otherLocale] = localizedPath(otherLocale, "resourcePost", { slug: translation.slug });
  languages["x-default"] = languages.en ?? ownUrl;

  const title = `${post.title} — Carla Montaño`;
  const description = post.excerpt ?? getDictionary(own).resources.meta.description;
  return {
    title,
    description,
    alternates: { canonical: ownUrl, languages },
    openGraph: { title, description, url: ownUrl, locale: own === "es" ? "es_ES" : "en_US", type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ResourcePostPage({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { resources, common, home } = getDictionary(locale);

  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  // Arrived (e.g. through the language switcher) on an article written in the other language:
  // if it has a translation in this language, go there instead.
  if (postLocale(post) !== locale) {
    const translation = await getTranslation(post, locale);
    if (translation) redirect(localizedPath(locale, "resourcePost", { slug: translation.slug }));
  }
  const inOtherLanguage = postLocale(post) !== locale;

  const { native, other } = await getPostsByLocale(locale);
  const related = [...native, ...other].filter((p) => p.id !== post.id).slice(0, 3);

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
          <span className="font-mono text-[10.5px] uppercase text-clay-soft border border-[rgba(237,230,216,0.14)] px-3 py-1.5 rounded-full">{pillarLabel(post.pillar, postLocale(post))}</span>
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

      <article lang={postLocale(post)} className="max-w-[680px] mx-auto px-[8vw] py-[70px] prose-post" dangerouslySetInnerHTML={{ __html: post.content }} />

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
              <Link key={r.id} href={localizedPath(postLocale(r), "resourcePost", { slug: r.slug })} className="flex flex-col gap-2.5">
                {r.featured_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.featured_image_url} alt="" className="w-full aspect-[4/3] rounded-[2px] object-cover" />
                ) : (
                  <div className="aspect-[4/3] rounded-[2px] bg-gradient-to-br from-[#6E7F5C] to-[#2f3a26]" />
                )}
                <span className="font-mono text-[10px] uppercase text-clay">{pillarLabel(r.pillar, postLocale(r))}</span>
                <h4 className="text-base leading-snug">{r.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
