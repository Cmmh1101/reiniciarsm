import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { CONTACT_STATUSES } from "@/lib/contacts";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const status = body?.status;
  if (!CONTACT_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("contacts").update({ status }).eq("id", params.id);

  if (error) return NextResponse.json({ error: "No se pudo actualizar." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
