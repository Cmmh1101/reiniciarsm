import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DiagnosticQuiz from "@/components/DiagnosticQuiz";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { diagnostic } = getDictionary(params.locale);
  return pageMetadata({ locale: params.locale, route: "diagnostic", title: diagnostic.meta.title, description: diagnostic.meta.description });
}

export default function DiagnosticPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  return (
    <main>
      <DiagnosticQuiz locale={params.locale} />
    </main>
  );
}
