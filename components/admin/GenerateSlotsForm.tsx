"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WEEKDAYS } from "@/lib/availability";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function weeksFromNowStr(weeks: number) {
  const d = new Date();
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().slice(0, 10);
}

export default function GenerateSlotsForm() {
  const router = useRouter();
  const [days, setDays] = useState<string[]>([]);
  const [windows, setWindows] = useState([{ start: "08:00", end: "10:00" }]);
  const [rangeStart, setRangeStart] = useState(todayStr());
  const [rangeEnd, setRangeEnd] = useState(weeksFromNowStr(4));
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleDay(day: string) {
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  function updateWindow(i: number, field: "start" | "end", value: string) {
    setWindows((prev) => prev.map((w, idx) => (idx === i ? { ...w, [field]: value } : w)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (days.length === 0) {
      setError("Elige al menos un día de la semana.");
      return;
    }
    if (windows.some((w) => w.start >= w.end)) {
      setError("Cada ventana debe tener una hora de inicio antes de la hora de fin.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/generate-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, windows, range_start: rangeStart, range_end: rangeEnd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudieron crear los horarios.");
      setResult(data);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron crear los horarios.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[rgba(20,25,43,0.12)] rounded-[3px] p-6 mb-8 max-w-2xl">
      <h2 className="font-semibold mb-1">Generar horarios disponibles</h2>
      <p className="text-xs opacity-60 mb-4">Hora de Venezuela (UTC-4). Se omiten los horarios que ya existan.</p>

      <div className="flex flex-col gap-4">
        <div>
          <span className="text-sm font-semibold block mb-2">Días de la semana</span>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => toggleDay(d.value)}
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  days.includes(d.value) ? "bg-clay text-white border-clay" : "border-[rgba(20,25,43,0.2)]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-sm font-semibold block mb-2">Ventanas horarias</span>
          <div className="flex flex-col gap-2">
            {windows.map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="time"
                  value={w.start}
                  onChange={(e) => updateWindow(i, "start", e.target.value)}
                  className="font-body text-sm px-2 py-1.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
                />
                <span className="text-sm opacity-60">a</span>
                <input
                  type="time"
                  value={w.end}
                  onChange={(e) => updateWindow(i, "end", e.target.value)}
                  className="font-body text-sm px-2 py-1.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
                />
                {windows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setWindows((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-xs text-clay"
                  >
                    Quitar
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setWindows((prev) => [...prev, { start: "08:00", end: "10:00" }])}
              className="text-xs text-clay self-start"
            >
              + Agregar ventana
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>Desde</span>
            <input
              type="date"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              className="font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>Hasta</span>
            <input
              type="date"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            />
          </label>
        </div>

        {error && <p className="text-clay text-sm">{error}</p>}
        {result && (
          <p className="text-sage text-sm">
            Se crearon {result.created} horarios nuevos{result.skipped > 0 ? ` (${result.skipped} ya existían)` : ""}.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay text-white self-start disabled:opacity-60"
        >
          {saving ? "Generando..." : "Generar horarios"}
        </button>
      </div>
    </form>
  );
}
