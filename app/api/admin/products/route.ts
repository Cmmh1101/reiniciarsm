import { NextResponse } from "next/server";
import { adminError } from "@/lib/admin/apiError";
import { guardAdminWrite } from "@/lib/adminRequest";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { PRODUCT_CATEGORIES } from "@/lib/taxonomy";

export async function POST(request: Request) {
  const denied = await guardAdminWrite(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const { name, slug, description, category, priceCents, filePath, fileName, imageUrl } = body ?? {};

  if (!name || !slug || !priceCents || !filePath || !fileName) {
    return adminError(400, "Required fields are missing.", "Faltan campos requeridos.");
  }
  if (typeof priceCents !== "number" || priceCents <= 0) {
    return adminError(400, "The price must be above zero.", "El precio debe ser mayor que cero.");
  }
  if (!PRODUCT_CATEGORIES.includes(category)) {
    return adminError(400, "Invalid category.", "Categoría inválida.");
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description: description || null,
      category,
      price_cents: priceCents,
      file_path: filePath,
      file_name: fileName,
      image_url: imageUrl || null,
    })
    .select()
    .single();

  if (error) {
    return error.code === "23505"
      ? adminError(400, "That slug already exists — choose another.", "Ese slug ya existe — elige otro.")
      : adminError(400, "Couldn't create the product.", "No se pudo crear el producto.");
  }

  return NextResponse.json(data);
}
