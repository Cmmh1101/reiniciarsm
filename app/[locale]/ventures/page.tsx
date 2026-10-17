import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localizedPath } from "@/lib/i18n/routes";
import { MONTANO_SYSTEMS_URL } from "@/lib/constants";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { ventures } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "ventures", title: ventures.meta.title, description: ventures.meta.description });
}

export default function VenturesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { ventures, common } = getDictionary(locale);

  function cta(key: string, label: string) {
    if (!label) return null;
    const cls = "underline text-sm mt-auto pt-2";
    if (key === "montanoSystems")
      return (
        <a href={MONTANO_SYSTEMS_URL} target="_blank" rel="noopener noreferrer" className={cls}>
          {label} ↗
        </a>
      );
    if (key === "nextYou")
      return (
        <Link href={localizedPath(locale, "nextYou")} className={cls}>
          {label} →
        </Link>
      );
    return null;
  }

  return (
    <main>
      <header className="hero-dark bg-ink text-paper px-page pt-20 pb-20">
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">{ventures.eyebrow}</p>
        <h1 className="font-display text-[clamp(34px,5vw,60px)] leading-[1.05] mb-6 max-w-[18ch]">{ventures.title}</h1>
        <p className="text-lg opacity-85 max-w-[52ch]">{ventures.lead}</p>
      </header>

      <section className="px-page py-20 grid lg:grid-cols-3 gap-8">
        {ventures.items.map((v) => (
          <article key={v.key} className="border border-[rgba(20,25,43,0.15)] rounded-[2px] p-8 flex flex-col gap-3">
            <span className="font-mono text-[10px] tracking-wide uppercase text-clay">{common.status[v.status as keyof typeof common.status]}</span>
            <h2 className="font-display text-2xl">{v.name}</h2>
            {v.note && <p className="font-mono text-[11px] opacity-60">{v.note}</p>}
            <p className="text-[15px] opacity-85">{v.body}</p>
            <p className="text-sm font-semibold">{v.for}</p>
            {cta(v.key, v.cta)}
          </article>
        ))}
      </section>

      <section className="bg-paper-soft px-page py-20">
        <h2 className="font-display text-[clamp(24px,3vw,34px)] mb-8">{ventures.routingTitle}</h2>
        <dl className="grid sm:grid-cols-2 gap-x-12 gap-y-5 max-w-[900px]">
          {ventures.routing.map((r) => (
            <div key={r.need} className="border-t border-[rgba(20,25,43,0.2)] pt-3">
              <dt className="text-[15px]">{r.need}</dt>
              <dd className="font-mono text-xs uppercase tracking-wide text-clay mt-1">{r.where}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
