import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

// Netlify Functions (which is what a Next.js API route becomes here) reject request bodies over
// ~6MB before our code even runs — a real ebook/course zip blows past that easily. So the actual
// file bytes never touch our server: this route only mints a short-lived signed *upload* URL
// (admin-gated, using the service role key), and the browser PUTs the file straight to Supabase
// Storage with it. No Supabase key of any kind reaches the browser — the returned URL already
// has its one-time token embedded and is scoped to this exact path.
export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const fileName = typeof body?.fileName === "string" ? body.fileName : "";
  if (!fileName) {
    return NextResponse.json({ error: "Falta el nombre del archivo." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const ext = fileName.includes(".") ? fileName.split(".").pop() : "";
  const path = `${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

  const { data, error } = await supabase.storage.from("product-files").createSignedUploadUrl(path);

  if (error || !data) {
    console.error("product-file-upload-url: failed to create signed upload URL", error);
    return NextResponse.json({ error: "No se pudo preparar la subida." }, { status: 500 });
  }

  return NextResponse.json({ uploadUrl: data.signedUrl, filePath: data.path });
}
