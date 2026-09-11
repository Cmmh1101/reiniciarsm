import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { PRODUCT_CATEGORIES } from "@/lib/taxonomy";

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { name, slug, description, category, priceCents, filePath, fileName } = body ?? {};

  if (!name || !slug || !priceCents || !filePath || !fileName) {
    return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
  }
  if (typeof priceCents !== "number" || priceCents <= 0) {
    return NextResponse.json({ error: "El precio debe ser mayor que cero." }, { status: 400 });
  }
  if (!PRODUCT_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Categoría inválida." }, { status: 400 });
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
    })
    .select()
    .single();

  if (error) {
    const message = error.code === "23505" ? "Ese slug ya existe — elige otro." : "No se pudo crear el producto.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json(data);
}
