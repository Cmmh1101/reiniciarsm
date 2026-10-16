import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReviewPageContent from "@/components/ReviewPageContent";
import { isLocale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Carla Montaño",
  robots: { index: false, follow: false },
};

export default function ReviewPage({ params }: { params: { locale: string; purchaseId: string } }) {
  if (!isLocale(params.locale)) notFound();
  return <ReviewPageContent locale={params.locale} purchaseId={params.purchaseId} />;
}
