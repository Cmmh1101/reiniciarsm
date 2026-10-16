import { NextResponse } from "next/server";
import { createStripeClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { MENTORIA_SESSION_PRICE_CENTS, MENTORIA_SESSION_PRODUCT, TECH_SOS_PRICE_CENTS, TECH_SOS_PRODUCT } from "@/lib/pricing";
import { checkoutLine, formatSlotLabel } from "@/lib/bookingCopy";
import { releaseSlot, reserveSlot } from "@/lib/mentorias";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const slotId = typeof body?.slot_id === "string" ? body.slot_id : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const locale = isLocale(body?.locale) ? body.locale : DEFAULT_LOCALE;
  const sessionType = body?.session_type === "sos" ? "sos" : "session";
  // Where to send the person if they cancel at checkout.
  const returnRoute = body?.source === "mentoring" ? "mentoring" : "workWithMe";

  if (!slotId || !name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: locale === "es" ? "Datos inválidos." : "Invalid details." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  // session_type exists once migration 0016 is applied; before that every slot is a regular session.
  const withType = await supabase.from("mentoria_slots").select("id, start_time, is_booked, session_type").eq("id", slotId).single();
  const slotResult = withType.error
    ? await supabase.from("mentoria_slots").select("id, start_time, is_booked").eq("id", slotId).single()
    : withType;
  const slot = slotResult.data as { id: string; start_time: string; is_booked: boolean; session_type?: string } | null;

  if (slotResult.error || !slot || slot.is_booked) {
    return NextResponse.json({ error: locale === "es" ? "Ese horario ya no está disponible." : "That time is no longer available." }, { status: 409 });
  }
  if ((slot.session_type ?? "session") !== sessionType) {
    return NextResponse.json({ error: locale === "es" ? "Ese horario no corresponde a este tipo de sesión." : "That time isn't available for this type of session." }, { status: 409 });
  }

  // Hold this time (and anything overlapping it) while the person pays, so nobody else can book it.
  if (!(await reserveSlot(slotId))) {
    return NextResponse.json({ error: locale === "es" ? "Ese horario ya no está disponible." : "That time is no longer available." }, { status: 409 });
  }

  const product = sessionType === "sos" ? TECH_SOS_PRODUCT : MENTORIA_SESSION_PRODUCT;
  const price = sessionType === "sos" ? TECH_SOS_PRICE_CENTS : MENTORIA_SESSION_PRICE_CENTS;
  const line = checkoutLine(locale, product, formatSlotLabel(locale, slot.start_time));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    const stripe = createStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale,
      customer_email: email,
      allow_promotion_codes: true,
      // Stripe's minimum is 30 minutes; the slot hold (35 min) outlasts it.
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: { name: line.name, description: line.description },
          },
          quantity: 1,
        },
      ],
      metadata: { product, slot_id: slotId, name, email, locale },
      success_url: `${siteUrl}${localizedPath(locale, "mentoringThanks")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${localizedPath(locale, returnRoute)}?canceled=1#book`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("booking-create: stripe checkout failed", err);
    await releaseSlot(slotId);
    return NextResponse.json({ error: locale === "es" ? "No se pudo iniciar el pago." : "We couldn't start the payment." }, { status: 500 });
  }
}
