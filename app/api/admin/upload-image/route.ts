import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Formato no soportado. Usa PNG, JPEG, WEBP o GIF." }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "La imagen supera el límite de 5MB." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const ext = file.name.split(".").pop() || "png";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("newsletter-images")
    .upload(path, await file.arrayBuffer(), { contentType: file.type });

  if (uploadError) {
    console.error("upload-image: upload failed", uploadError);
    return NextResponse.json({ error: "No se pudo subir la imagen." }, { status: 500 });
  }

  const { data } = supabase.storage.from("newsletter-images").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
