import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingWidget from "@/components/BookingWidget";
import { getAvailableSlots } from "@/lib/mentorias";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";

// Slots are added/booked at runtime (in the admin, or via a booking) —
// fetch fresh every request rather than baking availability into the build.
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { mentoring } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "mentoring", title: mentoring.meta.title, description: mentoring.meta.description });
}

export default async function MentoringPage({ params, searchParams }: { params: { locale: string }; searchParams: { canceled?: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { mentoring: m, booking } = getDictionary(locale);
  const slots = await getAvailableSlots();

  return (
    <main>
      <header className="hero-dark bg-ink text-paper px-page pt-20 pb-[90px] min-h-[76vh] flex flex-col justify-center">
        <div className="max-w-[780px]">
          <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">{m.eyebrow}</p>
          <h1 className="font-display text-[clamp(32px,4.6vw,54px)] leading-[1.1] mb-4">
            {m.heroLine1}
            <br />
            {m.heroBefore}
            <em className="italic text-clay-soft font-normal">{m.heroEmphasis}</em>
            {m.heroAfter}
          </h1>
          <p className="text-[17px] max-w-[56ch] opacity-80 mb-7">{m.lead}</p>
          <div className="flex gap-4 flex-wrap mb-7">
            <a href="#agenda" className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper inline-flex items-center gap-2.5">
              {m.ctaBook}
            </a>
            <a href="#faq" className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] border border-current opacity-85">
              {m.ctaFaq}
            </a>
          </div>
          <div className="flex gap-x-6 gap-y-2 flex-wrap font-mono text-[11px] opacity-55">
            {m.badges.map((b, i) => (
              <span key={b} className={i > 0 ? "sm:pl-3.5 sm:border-l border-[rgba(237,230,216,0.14)]" : ""}>{b}</span>
            ))}
          </div>
        </div>
      </header>

      <section className="px-page py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">{m.signsEyebrow}</p>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)] leading-[1.12]">{m.signsTitle}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-[rgba(20,25,43,0.12)]">
          {m.signs.map((s) => (
            <div key={s.title} className="bg-paper p-8">
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm opacity-70">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper-soft px-page py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">{m.areasEyebrow}</p>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)] leading-[1.12] mb-3.5">{m.areasTitle}</h2>
          <p className="opacity-70">{m.areasLead}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {m.areas.map((w, i) => (
            <div key={w.title} className="bg-paper border border-[rgba(20,25,43,0.12)] rounded-[2px] p-5 flex flex-col gap-2.5">
              <span className="font-mono text-[10px] opacity-40">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-sm font-semibold">{w.title}</h3>
              <p className="text-xs opacity-60">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-page py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">{m.howEyebrow}</p>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)] leading-[1.12]">{m.howTitle}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-[rgba(20,25,43,0.12)]">
          {m.how.map((h, i) => (
            <div key={h.title} className="bg-paper p-9">
              <div className="font-mono text-[26px] text-clay opacity-50 mb-3.5">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="text-lg font-semibold mb-2">{h.title}</h3>
              <p className="text-sm opacity-70">{h.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper-soft px-page py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">{m.idealEyebrow}</p>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)] leading-[1.12]">{m.idealTitle}</h2>
        </div>
        <div className="border-t border-[rgba(20,25,43,0.12)]">
          {m.ideal.map((item) => (
            <div key={item.title} className="grid grid-cols-[32px_1fr] gap-4 py-[22px] border-b border-[rgba(20,25,43,0.12)] items-start">
              <span className="font-mono text-clay text-sm pt-0.5">—</span>
              <div>
                <h3 className="text-base font-semibold mb-1">{item.title}</h3>
                <p className="text-[13.5px] opacity-65">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="agenda" className="bg-ink text-paper px-page py-24">
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">{m.agendaEyebrow}</p>
            <h2 className="font-display text-[clamp(28px,3.2vw,40px)] leading-[1.1] mb-5">{m.agendaTitle}</h2>
            <ul className="flex flex-col gap-3.5 mt-5">
              {m.agendaBullets.map((t) => (
                <li key={t} className="text-sm pl-5 relative opacity-85 before:content-['—'] before:absolute before:left-0 before:text-clay-soft">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div id="book" className="scroll-mt-24">
            {searchParams.canceled && <p role="status" className="text-sm text-clay-soft mb-4">{booking.canceled}</p>}
            <BookingWidget slots={slots} locale={locale} copy={booking} plans={["session", "pack"]} source="mentoring" />
          </div>
        </div>
      </section>

      <section id="faq" className="px-page py-24">
        <div className="max-w-[640px] mb-14">
          <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-4">{m.faqEyebrow}</p>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)] leading-[1.12]">{m.faqTitle}</h2>
        </div>
        <div className="border-t border-[rgba(20,25,43,0.12)]">
          {m.faq.map((item) => (
            <div key={item.title} className="py-6 border-b border-[rgba(20,25,43,0.12)]">
              <h3 className="text-base font-semibold mb-2">{item.title}</h3>
              <p className="text-[14.5px] opacity-70 max-w-[66ch]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-clay text-paper text-center px-page py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-ink opacity-70 mb-4 flex justify-center">{m.finalEyebrow}</p>
        <h2 className="font-display text-[clamp(26px,3.4vw,42px)] leading-[1.12] max-w-[22ch] mx-auto mb-4">{m.finalTitle}</h2>
        <p className="opacity-85 max-w-[50ch] mx-auto mb-6">{m.finalNote}</p>
        <a href="#agenda" className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-ink text-paper inline-flex items-center gap-2.5">
          {m.finalCta}
        </a>
      </section>
    </main>
  );
}
