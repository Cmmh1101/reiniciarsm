import { NextResponse } from "next/server";
import { submitReview } from "@/lib/productReviews";

const ERROR_MESSAGES: Record<string, string> = {
  not_found: "No encontramos esa compra.",
  already_reviewed: "Ya enviaste una reseña para esta compra — ¡gracias!",
  invalid_rating: "Selecciona una calificación de 1 a 5 estrellas.",
  server_error: "No se pudo guardar tu reseña, intenta de nuevo en un momento.",
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

  if (!purchaseId) {
    return NextResponse.json({ error: "Falta el identificador de la compra." }, { status: 400 });
  }

  const result = await submitReview({ purchaseId, rating, comment });
  if (!result.ok) {
    return NextResponse.json({ error: ERROR_MESSAGES[result.error] }, { status: ERROR_STATUS[result.error] });
  }

  return NextResponse.json({ ok: true });
}
