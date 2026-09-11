"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";
import { uploadProductFile } from "@/lib/uploadProductFile";
import type { Product } from "@/lib/products";
import { PRODUCT_CATEGORIES } from "@/lib/taxonomy";

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(product?.description ?? "");
  const [category, setCategory] = useState(product?.category ?? PRODUCT_CATEGORIES[0]);
  const [price, setPrice] = useState(product ? (product.price_cents / 100).toFixed(2) : "");
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
    if (!isEdit && !file) {
      setError("Sube el archivo del producto.");
      return;
    }

    let filePath: string | undefined;
    let fileName: string | undefined;
    if (file) {
      setUploading(true);
      try {
        const uploaded = await uploadProductFile(file);
        filePath = uploaded.filePath;
        fileName = uploaded.fileName;
      } catch (err) {
        setUploading(false);
        setError(err instanceof Error ? err.message : "No se pudo subir el archivo.");
        return;
      }
      setUploading(false);
    }

    setSaving(true);
    try {
      const payload = { name: name.trim(), slug: slug.trim(), description: description.trim(), category, priceCents, filePath, fileName };
      const res = await fetch(isEdit ? `/api/admin/products/${product.id}` : "/api/admin/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo guardar el producto.");
      router.push("/admin/productos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el producto.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="p-10 max-w-xl">
      <h1 className="font-display text-2xl mb-6">{isEdit ? "Editar producto" : "Nuevo producto"}</h1>
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
          <span>Categoría</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] max-w-[200px] bg-white"
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
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
          <span>{isEdit ? "Reemplazar archivo (opcional)" : "Archivo del producto"}</span>
          {isEdit && product && (
            <span className="text-xs opacity-60 font-normal">Archivo actual: {product.file_name}</span>
          )}
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
          {file && <span className="text-xs opacity-60">Nuevo: {file.name}</span>}
        </label>

        {error && <p className="text-clay text-sm">{error}</p>}

        <button
          type="submit"
          disabled={uploading || saving}
          className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay text-white self-start disabled:opacity-60"
        >
          {uploading ? "Subiendo archivo..." : saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
      </form>
    </main>
  );
}
