import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SKOOL_COMMUNITY_URL } from "@/lib/constants";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localizedPath } from "@/lib/i18n/routes";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { nextYou } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "nextYou", title: nextYou.meta.title, description: nextYou.meta.description });
}

// One path, one button: this page is for people who feel lost, so it offers a single next step.
export default function NextYouPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { nextYou: n } = getDictionary(locale);

  // Tag the link so we can tell which page and language sent each new member.
  const joinUrl = new URL(SKOOL_COMMUNITY_URL);
  joinUrl.searchParams.set("utm_source", "carlamontano.io");
  joinUrl.searchParams.set("utm_medium", "nextyou-page");
  joinUrl.searchParams.set("utm_campaign", locale);

  const joinButton =
    "font-mono text-xs tracking-wide uppercase px-[30px] py-[18px] rounded-[2px] bg-clay-deep text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform";

  return (
    <main>
      <header className="hero-dark bg-ink text-paper px-page pt-20 pb-20">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">{n.eyebrow}</p>
        <h1 className="font-display text-[clamp(34px,5vw,60px)] leading-[1.05] mb-6 max-w-[18ch]">{n.title}</h1>
        <p className="text-lg opacity-85 max-w-[52ch] mb-9">{n.lead}</p>
        <a href={joinUrl.toString()} target="_blank" rel="noopener noreferrer" className={joinButton}>
          {n.cta} ↗
        </a>
      </header>

      <section className="px-page py-20">
        <h2 className="font-display text-[clamp(26px,3.2vw,40px)] leading-[1.12] mb-10">{n.howTitle}</h2>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {n.verbs.map((v, i) => (
            <li key={v.verb} className="border-t-2 border-clay pt-4">
              <p className="font-mono text-[11px] opacity-70 mb-1">{i + 1} / 4</p>
              <h3 className="font-display text-3xl mb-2">{v.verb}</h3>
              <p className="text-[15px] opacity-80">{v.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-paper-soft px-page py-20">
        <h2 className="font-display text-[clamp(26px,3.2vw,40px)] leading-[1.12] mb-3">{n.pathTitle}</h2>
        <p className="opacity-75 mb-10 max-w-[56ch]">{n.pathLead}</p>
        <ol className="grid md:grid-cols-3 gap-8">
          {n.phases.map((p) => (
            <li key={p.name} className="bg-paper border border-[rgba(20,25,43,0.12)] rounded-[2px] p-7">
              <p className="font-mono text-[11px] uppercase tracking-wide text-clay-deep mb-2">{p.steps}</p>
              <h3 className="font-display text-2xl mb-1">{p.plain}</h3>
              <p className="font-mono text-[11px] opacity-70 mb-3">{p.name}</p>
              <p className="text-[15px] opacity-80">{p.promise}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-page py-20 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="font-display text-[clamp(26px,3.2vw,40px)] leading-[1.12] mb-6">{n.includesTitle}</h2>
          <ul className="flex flex-col gap-3 text-[16px]">
            {n.includes.map((i) => (
              <li key={i} className="border-l-2 border-sage pl-4">
                {i}
              </li>
            ))}
          </ul>
          <p className="text-sm opacity-70 mt-6 max-w-[44ch]">{n.coachingNote}</p>
        </div>
        <div className="bg-ink text-paper rounded-[2px] p-9">
          <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-3">{n.priceEyebrow}</p>
          <p className="font-display text-6xl mb-2">{n.price}</p>
          <p className="opacity-80 mb-8 max-w-[34ch]">{n.priceNote}</p>
          <a href={joinUrl.toString()} target="_blank" rel="noopener noreferrer" className={joinButton}>
            {n.cta} ↗
          </a>
          <p className="text-xs opacity-70 mt-4">{n.ctaNote}</p>
        </div>
      </section>

      <section className="px-page pb-20">
        <p className="font-mono text-xs uppercase tracking-widest opacity-70 mb-3">{n.moreTitle}</p>
        <div className="flex flex-col gap-2 text-[15px]">
          <Link href={localizedPath(locale, "diagnostic")} className="underline w-fit">
            {n.quizLink} →
          </Link>
          <Link href={localizedPath(locale, "nextYouStory")} className="underline w-fit">
            {n.storyLink} →
          </Link>
        </div>
      </section>
    </main>
  );
}
