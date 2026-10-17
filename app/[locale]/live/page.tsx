import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsletterForm from "@/components/NewsletterForm";
import { MONTANO_SYSTEMS_URL } from "@/lib/constants";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localizedPath, type RouteKey } from "@/lib/i18n/routes";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { live } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "live", title: live.meta.title, description: live.meta.description });
}

// Landing page for people arriving from the lives: short enough to say out loud (carlamontano.io/live).
export default function LivePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { live, newsletter } = getDictionary(locale);

  const hrefs: Record<string, string> = {
    quiz: localizedPath(locale, "nextStep" as RouteKey),
    sos: `${localizedPath(locale, "workWithMe")}?plan=sos#book`,
    community: localizedPath(locale, "nextYou"),
    shop: localizedPath(locale, "shop"),
  };

  return (
    <main>
      <header className="bg-ink text-paper px-[8vw] pt-20 pb-14">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">{live.eyebrow}</p>
        <h1 className="font-display text-[clamp(34px,5vw,60px)] leading-[1.05] mb-4">{live.title}</h1>
        <p className="text-lg opacity-85 max-w-[52ch]">{live.lead}</p>
      </header>

      <section className="px-[8vw] py-14 grid sm:grid-cols-2 gap-6 max-w-[1000px]">
        {live.cards.map((c) => (
          <Link
            key={c.key}
            href={hrefs[c.key]}
            className="border border-[rgba(20,25,43,0.15)] rounded-[2px] p-7 flex flex-col gap-3 hover:-translate-y-px transition-transform"
          >
            <h2 className="font-display text-xl">{c.title}</h2>
            <p className="text-[15px] opacity-75">{c.body}</p>
            <span className="mt-auto pt-2 font-mono text-xs uppercase tracking-wide text-clay">{c.cta} →</span>
          </Link>
        ))}
      </section>

      <section className="bg-ink text-paper px-[8vw] py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">{live.business.eyebrow}</p>
        <h2 className="font-display text-[clamp(26px,3.4vw,40px)] leading-[1.1] mb-4 max-w-[22ch]">{live.business.title}</h2>
        <p className="opacity-85 max-w-[58ch] mb-8">{live.business.body}</p>
        <div className="flex flex-wrap gap-4">
          <a
            href={MONTANO_SYSTEMS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform"
          >
            {live.business.ctaPrimary} ↗
          </a>
          <Link
            href={`${localizedPath(locale, "contact")}?intent=custom-build`}
            className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] border border-current inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform"
          >
            {live.business.ctaSecondary}
          </Link>
        </div>
        <Link href={localizedPath(locale, "schools")} className="inline-block mt-6 underline font-mono text-xs uppercase tracking-wide opacity-85">
          {live.business.schoolsLink}
        </Link>
      </section>

      <section className="bg-paper-soft px-[8vw] py-14">
        <div className="max-w-[560px]">
          <h2 className="font-display text-[clamp(22px,2.8vw,30px)] mb-3">{live.newsletterTitle}</h2>
          <p className="opacity-70 mb-6">{newsletter.body}</p>
          <NewsletterForm locale={locale} copy={newsletter} withName={false} />
        </div>
      </section>
    </main>
  );
}
