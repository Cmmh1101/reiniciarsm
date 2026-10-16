import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localizedPath } from "@/lib/i18n/routes";
import { LINKEDIN_URL } from "@/lib/constants";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { work } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "work", title: work.meta.title, description: work.meta.description });
}

export default function WorkPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { work, common } = getDictionary(locale);

  return (
    <main>
      <header className="bg-ink text-paper px-[8vw] pt-20 pb-20">
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">{work.eyebrow}</p>
        <h1 className="font-display text-[clamp(34px,5vw,60px)] leading-[1.05] mb-6 max-w-[18ch]">{work.title}</h1>
        <p className="text-lg opacity-85 max-w-[52ch]">{work.lead}</p>
      </header>

      <section className="px-[8vw] py-20 grid md:grid-cols-2 gap-8">
        {work.projects.map((p) => (
          <article key={p.name} className="border border-[rgba(20,25,43,0.15)] rounded-[2px] p-8 flex flex-col gap-3">
            <span className="font-mono text-[10px] tracking-wide uppercase text-clay">{common.status[p.status as keyof typeof common.status]}</span>
            <h2 className="font-display text-2xl">{p.name}</h2>
            <p className="text-sm opacity-70">
              <span className="font-mono text-[11px] uppercase tracking-wide opacity-70">{work.roleLabel}:</span> {p.role}
            </p>
            <p className="text-[15px] opacity-85">{p.body}</p>
            {p.stack.length > 0 && (
              <p className="font-mono text-[11px] opacity-60">
                {work.stackLabel}: {p.stack.join(" · ")}
              </p>
            )}
            {p.href && (
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="underline text-sm mt-auto pt-2">
                {p.linkLabel} ↗
              </a>
            )}
          </article>
        ))}
      </section>

      <section className="bg-paper-soft px-[8vw] py-16 text-center">
        <h2 className="font-display text-[clamp(22px,2.6vw,30px)] mb-3">{work.ctaTitle}</h2>
        <p className="opacity-80 mb-6">{work.ctaBody}</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform">
            {work.ctaLinkedIn} ↗
          </a>
          <Link href={localizedPath(locale, "contact")} className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] border border-current inline-flex items-center gap-2.5 hover:-translate-y-px transition-transform">
            {work.ctaContact}
          </Link>
        </div>
      </section>
    </main>
  );
}
