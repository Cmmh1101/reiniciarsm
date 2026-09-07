import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { recordMentoriaPayment } from "@/lib/mentoriaPayments";
import { MENTORIA_SESSION_PRODUCT, MENTORIA_PACK_PRODUCT } from "@/lib/pricing";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_PRODUCTS = [MENTORIA_SESSION_PRODUCT, MENTORIA_PACK_PRODUCT];
const VALID_METHODS = ["zelle", "paypal", "pago_movil", "otro"];

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const product = body?.product;
  const amountCents = Number(body?.amount_cents);
  const paymentMethod = body?.payment_method;
  const slotId = typeof body?.slot_id === "string" && body.slot_id ? body.slot_id : null;

  if (
    !name ||
    !EMAIL_RE.test(email) ||
    !VALID_PRODUCTS.includes(product) ||
    !VALID_METHODS.includes(paymentMethod) ||
    !Number.isFinite(amountCents) ||
    amountCents <= 0
  ) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  try {
    await recordMentoriaPayment({
      email,
      name,
      product,
      amountCents,
      paymentMethod,
      stripePaymentId: null,
      slotId,
    });
  } catch (err) {
    console.error("manual-payment: recordMentoriaPayment failed", err);
    return NextResponse.json({ error: "No se pudo registrar el pago." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
