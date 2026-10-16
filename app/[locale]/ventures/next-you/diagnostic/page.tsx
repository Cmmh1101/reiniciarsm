import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DiagnosticQuiz from "@/components/DiagnosticQuiz";
import SpanishOnlyNotice from "@/components/SpanishOnlyNotice";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";

// The quiz is Spanish-only for now, so the Spanish URL is always the canonical one.
export function generateMetadata(): Metadata {
  const { diagnostic } = getDictionary("es");
  return pageMetadata({ locale: "es", route: "diagnostic", title: diagnostic.meta.title, description: diagnostic.meta.description, availableIn: ["es"] });
}

export default function DiagnosticPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const { diagnostic } = getDictionary(params.locale);
  return (
    <main>
      <SpanishOnlyNotice message={diagnostic.spanishOnly} />
      <DiagnosticQuiz />
    </main>
  );
}
