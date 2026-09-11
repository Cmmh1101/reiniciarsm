import type { Metadata } from "next";
import { createStripeClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const metadata: Metadata = {
  title: "Gracias — Carla Montaño",
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

export default async function ProductosGraciasPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const downloadToken = searchParams.session_id ? await getDownloadToken(searchParams.session_id) : null;

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-lg">
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">Pago confirmado</p>
        <h1 className="font-display text-3xl md:text-4xl mb-4">¡Gracias por tu compra!</h1>
        {downloadToken ? (
          <>
            <p className="opacity-70 mb-8">También te llegó el enlace de descarga por correo.</p>
            <a
              href={`/api/download/${downloadToken}`}
              className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper inline-flex items-center gap-2.5"
            >
              Descargar →
            </a>
          </>
        ) : (
          <p className="opacity-70">
            Te llegará el enlace de descarga por correo en unos minutos. Si no lo ves, revisa spam
            o escríbeme a hello@carlamontano.io.
          </p>
        )}
      </div>
    </main>
  );
}
