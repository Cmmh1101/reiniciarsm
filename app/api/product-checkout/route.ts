import { NextResponse } from "next/server";
import { createStripeClient } from "@/lib/stripe";
import { getProductById } from "@/lib/products";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const productId = typeof body?.productId === "string" ? body.productId : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const product = await getProductById(productId);
  if (!product || !product.active) {
    return NextResponse.json({ error: "Producto no disponible." }, { status: 404 });
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
          unit_amount: product.price_cents,
          product_data: {
            name: product.name,
            ...(product.description ? { description: product.description } : {}),
          },
        },
        quantity: 1,
      },
    ],
    metadata: { type: "product", product_id: product.id, name, email },
    success_url: `${siteUrl}/productos/gracias?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/productos/${product.slug}?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
