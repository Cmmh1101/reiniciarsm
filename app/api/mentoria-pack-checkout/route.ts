import { NextResponse } from "next/server";
import { createStripeClient } from "@/lib/stripe";
import { MENTORIA_PACK_PRICE_CENTS, MENTORIA_PACK_PRODUCT } from "@/lib/pricing";
import { checkoutLine } from "@/lib/bookingCopy";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const locale = isLocale(body?.locale) ? body.locale : DEFAULT_LOCALE;
  const returnRoute = body?.source === "mentoring" ? "mentoring" : "workWithMe";

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: locale === "es" ? "Datos inválidos." : "Invalid details." }, { status: 400 });
  }

  const line = checkoutLine(locale, MENTORIA_PACK_PRODUCT);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const stripe = createStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    locale,
    customer_email: email,
    allow_promotion_codes: true,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: MENTORIA_PACK_PRICE_CENTS,
          product_data: { name: line.name, description: line.description },
        },
        quantity: 1,
      },
    ],
    metadata: { product: MENTORIA_PACK_PRODUCT, name, email, locale },
    success_url: `${siteUrl}${localizedPath(locale, "mentoringThanks")}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}${localizedPath(locale, returnRoute)}?canceled=1#book`,
  });

  return NextResponse.json({ url: session.url });
}
