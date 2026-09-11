"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";

export default function ProductForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const priceCents = Math.round(parseFloat(price) * 100);
    if (!name.trim() || !slug.trim() || !priceCents || priceCents <= 0) {
      setError("Completa nombre, slug y un precio válido.");
      return;
    }
    if (!file) {
      setError("Sube el archivo del producto.");
      return;
    }

    setUploading(true);
    let filePath: string;
    let fileName: string;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/admin/upload-product-file", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? "No se pudo subir el archivo.");
      filePath = uploadData.filePath;
      fileName = uploadData.fileName;
    } catch (err) {
      setUploading(false);
      setError(err instanceof Error ? err.message : "No se pudo subir el archivo.");
      return;
    }
    setUploading(false);

    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim(), description: description.trim(), priceCents, filePath, fileName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo crear el producto.");
      router.push("/admin/productos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el producto.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="p-10 max-w-xl">
      <h1 className="font-display text-2xl mb-6">Nuevo producto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Nombre</span>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Slug (URL: /productos/{slug || "..."})</span>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className="font-mono text-sm px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Descripción</span>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="font-body text-sm px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] resize-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Precio (USD)</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="9.99"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] max-w-[160px]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Archivo del producto</span>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          {file && <span className="text-xs opacity-60">{file.name}</span>}
        </label>

        {error && <p className="text-clay text-sm">{error}</p>}

        <button
          type="submit"
          disabled={uploading || saving}
          className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay text-white self-start disabled:opacity-60"
        >
          {uploading ? "Subiendo archivo..." : saving ? "Guardando..." : "Crear producto"}
        </button>
      </form>
    </main>
  );
}
