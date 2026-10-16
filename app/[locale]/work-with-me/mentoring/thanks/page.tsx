import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createStripeClient } from "@/lib/stripe";
import { MENTORIA_PACK_PRODUCT } from "@/lib/pricing";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

export const metadata: Metadata = {
  title: "Carla Montaño",
  robots: { index: false, follow: true },
};

export default async function BookingThanksPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { session_id?: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const { booking } = getDictionary(params.locale);
  let isPack = false;

  if (searchParams.session_id) {
    try {
      const stripe = createStripeClient();
      const session = await stripe.checkout.sessions.retrieve(searchParams.session_id);
      isPack = session.metadata?.product === MENTORIA_PACK_PRODUCT;
    } catch {
      // Payment still went through if we got here — the confirmation copy just
      // falls back to the generic version below.
    }
  }

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-lg">
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">{booking.thanksEyebrow}</p>
        <h1 className="font-display text-3xl md:text-4xl mb-4">{booking.thanksTitle}</h1>
        <p className="opacity-70">{isPack ? booking.thanksPack : booking.thanksSession}</p>
      </div>
    </main>
  );
}
