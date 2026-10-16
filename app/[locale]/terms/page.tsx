import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPage from "@/components/LegalPage";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const doc = getDictionary(params.locale).legal.terms;
  return pageMetadata({ locale: params.locale, route: "terms", title: `${doc.title} — Carla Montaño`, description: doc.description });
}

export default function TermsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const { legal } = getDictionary(params.locale);
  return <LegalPage doc={legal.terms} updated={legal.updated} eyebrow={legal.eyebrow} />;
}
