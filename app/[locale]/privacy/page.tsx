import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPage from "@/components/LegalPage";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const doc = getDictionary(params.locale).legal.privacy;
  return pageMetadata({ locale: params.locale, route: "privacy", title: `${doc.title} — Carla Montaño`, description: doc.description });
}

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const { legal } = getDictionary(params.locale);
  return <LegalPage doc={legal.privacy} updated={legal.updated} eyebrow={legal.eyebrow} />;
}
