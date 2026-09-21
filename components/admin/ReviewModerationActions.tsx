"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewModerationActions({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState<"approved" | "rejected" | null>(null);

  async function setStatus(status: "approved" | "rejected") {
    setSaving(status);
    try {
      await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setStatus("approved")}
        disabled={saving !== null}
        className="font-mono text-[10.5px] uppercase tracking-wide px-2.5 py-1 rounded-full border border-sage text-sage disabled:opacity-50"
      >
        {saving === "approved" ? "..." : "Aprobar"}
      </button>
      <button
        type="button"
        onClick={() => setStatus("rejected")}
        disabled={saving !== null}
        className="font-mono text-[10.5px] uppercase tracking-wide px-2.5 py-1 rounded-full border border-clay text-clay disabled:opacity-50"
      >
        {saving === "rejected" ? "..." : "Rechazar"}
      </button>
    </div>
  );
}
