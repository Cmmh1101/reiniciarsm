import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CONTENT_CACHE_TAG } from "@/lib/supabaseAdmin";
import { adminError } from "@/lib/admin/apiError";
import { guardAdminWrite } from "@/lib/adminRequest";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { PRODUCT_CATEGORIES } from "@/lib/taxonomy";

// Handles both the active/inactive toggle and full edits (name/slug/description/price, and
// optionally replacing the file). When filePath changes, the old file is deleted from storage
// after the DB update succeeds — never before, so a failed update can't strand a product
// pointing at a file that no longer exists.
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const denied = await guardAdminWrite(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return adminError(400, "Invalid request.", "Solicitud inválida.");
  }

  const supabase = createSupabaseAdminClient();

  // Simple toggle path (from the products list) — active is the only field sent.
  if (typeof body.active === "boolean" && Object.keys(body).length === 1) {
    const { error } = await supabase.from("products").update({ active: body.active }).eq("id", params.id);
    if (error) {
      console.error("PATCH /api/admin/products/[id] (toggle) failed", error);
      return adminError(500, "Couldn't update the product.", "No se pudo actualizar el producto.");
    }
    revalidateTag(CONTENT_CACHE_TAG);
    return NextResponse.json({ ok: true });
  }

  // Full edit path (from the edit form).
  const { name, nameEn, slug, description, descriptionEn, category, priceCents, filePath, fileName, imageUrl } = body;
  const nameEs = typeof name === "string" ? name.trim() : "";
  const nameEnglish = typeof nameEn === "string" ? nameEn.trim() : "";
  if ((!nameEs && !nameEnglish) || !slug || !priceCents || priceCents <= 0) {
    return adminError(400, "Fill in the name, slug and a valid price.", "Completa nombre, slug y un precio válido.");
  }
  if (!PRODUCT_CATEGORIES.includes(category)) {
    return adminError(400, "Invalid category.", "Categoría inválida.");
  }

  const { data: existing, error: existingError } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();
  if (existingError || !existing) {
    return adminError(404, "Product not found.", "Producto no encontrado.");
  }

  // English columns exist after migration 0021.
  const hasEnglishColumns = "name_en" in existing;
  if ((nameEnglish || (typeof descriptionEn === "string" && descriptionEn.trim())) && !hasEnglishColumns) {
    return adminError(400, "Run migration 0021 in Supabase to save English product text.", "Falta correr la migración 0021 en Supabase para guardar el texto del producto en inglés.");
  }

  const update: Record<string, unknown> = {
    // The original columns hold Spanish; an English-only product uses its English name there too.
    name: nameEs || nameEnglish,
    ...(hasEnglishColumns ? { name_en: nameEnglish || null, description_en: (typeof descriptionEn === "string" && descriptionEn.trim()) || null } : {}),
    slug,
    description: (typeof description === "string" && description.trim()) || (!nameEs && typeof descriptionEn === "string" && descriptionEn.trim()) || null,
    category,
    price_cents: priceCents,
    image_url: imageUrl || null,
  };
  const replacingFile = filePath && filePath !== existing.file_path;
  if (replacingFile) {
    update.file_path = filePath;
    update.file_name = fileName;
  }

  const { error: updateError } = await supabase.from("products").update(update).eq("id", params.id);
  if (updateError) {
    return updateError.code === "23505"
      ? adminError(400, "That slug already exists — choose another.", "Ese slug ya existe — elige otro.")
      : adminError(400, "Couldn't update the product.", "No se pudo actualizar el producto.");
  }

  if (replacingFile) {
    const { error: removeError } = await supabase.storage.from("product-files").remove([existing.file_path]);
    if (removeError) {
      // Not fatal — the product record is already correct and pointing at the new file. Just an
      // orphaned old file left in storage, worth knowing about but not worth failing the request.
      console.error("PATCH /api/admin/products/[id]: failed to remove old file", removeError);
    }
  }

  revalidateTag(CONTENT_CACHE_TAG);
  return NextResponse.json({ ok: true });
}
