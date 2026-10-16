import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactForm from "@/components/ContactForm";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { contact } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "contact", title: contact.meta.title, description: contact.meta.description });
}

export default function ContactPage({ params, searchParams }: { params: { locale: string }; searchParams: { intent?: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const { contact } = getDictionary(locale);

  return (
    <main className="px-[8vw] py-24">
      <div className="grid md:grid-cols-[1fr_1fr] gap-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">{contact.eyebrow}</p>
          <h1 className="font-display text-[clamp(30px,4vw,44px)] leading-[1.1] mb-5 max-w-[16ch]">{contact.title}</h1>
          <p className="text-base opacity-90 mb-8 max-w-[48ch]">{contact.lead}</p>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Email</p>
            <a href="mailto:hello@carlamontano.io" className="text-base underline">
              hello@carlamontano.io
            </a>
          </div>
        </div>
        <ContactForm locale={locale} copy={contact} initialIntent={searchParams.intent} />
      </div>
    </main>
  );
}
