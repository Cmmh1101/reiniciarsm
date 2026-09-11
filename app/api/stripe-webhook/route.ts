import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createStripeClient } from "@/lib/stripe";
import { recordMentoriaPayment } from "@/lib/mentoriaPayments";
import { recordProductPurchase } from "@/lib/productPurchases";

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
  const paymentId = typeof session.payment_intent === "string" ? session.payment_intent : session.id;

  if (!email) {
    console.error("stripe-webhook: missing email in session metadata", session.id);
    return NextResponse.json({ received: true });
  }

  // Dispatch by purchase type — digital products (metadata.type === "product") vs. the original
  // mentoría flow, which predates this field and so has no explicit type of its own.
  if (metadata.type === "product") {
    if (!metadata.product_id) {
      console.error("stripe-webhook: product checkout missing product_id", session.id);
      return NextResponse.json({ received: true });
    }
    try {
      await recordProductPurchase({
        email,
        name,
        productId: metadata.product_id,
        amountCents: session.amount_total ?? 0,
        stripePaymentId: paymentId,
      });
    } catch (err) {
      console.error("stripe-webhook: recordProductPurchase failed", err);
      return NextResponse.json({ error: "Failed to record purchase" }, { status: 500 });
    }
    return NextResponse.json({ received: true });
  }

  const product = metadata.product;
  if (!product) {
    console.error("stripe-webhook: missing product in session metadata", session.id);
    return NextResponse.json({ received: true });
  }

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
