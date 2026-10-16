"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// The language this person is emailed in (welcome sequence, purchase and review emails).
export default function ContactLanguageEditor({ contactId, language }: { contactId: string; language: "en" | "es" }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleChange(next: string) {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferred_language: next }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      router.refresh();
    } catch {
      // no-op — the select reverts on the next render if it failed
    } finally {
      setSaving(false);
    }
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="opacity-60">Idioma</span>
      <select
        defaultValue={language}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className="font-body text-sm px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
      >
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>
      {saved && <span className="text-sage text-xs">Guardado</span>}
    </label>
  );
}
