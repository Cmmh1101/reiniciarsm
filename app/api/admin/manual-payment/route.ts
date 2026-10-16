import { NextResponse } from "next/server";
import { adminError } from "@/lib/admin/apiError";
import { guardAdminWrite } from "@/lib/adminRequest";
import { recordMentoriaPayment } from "@/lib/mentoriaPayments";
import { MENTORIA_SESSION_PRODUCT, MENTORIA_PACK_PRODUCT, TECH_SOS_PRODUCT } from "@/lib/pricing";
import { isLocale } from "@/lib/i18n/config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_PRODUCTS = [MENTORIA_SESSION_PRODUCT, MENTORIA_PACK_PRODUCT, TECH_SOS_PRODUCT];
const VALID_METHODS = ["zelle", "paypal", "pago_movil", "otro"];

export async function POST(request: Request) {
  const denied = await guardAdminWrite(request);
  if (denied) return denied;

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
    return adminError(400, "Invalid details.", "Datos inválidos.");
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
      locale: isLocale(body?.locale) ? body.locale : undefined,
    });
  } catch (err) {
    console.error("manual-payment: recordMentoriaPayment failed", err);
    return adminError(500, "Couldn't record the payment.", "No se pudo registrar el pago.");
  }

  return NextResponse.json({ ok: true });
}
