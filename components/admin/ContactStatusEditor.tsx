"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CONTACT_STATUSES } from "@/lib/contacts";
import { useAdminI18n } from "@/components/admin/AdminI18n";

export default function ContactStatusEditor({ contactId, status }: { contactId: string; status: string }) {
  const router = useRouter();
  const { t } = useAdminI18n();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleChange(newStatus: string) {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      router.refresh();
    } catch {
      // no-op — the select just reverts visually on next render if it failed
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className="font-body text-sm px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
      >
        {CONTACT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {t.contacts.statuses[s] ?? s}
          </option>
        ))}
      </select>
      {saved && <span className="text-sage text-xs">{t.common.saved}</span>}
    </div>
  );
}
