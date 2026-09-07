import type { Metadata } from "next";
import { createStripeClient } from "@/lib/stripe";
import { MENTORIA_PACK_PRODUCT } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Gracias — Carla Montaño",
};

export default async function MentoriasGraciasPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
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
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">Pago confirmado</p>
        <h1 className="font-display text-3xl md:text-4xl mb-4">¡Gracias!</h1>
        {isPack ? (
          <p className="opacity-70">
            Tu paquete de 4 sesiones quedó confirmado, junto con tu mes de Comunidad Next You. Te escribo por correo
            en los próximos días para coordinar tus horarios.
          </p>
        ) : (
          <p className="opacity-70">
            Tu sesión quedó reservada. Te llegará la confirmación con el enlace de la videollamada por correo.
          </p>
        )}
      </div>
    </main>
  );
}
