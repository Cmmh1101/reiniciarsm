import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localizedPath } from "@/lib/i18n/routes";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { about } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "about", title: about.meta.title, description: about.meta.description });
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { about } = getDictionary(locale);

  return (
    <main>
      <header className="hero-dark bg-ink text-paper px-page pt-20 pb-20">
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">{about.eyebrow}</p>
        <h1 className="font-display text-[clamp(34px,5vw,60px)] leading-[1.05] mb-6 max-w-[18ch]">{about.title}</h1>
        <p className="text-lg opacity-85 max-w-[52ch]">{about.lead}</p>
      </header>

      <section className="px-page py-20 grid md:grid-cols-[1fr_320px] gap-14">
        <div className="flex flex-col gap-5 max-w-[62ch] text-base leading-relaxed">
          {about.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <aside className="md:pt-1">
          <h2 className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">{about.todayTitle}</h2>
          <ul className="flex flex-col gap-3 text-[15px]">
            {about.today.map((t) => (
              <li key={t} className="border-l-2 border-clay pl-4">{t}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="bg-paper-soft px-page py-20">
        <h2 className="font-display text-[clamp(24px,3vw,34px)] mb-10">{about.valuesTitle}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {about.values.map((v) => (
            <div key={v.title}>
              <h3 className="font-display text-lg mb-2">{v.title}</h3>
              <p className="text-sm opacity-75">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-page py-20 text-center">
        <h2 className="font-display text-[clamp(24px,3vw,34px)] mb-6">{about.ctaTitle}</h2>
        <Link href={localizedPath(locale, "workWithMe")} className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform">
          {about.cta} →
        </Link>
      </section>
    </main>
  );
}
