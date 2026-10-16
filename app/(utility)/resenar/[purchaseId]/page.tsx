import type { Metadata } from "next";
import { getPurchaseForReview } from "@/lib/productReviews";
import ReviewForm from "@/components/ReviewForm";

export const metadata: Metadata = {
  title: "Deja tu reseña — Carla Montaño",
  robots: { index: false, follow: false },
};

export default async function ResenarPage({ params }: { params: { purchaseId: string } }) {
  const purchase = await getPurchaseForReview(params.purchaseId);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-lg w-full">
        {!purchase ? (
          <>
            <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">No encontrado</p>
            <p className="opacity-70">No pudimos encontrar esa compra. Si crees que esto es un error, escríbeme a hello@carlamontano.io.</p>
          </>
        ) : purchase.alreadyReviewed ? (
          <>
            <p className="font-display text-2xl mb-3">¡Ya recibimos tu reseña!</p>
            <p className="opacity-70">Gracias por tomarte el tiempo de compartirla.</p>
          </>
        ) : (
          <>
            <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">{purchase.productName}</p>
            <h1 className="font-display text-3xl md:text-4xl mb-8">¿Qué te pareció?</h1>
            <ReviewForm purchaseId={params.purchaseId} />
          </>
        )}
      </div>
    </main>
  );
}
