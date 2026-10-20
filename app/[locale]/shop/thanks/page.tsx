import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createStripeClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

export const metadata: Metadata = {
  title: "Carla Montaño",
  robots: { index: false, follow: true },
};

async function getDownloadToken(sessionId: string): Promise<string | null> {
  try {
    const stripe = createStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentId = typeof session.payment_intent === "string" ? session.payment_intent : session.id;

    const supabase = createSupabaseAdminClient();
    const { data } = await supabase.from("product_purchases").select("download_token").eq("stripe_payment_id", paymentId).single();
    return data?.download_token ?? null;
  } catch {
    return null;
  }
}

export default async function ShopThanksPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { session_id?: string; token?: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const { shop } = getDictionary(params.locale);
  const downloadToken = searchParams.token ?? (searchParams.session_id ? await getDownloadToken(searchParams.session_id) : null);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-lg">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-deep mb-4">{shop.thanksEyebrow}</p>
        <h1 className="font-display text-3xl md:text-4xl mb-4">{shop.thanksTitle}</h1>
        {downloadToken ? (
          <>
            <p className="opacity-70 mb-8">{shop.thanksBody}</p>
            <a
              href={`/api/download/${downloadToken}`}
              className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay-deep text-paper inline-flex items-center gap-2.5"
            >
              {shop.download}
            </a>
          </>
        ) : (
          <p className="opacity-70">{shop.thanksFallback}</p>
        )}
      </div>
    </main>
  );
}
