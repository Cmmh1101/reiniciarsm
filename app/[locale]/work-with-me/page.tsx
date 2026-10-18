import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingWidget, { type Plan } from "@/components/BookingWidget";
import { getAvailableSlots } from "@/lib/mentorias";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { localizedPath } from "@/lib/i18n/routes";

// Availability changes whenever a slot is booked or generated — fetch fresh every request.
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { workWithMe } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "workWithMe", title: workWithMe.meta.title, description: workWithMe.meta.description });
}

export default async function WorkWithMePage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { plan?: string; canceled?: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { workWithMe: w, booking } = getDictionary(locale);
  const slots = await getAvailableSlots();
  const initialPlan: Plan | undefined = searchParams.plan === "sos" || searchParams.plan === "session" || searchParams.plan === "pack" ? searchParams.plan : undefined;

  // Booking offers jump to the booking section with their plan preselected; workshops start as a contact request.
  function hrefFor(key: string) {
    if (key === "workshops") return `${localizedPath(locale, "contact")}?intent=workshop`;
    return `${localizedPath(locale, "workWithMe")}?plan=${key}#book`;
  }

  return (
    <main>
      <header className="hero-dark bg-ink text-paper px-page pt-20 pb-20">
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">{w.eyebrow}</p>
        <h1 className="font-display text-[clamp(34px,5vw,60px)] leading-[1.05] mb-6 max-w-[18ch]">{w.title}</h1>
        <p className="text-lg opacity-85 max-w-[56ch]">{w.lead}</p>
      </header>

      <section className="px-page py-20 grid lg:grid-cols-3 gap-8">
        {w.offers.map((o) => (
          <article key={o.key} className="border border-[rgba(20,25,43,0.15)] rounded-[2px] p-8 flex flex-col gap-4">
            <h2 className="font-display text-2xl">{o.name}</h2>
            <p>
              <span className="font-display text-3xl">{o.price}</span>
              <span className="block font-mono text-[11px] uppercase tracking-wide opacity-60 mt-1">{o.priceNote}</span>
            </p>
            <p className="text-[15px] opacity-85">{o.body}</p>
            <ul className="flex flex-col gap-2 text-sm mt-1 mb-2">
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

      <section id="agenda" className="bg-ink text-paper px-page py-20">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">{booking.sectionEyebrow}</p>
            <h2 className="font-display text-[clamp(26px,3.2vw,40px)] leading-[1.1] mb-5">{booking.sectionTitle}</h2>
            {searchParams.canceled && <p role="status" className="text-sm text-clay-soft">{booking.canceled}</p>}
          </div>
          <div id="book" className="scroll-mt-24">
            <BookingWidget slots={slots} locale={locale} copy={booking} plans={["sos", "session", "pack"]} initialPlan={initialPlan} source="workWithMe" />
          </div>
        </div>
      </section>

      <section className="bg-paper-soft px-page py-20">
        <h2 className="font-display text-[clamp(24px,3vw,34px)] leading-[1.12] mb-10">{w.howTitle}</h2>
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

      <section className="px-page py-16 grid md:grid-cols-2 gap-8">
        <div className="border-t-2 border-clay pt-4">
          <h2 className="font-display text-xl mb-2">{w.mentoringTitle}</h2>
          <p className="text-[15px] opacity-80 mb-4 max-w-[48ch]">{w.mentoringBody}</p>
          <Link href={localizedPath(locale, "mentoring")} className="underline font-mono text-xs uppercase tracking-wide">
            {w.mentoringCta} →
          </Link>
        </div>
        <div className="border-t-2 border-ink pt-4">
          <h2 className="font-display text-xl mb-2">{w.agencyTitle}</h2>
          <p className="text-[15px] opacity-80 mb-4 max-w-[52ch]">{w.agencyBody}</p>
          <Link href={localizedPath(locale, "ventures")} className="underline font-mono text-xs uppercase tracking-wide">
            {w.agencyCta} →
          </Link>
          <Link href={localizedPath(locale, "schools")} className="underline font-mono text-xs uppercase tracking-wide ml-5">
            {getDictionary(locale).nav.schools} →
          </Link>
        </div>
      </section>
    </main>
  );
}
