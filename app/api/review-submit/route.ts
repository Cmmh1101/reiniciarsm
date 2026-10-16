import { NextResponse } from "next/server";
import { submitReview } from "@/lib/productReviews";

const ERROR_MESSAGES = {
  es: {
    not_found: "No encontramos esa compra.",
    already_reviewed: "Ya enviaste una reseña para esta compra — ¡gracias!",
    invalid_rating: "Selecciona una calificación de 1 a 5 estrellas.",
    server_error: "No se pudo guardar tu reseña, intenta de nuevo en un momento.",
    missing_id: "Falta el identificador de la compra.",
  },
  en: {
    not_found: "We couldn't find that purchase.",
    already_reviewed: "You've already sent a review for this purchase — thank you!",
    invalid_rating: "Select a rating from 1 to 5 stars.",
    server_error: "We couldn't save your review, please try again in a moment.",
    missing_id: "The purchase identifier is missing.",
  },
};

const ERROR_STATUS: Record<string, number> = {
  not_found: 404,
  already_reviewed: 400,
  invalid_rating: 400,
  server_error: 500,
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const purchaseId = typeof body?.purchaseId === "string" ? body.purchaseId : "";
  const rating = typeof body?.rating === "number" ? body.rating : Number(body?.rating);
  const comment = typeof body?.comment === "string" ? body.comment : "";
  const messages = ERROR_MESSAGES[body?.locale === "en" ? "en" : "es"];

  if (!purchaseId) {
    return NextResponse.json({ error: messages.missing_id }, { status: 400 });
  }

  const result = await submitReview({ purchaseId, rating, comment });
  if (!result.ok) {
    return NextResponse.json({ error: messages[result.error] }, { status: ERROR_STATUS[result.error] });
  }

  return NextResponse.json({ ok: true });
}
