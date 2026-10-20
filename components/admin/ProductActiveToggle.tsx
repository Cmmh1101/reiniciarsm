"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminI18n } from "@/components/admin/AdminI18n";

export default function ProductActiveToggle({ productId, active }: { productId: string; active: boolean }) {
  const router = useRouter();
  const { t } = useAdminI18n();
  const [saving, setSaving] = useState(false);

  async function toggle() {
    setSaving(true);
    try {
      await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={saving}
      className={`font-mono text-[10.5px] uppercase tracking-wide px-2.5 py-1 rounded-full border disabled:opacity-70 ${
        active ? "border-sage text-sage-deep" : "border-[rgba(20,25,43,0.2)] opacity-70"
      }`}
    >
      {active ? t.products.active : t.products.inactive}
    </button>
  );
}
