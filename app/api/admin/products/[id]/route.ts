import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

// Only toggling `active` for now — enough to retire an old product when a new one replaces it,
// without needing a full edit form yet.
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (typeof body?.active !== "boolean") {
    return NextResponse.json({ error: "Falta el campo 'active'." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("products").update({ active: body.active }).eq("id", params.id);

  if (error) {
    console.error("PATCH /api/admin/products/[id] failed", error);
    return NextResponse.json({ error: "No se pudo actualizar el producto." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
