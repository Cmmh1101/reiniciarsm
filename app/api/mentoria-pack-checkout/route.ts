import { NextResponse } from "next/server";
import { createStripeClient } from "@/lib/stripe";
import { MENTORIA_PACK_PRICE_CENTS, MENTORIA_PACK_PRODUCT } from "@/lib/pricing";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const stripe = createStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    allow_promotion_codes: true,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: MENTORIA_PACK_PRICE_CENTS,
          product_data: {
            name: "Mentoría Next You — Paquete de 4 sesiones (60 min c/u)",
            description: "Incluye 1 mes de membresía Comunidad Next You de regalo.",
          },
        },
        quantity: 1,
      },
    ],
    metadata: { product: MENTORIA_PACK_PRODUCT, name, email },
    success_url: `${siteUrl}/mentorias/gracias?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/mentorias?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
