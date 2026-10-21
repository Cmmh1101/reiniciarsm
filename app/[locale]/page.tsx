import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsletterForm from "@/components/NewsletterForm";
import { getLocalizedPosts } from "@/lib/posts";
import { pillarLabel, productCategoryLabel } from "@/lib/taxonomy";
import { getActiveProducts, localizeProduct } from "@/lib/products";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localizedPath } from "@/lib/i18n/routes";

// Served as static HTML and refreshed in the background (and instantly when the admin saves) — see CONTENT_CACHE_SECONDS.
export const revalidate = 60;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { home } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "home", title: home.meta.title, description: home.meta.description });
}

export default async function Home({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { home: h, site, common, nav, newsletter, about } = getDictionary(locale);

  const [posts, products] = await Promise.all([getLocalizedPosts(locale, 3), getActiveProducts()]);
  const featuredProducts = products.slice(0, 3).map((p) => localizeProduct(p, locale));

  return (
    <main>
      {/* HERO */}
      <header className="bg-ink text-paper px-page pt-20 pb-24 grid md:grid-cols-[1.2fr_0.8fr] gap-14 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-5">{h.hero.eyebrow}</p>
          <h1 className="font-display text-[clamp(38px,6vw,76px)] leading-[1.02] mb-6 max-w-[14ch]">{h.hero.title}</h1>
          <p className="text-lg opacity-85 max-w-[52ch] mb-3">{h.hero.lead}</p>
          <p className="font-mono text-[11.5px] tracking-wide opacity-70 mb-9">{site.supporting}</p>
          <div className="flex gap-4 flex-wrap">
            <Link href={localizedPath(locale, "workWithMe")} className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay-deep text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform">
              {h.hero.ctaPrimary} →
            </Link>
            <Link href={localizedPath(locale, "work")} className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] border border-current inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform">
              {h.hero.ctaSecondary}
            </Link>
          </div>
        </div>
        <div className="aspect-[4/5] rounded-[2px] overflow-hidden max-w-[420px] w-full md:justify-self-end">
          <Image src="/images/carla/hero-home.jpg" alt={h.hero.portraitAlt} width={768} height={1376} priority sizes="(min-width: 768px) 420px, 90vw" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* INTRO */}
      <section className="px-page py-24 grid md:grid-cols-[1.15fr_0.85fr] gap-14 items-start">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest opacity-70 mb-4">{h.intro.eyebrow}</p>
          <h2 className="font-display text-[clamp(28px,3.6vw,46px)] leading-[1.1] mb-5 max-w-[20ch]">{h.intro.title}</h2>
          <p className="text-base opacity-85 max-w-[58ch]">{h.intro.body}</p>
        </div>
        <aside className="md:border-l md:border-[rgba(20,25,43,0.15)] md:pl-12">
          <h3 className="font-mono text-xs uppercase tracking-widest opacity-70 mb-5">{about.todayTitle}</h3>
          <ul className="flex flex-col gap-4 text-[15px]">
            {about.today.map((item) => (
              <li key={item} className="border-l-2 border-clay pl-4 md:border-l-0 md:pl-0 md:before:content-['—'] md:before:text-clay-deep md:before:mr-3">
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* QUIZ */}
      <section className="bg-ink text-paper px-page py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-[58ch]">
          <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-3">{h.quiz.eyebrow}</p>
          <h2 className="font-display text-[clamp(24px,3vw,34px)] leading-[1.1] mb-3">{h.quiz.title}</h2>
          <p className="opacity-80 text-[15px]">{h.quiz.body}</p>
        </div>
        <Link href={localizedPath(locale, "nextStep")} className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay-deep text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform shrink-0 self-start md:self-auto">
          {h.quiz.cta} →
        </Link>
      </section>

      {/* HOW I CAN HELP */}
      <section className="bg-paper-soft px-page py-24">
        <div className="grid md:grid-cols-2 gap-6 md:gap-14 items-end mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-clay-deep mb-4">{h.help.eyebrow}</p>
            <h2 className="font-display text-[clamp(26px,3.2vw,40px)] leading-[1.12] max-w-[22ch]">{h.help.title}</h2>
          </div>
          <p className="text-[15px] opacity-85 max-w-[52ch] md:justify-self-end">
            {h.help.implementation}{" "}
            <Link href={localizedPath(locale, "ventures")} className="underline">
              {h.help.implementationCta}
            </Link>
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {h.help.cards.map((c) => (
            <div key={c.title} className="border-t-2 border-ink pt-4">
              <h3 className="font-display text-xl mb-2">{c.title}</h3>
              <p className="text-[15px] opacity-80">{c.body}</p>
            </div>
          ))}
        </div>
        <Link href={localizedPath(locale, "workWithMe")} className="inline-block mt-10 underline font-mono text-xs uppercase tracking-wide">
          {h.help.cta} →
        </Link>
      </section>

      {/* LEARN AND CREATE */}
      <section className="px-page py-24">
        <div className="grid md:grid-cols-2 gap-6 md:gap-14 items-end mb-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-clay-deep mb-4">{h.learn.eyebrow}</p>
            <h2 className="font-display text-[clamp(26px,3.2vw,40px)] leading-[1.12] max-w-[22ch]">{h.learn.title}</h2>
          </div>
          <div className="md:justify-self-end max-w-[52ch]">
            <p className="opacity-75 mb-6">{h.learn.body}</p>
            <div className="flex gap-4 flex-wrap">
              <Link href={localizedPath(locale, "shop")} className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay-deep text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform">
                {h.learn.ctaShop} →
              </Link>
              <Link href={localizedPath(locale, "resources")} className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] border border-current inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform">
                {h.learn.ctaResources}
              </Link>
            </div>
          </div>
        </div>

        {featuredProducts.length > 0 && (
          <>
            <h3 className="font-mono text-xs uppercase tracking-widest opacity-70 mb-4">{h.learn.latestProducts}</h3>
            <div className="grid md:grid-cols-3 gap-7 mb-12">
              {featuredProducts.map((p) => (
                <Link key={p.id} href={localizedPath(locale, "shopProduct", { slug: p.slug })} className="flex flex-col gap-2 border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5">
                  <span className="font-mono text-[10px] tracking-wide uppercase text-clay-deep">{productCategoryLabel(p.category, locale)}</span>
                  <span className="font-display text-lg">{p.name}</span>
                  <span className="font-mono text-sm mt-auto">{p.price_cents === 0 ? common.free : `$${(p.price_cents / 100).toFixed(2)}`}</span>
                </Link>
              ))}
            </div>
          </>
        )}

        {posts.length > 0 && (
          <>
            <h3 className="font-mono text-xs uppercase tracking-widest opacity-70 mb-4">{h.learn.latestPosts}</h3>
            <div className="grid md:grid-cols-3 gap-7 mb-12">
              {posts.map((post) => (
                <Link key={post.id} href={localizedPath(locale, "resourcePost", { slug: post.slug })} className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] tracking-wide uppercase text-clay-deep">{pillarLabel(post.pillar, locale)}</span>
                  <span className="font-display text-lg leading-snug">{post.title}</span>
                  {post.excerpt && <span className="text-[13.5px] opacity-70">{post.excerpt}</span>}
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* VENTURES */}
      <section className="bg-ink text-paper px-page py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">{h.ventures.eyebrow}</p>
        <h2 className="font-display text-[clamp(26px,3.2vw,40px)] leading-[1.12] mb-10 max-w-[22ch]">{h.ventures.title}</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {getDictionary(locale).ventures.items.map((v) => (
            <div key={v.key} className="border-t border-[rgba(237,230,216,0.3)] pt-4">
              <span className="font-mono text-[10px] tracking-wide uppercase text-clay-soft">{common.status[v.status as keyof typeof common.status]}</span>
              <h3 className="font-display text-xl my-2">{v.name}</h3>
              <p className="text-sm opacity-75">{v.body}</p>
            </div>
          ))}
        </div>
        <Link href={localizedPath(locale, "ventures")} className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] border border-current inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform">
          {h.ventures.cta} →
        </Link>
      </section>

      {/* STORY */}
      <section className="px-page py-24 grid md:grid-cols-[0.8fr_1.2fr] gap-14 items-center">
        <div className="aspect-[4/5] rounded-[2px] overflow-hidden max-w-[400px] w-full">
          <Image src="/images/carla/hero-mi-historia.jpg" alt={h.hero.portraitAlt} width={768} height={1376} sizes="(min-width: 768px) 400px, 90vw" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest opacity-70 mb-4">{h.story.eyebrow}</p>
          <h2 className="font-display text-[clamp(26px,3.2vw,40px)] leading-[1.12] mb-5 max-w-[24ch]">{h.story.title}</h2>
          <p className="text-base opacity-85 max-w-[58ch] mb-6">{h.story.body}</p>
          <Link href={localizedPath(locale, "about")} className="underline font-mono text-xs uppercase tracking-wide">
            {h.story.cta} →
          </Link>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-page py-20 grid md:grid-cols-2 gap-8 md:gap-14 items-center border-t border-[rgba(20,25,43,0.1)]">
        <div>
          <h2 className="font-display text-[clamp(24px,3vw,34px)] leading-[1.12] mb-3">{newsletter.title}</h2>
          <p className="opacity-75 max-w-[48ch]">{newsletter.body}</p>
        </div>
        <NewsletterForm locale={locale} copy={newsletter} />
      </section>

      {/* CONTACT */}
      <section className="bg-paper-soft px-page py-20 text-center">
        <h2 className="font-display text-[clamp(26px,3.2vw,40px)] leading-[1.12] mb-3">{h.contact.title}</h2>
        <p className="opacity-80 mb-8 max-w-[48ch] mx-auto">{h.contact.body}</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href={localizedPath(locale, "contact")} className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay-deep text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform">
            {h.contact.cta} →
          </Link>
          <Link href={localizedPath(locale, "workWithMe")} className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] border border-current inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform">
            {h.contact.ctaSecondary}
          </Link>
        </div>
      </section>
    </main>
  );
}
