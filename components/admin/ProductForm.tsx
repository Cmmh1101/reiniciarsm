"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";
import { uploadProductFile } from "@/lib/uploadProductFile";
import type { Product } from "@/lib/products";
import { PRODUCT_CATEGORIES } from "@/lib/taxonomy";
import { useAdminI18n } from "@/components/admin/AdminI18n";
import { fmt } from "@/lib/admin/dictionary";

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { t: all } = useAdminI18n();
  const t = all.products.form;
  const isEdit = !!product;

  type Lang = "en" | "es";
  const LANG_LABEL: Record<Lang, string> = { en: all.common.english, es: all.common.spanish };
  // The original columns hold Spanish; the English text lives in name_en / description_en.
  const [names, setNames] = useState<Record<Lang, string>>({ es: product?.name ?? "", en: product?.name_en ?? "" });
  const [descriptions, setDescriptions] = useState<Record<Lang, string>>({ es: product?.description ?? "", en: product?.description_en ?? "" });
  const [lang, setLang] = useState<Lang>(product && !product.name_en ? "es" : "en");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [category, setCategory] = useState(product?.category ?? PRODUCT_CATEGORIES[0]);
  const [price, setPrice] = useState(product ? (product.price_cents / 100).toFixed(2) : "");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleImageChange(selected: File | null) {
    if (!selected) return;
    setUploadingImage(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", selected);
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t.errorImage);
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorImage);
    } finally {
      setUploadingImage(false);
    }
  }

  function handleNameChange(value: string) {
    setNames((prev) => ({ ...prev, [lang]: value }));
    // The URL follows the first name typed (English preferred), until the slug is edited by hand.
    if (!slugTouched && (lang === "en" || !names.en)) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const priceCents = Math.round(parseFloat(price) * 100);
    if ((!names.es.trim() && !names.en.trim()) || !slug.trim() || !priceCents || priceCents <= 0) {
      setError(t.errorFields);
      return;
    }
    if (!isEdit && !file) {
      setError(t.errorFile);
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
        setError(err instanceof Error ? err.message : t.errorUpload);
        return;
      }
      setUploading(false);
    }

    setSaving(true);
    try {
      const payload = {
        name: names.es.trim(),
        nameEn: names.en.trim(),
        slug: slug.trim(),
        description: descriptions.es.trim(),
        descriptionEn: descriptions.en.trim(),
        category,
        priceCents,
        filePath,
        fileName,
        imageUrl: imageUrl || null,
      };
      const res = await fetch(isEdit ? `/api/admin/products/${product.id}` : "/api/admin/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t.errorSave);
      router.push("/admin/productos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorSave);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="p-10 max-w-xl">
      <h1 className="font-display text-2xl mb-6">{isEdit ? t.editTitle : t.newTitle}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div role="tablist" aria-label={t.languageTabs} className="flex gap-2">
          {(["en", "es"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={lang === l}
              onClick={() => setLang(l)}
              className={`font-mono text-xs px-4 py-2.5 rounded-[3px] border ${
                lang === l ? "bg-ink text-paper border-ink" : "bg-paper-soft border-[rgba(20,25,43,0.15)]"
              }`}
            >
              {LANG_LABEL[l]}
              {l !== lang && !names[l].trim() && <span className="opacity-70"> {fmt(t.emptyUse, { other: l === "es" ? LANG_LABEL.en : LANG_LABEL.es })}</span>}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>{fmt(t.name, { lang: LANG_LABEL[lang] })}</span>
          <input
            value={names[lang]}
            onChange={(e) => handleNameChange(e.target.value)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>{fmt(t.slug, { slug: slug || "..." })}</span>
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
          <span>{fmt(t.description, { lang: LANG_LABEL[lang] })}</span>
          <textarea
            rows={4}
            value={descriptions[lang]}
            onChange={(e) => setDescriptions((prev) => ({ ...prev, [lang]: e.target.value }))}
            className="font-body text-sm px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] resize-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>{t.category}</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] max-w-[200px] bg-white"
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {all.products.categories[c] ?? c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>{t.price}</span>
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
          <span>{t.image}</span>
          <span className="text-xs opacity-70 font-normal">
            {t.imageHelp}
          </span>
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="w-full max-w-[280px] rounded-[3px] border border-[rgba(20,25,43,0.12)] mt-1" />
          )}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          {uploadingImage && <span className="text-xs opacity-70">{t.uploadingImage}</span>}
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>{isEdit ? t.replaceFile : t.file}</span>
          {isEdit && product && (
            <span className="text-xs opacity-70 font-normal">{fmt(t.currentFile, { name: product.file_name })}</span>
          )}
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
          {file && <span className="text-xs opacity-70">{fmt(t.newFile, { name: file.name })}</span>}
        </label>

        {error && <p className="text-clay-deep text-sm">{error}</p>}

        <button
          type="submit"
          disabled={uploading || uploadingImage || saving}
          className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay-deep text-white self-start disabled:opacity-70"
        >
          {uploading ? t.uploadingFile : saving ? all.common.saving : isEdit ? t.saveChanges : t.create}
        </button>
      </form>
    </main>
  );
}
