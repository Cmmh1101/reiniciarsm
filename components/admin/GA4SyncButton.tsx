"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GA4SyncButton() {
  const router = useRouter();
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
      if (!res.ok) throw new Error(data.error ?? "No se pudo sincronizar.");
      setLastResult(`${data.date}: ${data.stats.sessions} sesiones, ${data.stats.pageViews} vistas.`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo sincronizar.");
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
        {syncing ? "Sincronizando..." : "Sincronizar ahora (día de ayer)"}
      </button>
      {error && <p className="text-clay text-sm">{error}</p>}
      {lastResult && <p className="text-sage text-sm">{lastResult}</p>}
    </div>
  );
}
