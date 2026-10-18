import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localizedPath } from "@/lib/i18n/routes";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { schools } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "schools", title: schools.meta.title, description: schools.meta.description });
}

const BTN_P = "font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform";
const BTN_S = "font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] border border-current inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform";

export default function SchoolsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { schools: s } = getDictionary(locale);
  const request = `${localizedPath(locale, "contact")}?intent=custom-build`;

  return (
    <main>
      <header className="hero-dark bg-ink text-paper px-page pt-20 pb-20">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">{s.eyebrow}</p>
        <h1 className="font-display text-[clamp(34px,5vw,60px)] leading-[1.05] mb-6 max-w-[20ch]">{s.title}</h1>
        <p className="text-lg opacity-85 max-w-[58ch] mb-9">{s.lead}</p>
        <div className="flex flex-wrap gap-4">
          <Link href={request} className={BTN_P}>
            {s.ctaPrimary} →
          </Link>
          <Link href={localizedPath(locale, "shop")} className={BTN_S}>
            {s.ctaSecondary}
          </Link>
        </div>
      </header>

      <section className="px-page py-20">
        <h2 className="font-display text-[clamp(24px,3vw,34px)] leading-[1.12] mb-10">{s.ownershipTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {s.ownership.map((o) => (
            <div key={o.title} className="border-t-2 border-clay pt-4">
              <h3 className="font-display text-xl mb-2">{o.title}</h3>
              <p className="text-[15px] opacity-80">{o.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper-soft px-page py-20">
        <h2 className="font-display text-[clamp(24px,3vw,34px)] leading-[1.12] mb-10">{s.levelsTitle}</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          {s.levels.map((l) => (
            <article key={l.name} className="bg-paper border border-[rgba(20,25,43,0.15)] rounded-[2px] p-8 flex flex-col gap-4">
              <span className="font-mono text-[10px] tracking-wide uppercase text-clay">{l.tag}</span>
              <h3 className="font-display text-2xl">{l.name}</h3>
              <p>
                <span className="font-display text-3xl">{l.price}</span>
                <span className="block font-mono text-[11px] uppercase tracking-wide opacity-60 mt-1">{l.priceNote}</span>
              </p>
              <p className="text-[15px] opacity-85">{l.body}</p>
              <ul className="flex flex-col gap-2 text-sm mb-2">
                {l.includes.map((i) => (
                  <li key={i} className="border-l-2 border-sage pl-3">
                    {i}
                  </li>
                ))}
              </ul>
              <Link href={request} className={`${BTN_P} mt-auto self-start`}>
                {l.cta} →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 border border-clay rounded-[2px] p-6 max-w-[760px]">
          <h3 className="font-display text-lg mb-1.5">{s.launchTitle}</h3>
          <p className="text-[15px] opacity-85">{s.launchBody}</p>
        </div>
      </section>

      <section className="px-page py-20">
        <h2 className="font-display text-[clamp(24px,3vw,34px)] leading-[1.12] mb-3">{s.addonsTitle}</h2>
        <p className="opacity-75 mb-10 max-w-[56ch]">{s.addonsLead}</p>
        <div className="grid md:grid-cols-2 gap-8">
          {s.addons.map((a) => (
            <div key={a.name} className="border border-[rgba(20,25,43,0.15)] rounded-[2px] p-7">
              <span className="font-mono text-[10px] tracking-wide uppercase text-clay">{a.status}</span>
              <h3 className="font-display text-xl my-2">{a.name}</h3>
              <p className="text-[15px] opacity-80">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper px-page py-20">
        <h2 className="font-display text-[clamp(24px,3vw,34px)] leading-[1.12] mb-10">{s.howTitle}</h2>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {s.how.map((h) => (
            <li key={h.title}>
              <h3 className="font-display text-lg mb-2">{h.title}</h3>
              <p className="text-sm opacity-80">{h.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-page py-20 grid md:grid-cols-[0.8fr_1.2fr] gap-12">
        <div>
          <h2 className="font-display text-[clamp(24px,3vw,34px)] leading-[1.12] mb-3">{s.careTitle}</h2>
          <p className="opacity-80 max-w-[44ch]">{s.careBody}</p>
        </div>
        <div>
          <h2 className="font-display text-[clamp(24px,3vw,34px)] leading-[1.12] mb-6">{s.faqTitle}</h2>
          <div className="border-t border-[rgba(20,25,43,0.12)]">
            {s.faq.map((f) => (
              <div key={f.title} className="py-5 border-b border-[rgba(20,25,43,0.12)]">
                <h3 className="text-base font-semibold mb-1.5">{f.title}</h3>
                <p className="text-[14.5px] opacity-75 max-w-[62ch]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-clay text-paper text-center px-page py-20">
        <h2 className="font-display text-[clamp(26px,3.4vw,42px)] leading-[1.12] max-w-[22ch] mx-auto mb-4">{s.finalTitle}</h2>
        <p className="opacity-90 max-w-[48ch] mx-auto mb-8">{s.finalBody}</p>
        <Link href={request} className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-ink text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform">
          {s.finalCta} →
        </Link>
      </section>
    </main>
  );
}
