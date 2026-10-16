import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localizedPath } from "@/lib/i18n/routes";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { workWithMe } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "workWithMe", title: workWithMe.meta.title, description: workWithMe.meta.description });
}

export default function WorkWithMePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { workWithMe: w } = getDictionary(locale);

  // Tech Clarity and workshops start as a contact request; mentoring has its own booking page.
  function hrefFor(key: string) {
    if (key === "mentoring") return localizedPath(locale, "mentoring");
    const intent = key === "workshops" ? "workshop" : "advice";
    return `${localizedPath(locale, "contact")}?intent=${intent}`;
  }

  return (
    <main>
      <header className="bg-ink text-paper px-[8vw] pt-20 pb-20">
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">{w.eyebrow}</p>
        <h1 className="font-display text-[clamp(34px,5vw,60px)] leading-[1.05] mb-6 max-w-[18ch]">{w.title}</h1>
        <p className="text-lg opacity-85 max-w-[52ch]">{w.lead}</p>
      </header>

      <section className="px-[8vw] py-20 grid lg:grid-cols-3 gap-8">
        {w.offers.map((o) => (
          <article key={o.key} className="border border-[rgba(20,25,43,0.15)] rounded-[2px] p-8 flex flex-col gap-4">
            <h2 className="font-display text-2xl">{o.name}</h2>
            <p>
              <span className="font-display text-3xl">{o.price}</span>
              <span className="block font-mono text-[11px] uppercase tracking-wide opacity-60 mt-1">{o.priceNote}</span>
            </p>
            <p className="text-[15px] opacity-85">{o.body}</p>
            <ul className="flex flex-col gap-2 text-sm mt-1">
              {o.includes.map((i) => (
                <li key={i} className="border-l-2 border-sage pl-3">{i}</li>
              ))}
            </ul>
            <Link href={hrefFor(o.key)} className="mt-auto self-start font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform">
              {o.cta} →
            </Link>
          </article>
        ))}
      </section>

      <section className="bg-paper-soft px-[8vw] py-20">
        <h2 className="font-display text-[clamp(24px,3vw,34px)] mb-10">{w.howTitle}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {w.how.map((s) => (
            <div key={s.title}>
              <h3 className="font-display text-lg mb-2">{s.title}</h3>
              <p className="text-sm opacity-75">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="font-mono text-[11px] opacity-60 mt-10">{w.note}</p>
      </section>

      <section className="bg-ink text-paper px-[8vw] py-20 text-center">
        <h2 className="font-display text-[clamp(24px,3vw,34px)] mb-4">{w.agencyTitle}</h2>
        <p className="max-w-[60ch] mx-auto opacity-85 mb-8">{w.agencyBody}</p>
        <Link href={localizedPath(locale, "ventures")} className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] border border-current inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform">
          {w.agencyCta} →
        </Link>
      </section>
    </main>
  );
}
