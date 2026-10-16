import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { CONTACT_STATUSES } from "@/lib/contacts";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const update: Record<string, string> = {};

  if (body?.status !== undefined) {
    if (!CONTACT_STATUSES.includes(body.status)) return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
    update.status = body.status;
  }
  if (body?.preferred_language !== undefined) {
    if (body.preferred_language !== "en" && body.preferred_language !== "es") return NextResponse.json({ error: "Idioma inválido." }, { status: 400 });
    update.preferred_language = body.preferred_language;
  }
  if (Object.keys(update).length === 0) return NextResponse.json({ error: "Nada que actualizar." }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("contacts").update(update).eq("id", params.id);

  if (error) return NextResponse.json({ error: "No se pudo actualizar." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
