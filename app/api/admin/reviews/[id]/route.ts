import { NextResponse } from "next/server";
import { adminError } from "@/lib/admin/apiError";
import { guardAdminWrite } from "@/lib/adminRequest";
import { setReviewStatus } from "@/lib/productReviews";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const denied = await guardAdminWrite(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const status = body?.status;
  if (status !== "approved" && status !== "rejected") {
    return adminError(400, "Invalid status.", "Estado inválido.");
  }

  const ok = await setReviewStatus(params.id, status);
  if (!ok) return adminError(500, "Couldn't update the review.", "No se pudo actualizar la reseña.");

  return NextResponse.json({ ok: true });
}
