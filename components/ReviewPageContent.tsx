import { getPurchaseForReview } from "@/lib/productReviews";
import ReviewForm from "@/components/ReviewForm";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

/** The review page body, shared by the legacy Spanish /resenar/[id] link (already in sent emails) and /[locale]/review/[id]. */
export default async function ReviewPageContent({ locale, purchaseId }: { locale: Locale; purchaseId: string }) {
  const { review } = getDictionary(locale);
  const purchase = await getPurchaseForReview(purchaseId, locale);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-lg w-full">
        {!purchase ? (
          <>
            <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">{review.notFoundEyebrow}</p>
            <p className="opacity-70">{review.notFoundBody}</p>
          </>
        ) : purchase.alreadyReviewed ? (
          <>
            <p className="font-display text-2xl mb-3">{review.alreadyTitle}</p>
            <p className="opacity-70">{review.alreadyBody}</p>
          </>
        ) : (
          <>
            <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">{purchase.productName}</p>
            <h1 className="font-display text-3xl md:text-4xl mb-8">{review.title}</h1>
            <ReviewForm purchaseId={purchaseId} locale={locale} copy={review} />
          </>
        )}
      </div>
    </main>
  );
}
