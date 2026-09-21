import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { setReviewStatus } from "@/lib/productReviews";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const status = body?.status;
  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }

  const ok = await setReviewStatus(params.id, status);
  if (!ok) return NextResponse.json({ error: "No se pudo actualizar la reseña." }, { status: 500 });

  return NextResponse.json({ ok: true });
}
