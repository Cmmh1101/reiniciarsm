import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localizedPath } from "@/lib/i18n/routes";
import { SKOOL_COMMUNITY_URL } from "@/lib/constants";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { nextYou } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "nextYou", title: nextYou.meta.title, description: nextYou.meta.description });
}

export default function NextYouPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { nextYou } = getDictionary(locale);

  const actionHref: Record<string, { href: string; external?: boolean }> = {
    diagnostic: { href: localizedPath(locale, "diagnostic") },
    community: { href: SKOOL_COMMUNITY_URL, external: true },
    story: { href: localizedPath(locale, "nextYouStory") },
    mentoring: { href: localizedPath(locale, "mentoring") },
  };

  return (
    <main>
      <header className="hero-dark bg-ink text-paper px-page pt-20 pb-20">
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">{nextYou.eyebrow}</p>
        <h1 className="font-display text-[clamp(34px,5vw,60px)] leading-[1.05] mb-6 max-w-[18ch]">{nextYou.title}</h1>
        <p className="text-lg opacity-85 max-w-[56ch]">{nextYou.lead}</p>
      </header>

      <section className="px-page py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-3">{nextYou.methodEyebrow}</p>
        <h2 className="font-display text-[clamp(28px,3.6vw,44px)] leading-[1.12] mb-3">{nextYou.methodTitle}</h2>
        <p className="opacity-75 mb-10 max-w-[56ch]">{nextYou.methodLead}</p>
        <ol className="grid md:grid-cols-3 gap-8">
          {nextYou.phases.map((p, i) => (
            <li key={p.name} className="border-t-2 border-clay pt-4">
              <p className="font-mono text-[11px] opacity-60 mb-1">{i + 1} / 3</p>
              <h3 className="font-display text-2xl mb-2">{p.name}</h3>
              <p className="text-[15px] mb-3">{p.promise}</p>
              <p className="font-mono text-[11px] uppercase tracking-wide opacity-60">{p.pillars}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 border-l-2 border-sage pl-4 max-w-[60ch] text-[15px]">
          <span className="font-mono text-[11px] uppercase tracking-wide block opacity-60 mb-1">{nextYou.communityLabel}</span>
          {nextYou.communityNote}
        </p>
      </section>

      <section className="bg-paper-soft px-page py-20">
        <h2 className="font-display text-[clamp(24px,3vw,34px)] leading-[1.12] mb-10">{nextYou.actionsTitle}</h2>
        <div className="grid sm:grid-cols-2 gap-8">
          {nextYou.actions.map((a) => {
            const t = actionHref[a.key];
            const content = (
              <>
                <h3 className="font-display text-xl mb-2">{a.title} {t.external ? "↗" : "→"}</h3>
                <p className="text-sm opacity-75">{a.body}</p>
              </>
            );
            const cls = "block border border-[rgba(20,25,43,0.18)] rounded-[2px] p-6 bg-paper hover:-translate-y-px transition-transform";
            return t.external ? (
              <a key={a.key} href={t.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {content}
              </a>
            ) : (
              <Link key={a.key} href={t.href} className={cls}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
