import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPage from "@/components/LegalPage";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const doc = getDictionary(params.locale).legal.accessibility;
  return pageMetadata({ locale: params.locale, route: "accessibility", title: `${doc.title} — Carla Montaño`, description: doc.description });
}

export default function AccessibilityPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const { legal } = getDictionary(params.locale);
  // This statement carries its own review date inside the text, so the legal "last updated" line is left out.
  return <LegalPage doc={legal.accessibility} updated="" eyebrow={legal.eyebrow} />;
}
