import { NextResponse } from "next/server";
import { adminError } from "@/lib/admin/apiError";
import { guardAdminWrite } from "@/lib/adminRequest";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const denied = await guardAdminWrite(request);
  if (denied) return denied;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return adminError(400, "No file was received.", "No se recibió ningún archivo.");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return adminError(400, "Unsupported format. Use PNG, JPEG, WEBP or GIF.", "Formato no soportado. Usa PNG, JPEG, WEBP o GIF.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    return adminError(400, "The image is over the 5MB limit.", "La imagen supera el límite de 5MB.");
  }

  const supabase = createSupabaseAdminClient();
  const ext = file.name.split(".").pop() || "png";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("newsletter-images")
    .upload(path, await file.arrayBuffer(), { contentType: file.type });

  if (uploadError) {
    console.error("upload-image: upload failed", uploadError);
    return adminError(500, "Couldn't upload the image.", "No se pudo subir la imagen.");
  }

  const { data } = supabase.storage.from("newsletter-images").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
