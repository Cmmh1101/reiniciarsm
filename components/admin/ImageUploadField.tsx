"use client";

import { useRef, useState } from "react";
import { useAdminI18n } from "@/components/admin/AdminI18n";

/**
 * Image field with a preview: upload a file from the computer, replace it, or remove it. The URL
 * stays editable underneath for an image that already lives somewhere else.
 */
export default function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const { t: all } = useAdminI18n();
  const t = all.imageField;
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
      if (!res.ok) throw new Error(data.error ?? t.uploadFailed);
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.uploadFailed);
    } finally {
      setUploading(false);
    }
  }

  const buttonClass = "font-mono text-xs px-3.5 py-2 rounded-[3px] border border-[rgba(20,25,43,0.25)] disabled:opacity-70";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold">{label}</span>

      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="w-full max-w-[420px] aspect-[16/9] object-cover rounded-[3px] border border-[rgba(20,25,43,0.15)]" />
      ) : (
        <div className="w-full max-w-[420px] aspect-[16/9] rounded-[3px] border border-dashed border-[rgba(20,25,43,0.25)] flex items-center justify-center text-xs font-mono opacity-70">
          {t.none}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className={buttonClass}>
          {uploading ? t.uploading : value ? t.change : t.upload}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} disabled={uploading} className={buttonClass}>
            {t.remove}
          </button>
        )}
        <button type="button" onClick={() => setShowUrl((v) => !v)} className="font-mono text-xs opacity-70 hover:opacity-100 underline">
          {showUrl ? t.hideUrl : t.useUrl}
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
      <span className="text-xs opacity-70">{t.help}</span>
      {error && <p className="text-clay-deep text-sm">{error}</p>}
    </div>
  );
}
