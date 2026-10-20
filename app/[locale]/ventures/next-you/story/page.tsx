import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTIGO_VENEZUELA_URL } from "@/lib/constants";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localizedPath } from "@/lib/i18n/routes";
import { STORY_CONTENT } from "@/lib/i18n/content/story";

const HERO_IMAGE_URL = "/images/carla/hero-mi-historia.jpg";
const CONTIGO_IMAGE_URL = "/images/carla/contigove.png";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const c = STORY_CONTENT[params.locale];
  return pageMetadata({ locale: params.locale, route: "nextYouStory", title: c.metaTitle, description: c.description });
}

export default function StoryPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const c = STORY_CONTENT[locale];

  const stepHref = {
    diagnostic: localizedPath(locale, "diagnostic"),
    community: localizedPath(locale, "nextYou"),
    mentoring: localizedPath(locale, "mentoring"),
  };

  return (
    <main>
      <header className="bg-ink text-paper px-page pt-24 pb-16">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">{c.eyebrow}</p>
        <h1 className="font-display text-[clamp(30px,4.6vw,50px)] leading-[1.12] mb-5 max-w-[20ch]">{c.title}</h1>
        <p className="text-lg max-w-[62ch] opacity-80 mb-6">{c.description}</p>
        <p className="font-mono text-xs uppercase tracking-wide opacity-70 mb-10">{c.tagline}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_IMAGE_URL} alt={c.heroAlt} className="w-full max-w-[520px] aspect-[3/4] object-cover rounded-[2px]" />
      </header>

      <section className="px-page py-24">
        <p className="font-mono text-xs uppercase tracking-widest opacity-70 mb-4">{c.beforeEyebrow}</p>
        <h2 className="font-display text-[clamp(26px,3.2vw,38px)] leading-[1.12] mb-8 max-w-[22ch]">{c.beforeTitle}</h2>
        <div className="max-w-[68ch] flex flex-col gap-5 text-base leading-relaxed opacity-90">
          {c.story.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <blockquote className="border-l-2 border-clay pl-5 italic text-lg my-2">{c.quote}</blockquote>
          {c.storyContinued.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper px-page py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">{c.routeEyebrow}</p>
        <h2 className="font-display text-[clamp(26px,3.2vw,38px)] leading-[1.12] mb-2">{c.routeTitle}</h2>
        <p className="opacity-70 text-base mb-14">{c.routeLead}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(237,230,216,0.14)]">
          {c.timeline.map((item) => (
            <div key={item.year} className="bg-ink-soft p-6">
              <p className="font-mono text-xs text-gold mb-2">{item.year}</p>
              <h3 className="font-display text-base mb-2">{item.title}</h3>
              <p className="text-sm opacity-75">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper-soft px-page py-24">
        <p className="font-mono text-xs uppercase tracking-widest opacity-70 mb-4">{c.lessonsEyebrow}</p>
        <h2 className="font-display text-[clamp(26px,3.2vw,38px)] leading-[1.12] mb-14 max-w-[24ch]">{c.lessonsTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {c.lessons.map((lesson, i) => (
            <div key={lesson.title}>
              <p className="font-mono text-xs text-clay-deep mb-3">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="font-display text-lg mb-3">{lesson.title}</h3>
              <p className="text-sm opacity-75">{lesson.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-page py-24">
        <div className="max-w-[640px] mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-clay-deep mb-4">{c.purposeEyebrow}</p>
          <h2 className="font-display text-[clamp(26px,3.2vw,38px)] leading-[1.12] mb-5 max-w-[20ch]">{c.purposeTitle}</h2>
          <p className="text-base opacity-90 mb-4">{c.purposeBody}</p>
          <p className="italic text-base opacity-70 mb-6">{c.purposeQuote}</p>
          <a
            href={CONTIGO_VENEZUELA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] border border-ink inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform"
          >
            {c.purposeCta}
          </a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CONTIGO_IMAGE_URL} alt={c.purposeAlt} className="w-full max-w-[700px] rounded-[3px] border border-[rgba(20,25,43,0.12)]" />
      </section>

      <section className="bg-paper-soft px-page py-24">
        <p className="font-mono text-xs uppercase tracking-widest opacity-70 mb-4">{c.nextEyebrow}</p>
        <h2 className="font-display text-[clamp(26px,3.2vw,38px)] leading-[1.12] mb-2">{c.nextTitle}</h2>
        <p className="opacity-70 text-base mb-14 max-w-[56ch]">{c.nextLead}</p>
        <div className="grid md:grid-cols-3 gap-6">
          {c.nextSteps.map((step) => (
            <div key={step.key} className="bg-paper border border-[rgba(20,25,43,0.12)] rounded-[2px] p-8 flex flex-col">
              <h3 className="font-display text-lg mb-3">{step.title}</h3>
              <p className="text-sm opacity-75 mb-5">{step.body}</p>
              <ul className="flex flex-col gap-1.5 mb-7 text-sm opacity-80">
                {step.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="text-sage-deep" aria-hidden="true">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href={stepHref[step.key]}
                className="font-mono text-xs tracking-wide uppercase px-[22px] py-[13px] rounded-[2px] bg-clay-deep text-paper inline-flex items-center gap-2.5 justify-center mt-auto hover:-translate-y-px transition-transform"
              >
                {step.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-clay-deep text-paper text-center px-page py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-paper mb-4 flex justify-center">{c.finalEyebrow}</p>
        <h2 className="font-display text-[clamp(26px,3.4vw,42px)] leading-[1.12] max-w-[26ch] mx-auto mb-8">{c.finalTitle}</h2>
        <Link
          href={localizedPath(locale, "diagnostic")}
          className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-ink text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform"
        >
          {c.finalCta}
        </Link>
      </section>
    </main>
  );
}
