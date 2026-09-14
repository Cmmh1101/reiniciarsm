import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

// The only path to a product file. Never expose file_path directly — this looks up the purchase
// by its (unguessable, uuid) download_token, confirms it's a completed purchase, then mints a
// short-lived signed URL from the private 'product-files' bucket and redirects to it. A bad or
// unpaid token gets a 404, not a hint about what exists.
//
// Must never be cached: this does a live purchase check and mints a fresh 1-hour signed URL on
// every request. `dynamic = "force-dynamic"` plus a standard `Cache-Control: no-store` is NOT
// enough on Netlify — its "Durable" CDN tier was found (via direct testing) to cache this route's
// response keyed by pathname pattern only, ignoring the dynamic [token] segment, so every visitor
// got served whichever purchaser's redirect happened to populate the cache first. The
// Netlify-CDN-Cache-Control header talks directly to that tier and is required to bypass it.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE = {
  "Cache-Control": "no-store, must-revalidate",
  "Netlify-CDN-Cache-Control": "no-store",
};

export async function GET(request: Request, { params }: { params: { token: string } }) {
  const supabase = createSupabaseAdminClient();

  const { data: purchase, error: purchaseError } = await supabase
    .from("product_purchases")
    .select("id, status, download_count, product_id")
    .eq("download_token", params.token)
    .single();

  if (purchaseError || !purchase || purchase.status !== "completed") {
    return NextResponse.json({ error: "Enlace de descarga inválido o expirado." }, { status: 404, headers: NO_STORE });
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("file_path, file_name")
    .eq("id", purchase.product_id)
    .single();

  if (productError || !product) {
    console.error("download: product not found for purchase", purchase.id);
    return NextResponse.json({ error: "Archivo no encontrado." }, { status: 404, headers: NO_STORE });
  }

  const { data: signed, error: signError } = await supabase.storage
    .from("product-files")
    .createSignedUrl(product.file_path, 3600, { download: product.file_name });

  if (signError || !signed) {
    console.error("download: failed to create signed URL", signError);
    return NextResponse.json({ error: "No se pudo generar el enlace de descarga." }, { status: 500, headers: NO_STORE });
  }

  await supabase
    .from("product_purchases")
    .update({ download_count: purchase.download_count + 1, downloaded_at: new Date().toISOString() })
    .eq("id", purchase.id);

  return NextResponse.redirect(signed.signedUrl, { headers: NO_STORE });
}
