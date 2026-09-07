import { NextResponse } from "next/server";
import { createStripeClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { MENTORIA_SESSION_PRICE_CENTS, MENTORIA_SESSION_PRODUCT } from "@/lib/pricing";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const slotId = typeof body?.slot_id === "string" ? body.slot_id : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!slotId || !name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: slot, error: slotError } = await supabase
    .from("mentoria_slots")
    .select("id, start_time, is_booked")
    .eq("id", slotId)
    .single();

  if (slotError || !slot || slot.is_booked) {
    return NextResponse.json({ error: "Ese horario ya no está disponible." }, { status: 409 });
  }

  const slotLabel = new Date(slot.start_time).toLocaleString("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

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
          unit_amount: MENTORIA_SESSION_PRICE_CENTS,
          product_data: {
            name: "Mentoría Next You — Sesión 1:1 (60 min)",
            description: `Sesión online por Google Meet — ${slotLabel}.`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { product: MENTORIA_SESSION_PRODUCT, slot_id: slotId, name, email },
    success_url: `${siteUrl}/mentorias/gracias?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/mentorias?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
