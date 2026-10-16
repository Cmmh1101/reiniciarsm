"use client";

import { useRef, useState } from "react";

/**
 * Image field with a preview: upload a file from the computer, replace it, or remove it. The URL
 * stays editable underneath for an image that already lives somewhere else.
 */
export default function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo subir la imagen.");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  const buttonClass = "font-mono text-xs px-3.5 py-2 rounded-[3px] border border-[rgba(20,25,43,0.25)] disabled:opacity-60";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold">{label}</span>

      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="w-full max-w-[420px] aspect-[16/9] object-cover rounded-[3px] border border-[rgba(20,25,43,0.15)]" />
      ) : (
        <div className="w-full max-w-[420px] aspect-[16/9] rounded-[3px] border border-dashed border-[rgba(20,25,43,0.25)] flex items-center justify-center text-xs font-mono opacity-50">
          Sin imagen
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className={buttonClass}>
          {uploading ? "Subiendo..." : value ? "Cambiar imagen" : "Subir imagen"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} disabled={uploading} className={buttonClass}>
            Quitar
          </button>
        )}
        <button type="button" onClick={() => setShowUrl((v) => !v)} className="font-mono text-xs opacity-60 hover:opacity-100 underline">
          {showUrl ? "Ocultar URL" : "Usar una URL"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>

      {showUrl && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="font-body text-sm px-3.5 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
        />
      )}
      <span className="text-xs opacity-50">PNG, JPG, WEBP o GIF, hasta 5MB.</span>
      {error && <p className="text-clay text-sm">{error}</p>}
    </div>
  );
}
