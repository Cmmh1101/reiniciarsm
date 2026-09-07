import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createStripeClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { MENTORIA_SESSION_PRODUCT, MENTORIA_PACK_PRODUCT } from "@/lib/pricing";
import { sendConfirmationEmail } from "@/lib/resend";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    const stripe = createStripeClient();
    event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("stripe-webhook: signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const metadata = session.metadata ?? {};
  const email = (metadata.email ?? session.customer_details?.email ?? "").toLowerCase();
  const name = metadata.name ?? session.customer_details?.name ?? "";
  const product = metadata.product;

  if (!email || !product) {
    console.error("stripe-webhook: missing email or product in session metadata", session.id);
    return NextResponse.json({ received: true });
  }

  const supabase = createSupabaseAdminClient();

  const { data: contact, error: contactError } = await supabase
    .from("contacts")
    .upsert({ email, name }, { onConflict: "email", ignoreDuplicates: false })
    .select("id")
    .single();

  if (contactError || !contact) {
    console.error("stripe-webhook: failed to upsert contact", contactError);
    return NextResponse.json({ error: "Failed to record contact" }, { status: 500 });
  }

  const paymentId = typeof session.payment_intent === "string" ? session.payment_intent : session.id;

  await supabase.from("stripe_payments").insert({
    contact_id: contact.id,
    amount_cents: session.amount_total ?? 0,
    product,
    stripe_payment_id: paymentId,
    status: "completed",
  });

  if (product === MENTORIA_SESSION_PRODUCT) {
    const slotId = metadata.slot_id;
    if (slotId) {
      // Atomic: only succeeds if the slot is still unbooked, guarding against a race
      // between checkout-session creation and this webhook.
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
          stripe_payment_id: paymentId,
          status: "confirmed",
        });

        const slotLabel = new Date(updatedSlots[0].start_time).toLocaleString("es", {
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
        console.error("stripe-webhook: slot already booked at payment time", slotId, session.id);
      }
    }

    await supabase.from("contact_events").insert({
      contact_id: contact.id,
      event_type: "booking_created",
      metadata: { product, slot_id: slotId ?? null, stripe_payment_id: paymentId },
    });
  } else if (product === MENTORIA_PACK_PRODUCT) {
    await supabase.from("contact_events").insert({
      contact_id: contact.id,
      event_type: "payment_completed",
      metadata: { product, stripe_payment_id: paymentId, includes: "1 mes de Comunidad Next You" },
    });

    await sendConfirmationEmail(
      email,
      "Confirmación de tu paquete de 4 sesiones — Mentoría Next You",
      `Hola ${name},\n\n¡Gracias por tu compra! Confirmamos tu paquete de 4 sesiones de Mentoría Next You, que incluye 1 mes de membresía Comunidad Next You de regalo.\n\nTe escribo pronto para coordinar tus horarios.\n\nSaludos,\nCarla`
    );
  }

  return NextResponse.json({ received: true });
}
