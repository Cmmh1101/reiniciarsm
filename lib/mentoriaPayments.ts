import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { sendConfirmationEmail } from "@/lib/resend";
import { MENTORIA_SESSION_PRODUCT, MENTORIA_PACK_PRODUCT } from "@/lib/pricing";

interface RecordPaymentInput {
  email: string;
  name: string;
  product: string;
  amountCents: number;
  paymentMethod: string; // 'stripe' | 'zelle' | 'paypal' | 'pago_movil' | 'otro'
  stripePaymentId: string | null;
  slotId?: string | null;
}

/**
 * Shared by the Stripe webhook and the admin manual-payment form — same
 * contact/payment/booking/email logic regardless of how the money arrived.
 */
export async function recordMentoriaPayment({
  email,
  name,
  product,
  amountCents,
  paymentMethod,
  stripePaymentId,
  slotId,
}: RecordPaymentInput) {
  const supabase = createSupabaseAdminClient();

  const { data: contact, error: contactError } = await supabase
    .from("contacts")
    .upsert({ email, name }, { onConflict: "email", ignoreDuplicates: false })
    .select("id")
    .single();

  if (contactError || !contact) {
    console.error("recordMentoriaPayment: failed to upsert contact", contactError);
    throw new Error("Failed to record contact");
  }

  await supabase.from("stripe_payments").insert({
    contact_id: contact.id,
    amount_cents: amountCents,
    product,
    stripe_payment_id: stripePaymentId,
    payment_method: paymentMethod,
    status: "completed",
  });

  if (product === MENTORIA_SESSION_PRODUCT) {
    if (slotId) {
      // Atomic: only succeeds if the slot is still unbooked, guarding against
      // a race between checkout-session creation and the webhook (or, for a
      // manual entry, against picking a slot someone else just booked).
      const { data: updatedSlots } = await supabase
        .from("mentoria_slots")
        .update({ is_booked: true })
        .eq("id", slotId)
        .eq("is_booked", false)
        .select("id, start_time");

      if (updatedSlots && updatedSlots.length > 0) {
        await supabase.from("mentoria_bookings").insert({
          slot_id: slotId,
          contact_id: contact.id,
          stripe_payment_id: stripePaymentId,
          status: "confirmed",
        });

        const slotLabel = new Date(updatedSlots[0].start_time).toLocaleString("es", {
          timeZone: "America/Caracas",
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
        });
        await sendConfirmationEmail(
          email,
          "Confirmación de tu sesión — Mentoría Next You",
          `Hola ${name},\n\nConfirmamos tu sesión el ${slotLabel} — te comparto el enlace de Google Meet antes de la sesión.\n\n¿Necesitas reagendar? Escríbeme a hello@carlamontano.io.\n\nNos vemos pronto,\nCarla`
        );
      } else {
        console.error("recordMentoriaPayment: slot already booked at payment time", slotId);
      }
    }

    await supabase.from("contact_events").insert({
      contact_id: contact.id,
      event_type: "booking_created",
      metadata: { product, slot_id: slotId ?? null, stripe_payment_id: stripePaymentId, payment_method: paymentMethod },
    });
  } else if (product === MENTORIA_PACK_PRODUCT) {
    await supabase.from("contact_events").insert({
      contact_id: contact.id,
      event_type: "payment_completed",
      metadata: { product, stripe_payment_id: stripePaymentId, payment_method: paymentMethod, includes: "1 mes de Comunidad Next You" },
    });

    await sendConfirmationEmail(
      email,
      "Confirmación de tu paquete de 4 sesiones — Mentoría Next You",
      `Hola ${name},\n\n¡Gracias por tu compra! Confirmamos tu paquete de 4 sesiones de Mentoría Next You, que incluye 1 mes de membresía Comunidad Next You de regalo.\n\nTe escribo pronto para coordinar tus horarios.\n\nSaludos,\nCarla`
    );
  }
}
