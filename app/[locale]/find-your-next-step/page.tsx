import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextStepQuiz from "@/components/NextStepQuiz";
import { isLocale } from "@/lib/i18n/config";
import { NEXT_STEP_CONTENT } from "@/lib/i18n/content/nextStep";
import { pageMetadata } from "@/lib/i18n/metadata";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { meta } = NEXT_STEP_CONTENT[params.locale];
  return pageMetadata({ locale: params.locale, route: "nextStep", title: meta.title, description: meta.description });
}

export default function NextStepPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  return (
    <main>
      <NextStepQuiz locale={params.locale} />
    </main>
  );
}
