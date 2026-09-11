import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100MB — generous for a PDF/ebook/small course zip

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "El archivo supera el límite de 100MB." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
  const path = `${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

  const { error: uploadError } = await supabase.storage
    .from("product-files")
    .upload(path, await file.arrayBuffer(), { contentType: file.type || "application/octet-stream" });

  if (uploadError) {
    console.error("upload-product-file: upload failed", uploadError);
    return NextResponse.json({ error: "No se pudo subir el archivo." }, { status: 500 });
  }

  return NextResponse.json({ filePath: path, fileName: file.name });
}
