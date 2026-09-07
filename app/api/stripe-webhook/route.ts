import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createStripeClient } from "@/lib/stripe";
import { recordMentoriaPayment } from "@/lib/mentoriaPayments";

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

  const paymentId = typeof session.payment_intent === "string" ? session.payment_intent : session.id;

  try {
    await recordMentoriaPayment({
      email,
      name,
      product,
      amountCents: session.amount_total ?? 0,
      paymentMethod: "stripe",
      stripePaymentId: paymentId,
      slotId: metadata.slot_id ?? null,
    });
  } catch (err) {
    console.error("stripe-webhook: recordMentoriaPayment failed", err);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
