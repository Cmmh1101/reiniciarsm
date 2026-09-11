"use client";

// Two-step upload used by the product create/edit forms: ask our server (admin-gated) for a
// short-lived signed upload URL, then PUT the file straight to Supabase Storage with it — the
// actual file bytes never pass through our own server, which matters because Netlify Functions
// reject request bodies over ~6MB before our code even runs. Verified against the real Supabase
// project (see git history) that no Supabase key of any kind is needed for the PUT itself — the
// signed URL's embedded token is the entire authorization.
export async function uploadProductFile(file: File): Promise<{ filePath: string; fileName: string }> {
  const urlRes = await fetch("/api/admin/product-file-upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name }),
  });
  const urlData = await urlRes.json();
  if (!urlRes.ok) throw new Error(urlData.error ?? "No se pudo preparar la subida.");

  const formData = new FormData();
  formData.append("cacheControl", "3600");
  formData.append("", file);

  const uploadRes = await fetch(urlData.uploadUrl, {
    method: "PUT",
    headers: { "x-upsert": "false" },
    body: formData,
  });
  if (!uploadRes.ok) {
    throw new Error("No se pudo subir el archivo.");
  }

  return { filePath: urlData.filePath, fileName: file.name };
}
