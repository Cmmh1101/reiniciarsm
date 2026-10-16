import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { sendConfirmationEmail } from "@/lib/resend";
import { recordEmailSend } from "@/lib/emailTracking";
import { MENTORIA_PACK_PRODUCT, TECH_SOS_PRODUCT, isSlotProduct } from "@/lib/pricing";
import { formatSlotLabel, packConfirmationEmail, slotConfirmationEmail } from "@/lib/bookingCopy";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { buildGoogleCalendarLink } from "@/lib/googleCalendar";

/** Notification to Carla herself, alongside the customer's own confirmation email. */
async function notifyAdmin(subject: string, text: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;
  await sendConfirmationEmail(adminEmail, subject, text);
}

interface RecordPaymentInput {
  email: string;
  name: string;
  product: string;
  amountCents: number;
  paymentMethod: string; // 'stripe' | 'zelle' | 'paypal' | 'pago_movil' | 'otro'
  stripePaymentId: string | null;
  slotId?: string | null;
  locale?: Locale; // language of the customer-facing confirmation email
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
  locale = DEFAULT_LOCALE,
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

  if (isSlotProduct(product)) {
    const sos = product === TECH_SOS_PRODUCT;
    const serviceLabel = sos ? "Tech SOS (30 min)" : "Sesión 1:1 (60 min)";

    if (slotId) {
      // Atomic: only succeeds if the slot is still unbooked, guarding against
      // a race between checkout-session creation and the webhook (or, for a
      // manual entry, against picking a slot someone else just booked).
      const { data: updatedSlots } = await supabase
        .from("mentoria_slots")
        .update({ is_booked: true })
        .eq("id", slotId)
        .eq("is_booked", false)
        .select("id, start_time, duration_minutes");

      if (updatedSlots && updatedSlots.length > 0) {
        const slot = updatedSlots[0];
        await supabase.from("mentoria_bookings").insert({
          slot_id: slotId,
          contact_id: contact.id,
          stripe_payment_id: stripePaymentId,
          status: "confirmed",
        });

        const customerEmail = slotConfirmationEmail(locale, product, name, formatSlotLabel(locale, slot.start_time));
        const resendId = await sendConfirmationEmail(email, customerEmail.subject, customerEmail.text);
        await recordEmailSend({ resendId, contactId: contact.id, emailType: "transactional", subject: customerEmail.subject });

        // Carla's own notification stays in Spanish.
        const slotLabel = formatSlotLabel("es", slot.start_time);
        const calendarLink = buildGoogleCalendarLink({
          title: `${serviceLabel} — ${name}`,
          startISO: slot.start_time,
          durationMinutes: slot.duration_minutes ?? (sos ? 30 : 60),
          details: `${serviceLabel} con ${name} (${email}). Recuerda enviarle el enlace de la videollamada.`,
        });
        await notifyAdmin(
          `Nueva sesión reservada: ${serviceLabel} — ${name}`,
          `${name} (${email}) reservó ${serviceLabel} para el ${slotLabel}.\n\nMétodo de pago: ${paymentMethod} · $${(amountCents / 100).toFixed(2)} · Idioma: ${locale}\n\nAgregar a Google Calendar → ${calendarLink}`
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

    const customerEmail = packConfirmationEmail(locale, name);
    const resendId = await sendConfirmationEmail(email, customerEmail.subject, customerEmail.text);
    await recordEmailSend({ resendId, contactId: contact.id, emailType: "transactional", subject: customerEmail.subject });

    await notifyAdmin(
      `Nueva compra: Paquete de 4 sesiones — ${name}`,
      `${name} (${email}) compró el paquete de 4 sesiones 1:1 por $${(amountCents / 100).toFixed(2)} (${paymentMethod}). Idioma: ${locale}.\n\nEscríbele para coordinar horarios.`
    );
  }
}
