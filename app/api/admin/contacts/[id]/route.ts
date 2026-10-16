import { NextResponse } from "next/server";
import { adminError } from "@/lib/admin/apiError";
import { guardAdminWrite } from "@/lib/adminRequest";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { CONTACT_STATUSES } from "@/lib/contacts";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const denied = await guardAdminWrite(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const update: Record<string, string> = {};

  if (body?.status !== undefined) {
    if (!CONTACT_STATUSES.includes(body.status)) return adminError(400, "Invalid status.", "Estado inválido.");
    update.status = body.status;
  }
  if (body?.preferred_language !== undefined) {
    if (body.preferred_language !== "en" && body.preferred_language !== "es") return adminError(400, "Invalid language.", "Idioma inválido.");
    update.preferred_language = body.preferred_language;
  }
  if (Object.keys(update).length === 0) return adminError(400, "Nothing to update.", "Nada que actualizar.");

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("contacts").update(update).eq("id", params.id);

  if (error) return adminError(500, "Couldn't update.", "No se pudo actualizar.");
  return NextResponse.json({ ok: true });
}
