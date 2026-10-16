"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminI18n } from "@/components/admin/AdminI18n";
import { fmt } from "@/lib/admin/dictionary";

export default function GA4SyncButton() {
  const router = useRouter();
  const { t: all } = useAdminI18n();
  const t = all.analytics;
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [lastResult, setLastResult] = useState<string | null>(null);

  async function handleSync() {
    setSyncing(true);
    setError("");
    setLastResult(null);
    try {
      const res = await fetch("/api/admin/ga4-sync", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t.syncFailed);
      setLastResult(fmt(t.syncResult, { date: data.date, sessions: data.stats.sessions, views: data.stats.pageViews }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.syncFailed);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={handleSync}
        disabled={syncing}
        className="font-body font-semibold text-sm px-4 py-2.5 rounded-[3px] border border-ink self-start disabled:opacity-60"
      >
        {syncing ? t.syncing : t.sync}
      </button>
      {error && <p className="text-clay text-sm">{error}</p>}
      {lastResult && <p className="text-sage text-sm">{lastResult}</p>}
    </div>
  );
}
