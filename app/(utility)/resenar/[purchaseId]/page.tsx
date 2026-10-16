import type { Metadata } from "next";
import ReviewPageContent from "@/components/ReviewPageContent";

export const metadata: Metadata = {
  title: "Deja tu reseña — Carla Montaño",
  robots: { index: false, follow: false },
};

// Spanish review link, kept at this path because it is already in emails that were sent.
// English reviews live at /en/review/[purchaseId].
export default function ResenarPage({ params }: { params: { purchaseId: string } }) {
  return <ReviewPageContent locale="es" purchaseId={params.purchaseId} />;
}
