"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminI18n } from "@/components/admin/AdminI18n";
import { fmt } from "@/lib/admin/dictionary";
import { WEEKDAYS } from "@/lib/availability";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function weeksFromNowStr(weeks: number) {
  const d = new Date();
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().slice(0, 10);
}

const field = "font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]";

export default function GenerateSlotsForm({ timeZone }: { timeZone: string }) {
  const router = useRouter();
  const { t: all } = useAdminI18n();
  const t = all.sessions.generate;
  const [sessionType, setSessionType] = useState<"session" | "sos">("session");
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

  function updateWindow(i: number, key: "start" | "end", value: string) {
    setWindows((prev) => prev.map((w, idx) => (idx === i ? { ...w, [key]: value } : w)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (days.length === 0) {
      setError(t.errorDays);
      return;
    }
    if (windows.some((w) => w.start >= w.end)) {
      setError(t.errorWindows);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/generate-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, windows, range_start: rangeStart, range_end: rangeEnd, session_type: sessionType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t.failed);
      setResult(data);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.failed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[rgba(20,25,43,0.12)] rounded-[3px] p-6 max-w-2xl bg-white">
      <h2 className="font-semibold mb-1">{t.title}</h2>
      <p className="text-xs opacity-70 mb-4">{fmt(t.help, { tz: timeZone })}</p>

      <div className="flex flex-col gap-4">
        <fieldset>
          <legend className="text-sm font-semibold mb-2">{t.type}</legend>
          <div className="flex flex-wrap gap-2">
            {(["session", "sos"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSessionType(value)}
                aria-pressed={sessionType === value}
                className={`text-xs px-3 py-1.5 rounded-full border ${sessionType === value ? "bg-clay-deep text-white border-clay" : "border-[rgba(20,25,43,0.2)]"}`}
              >
                {all.sessions.types[value]}
              </button>
            ))}
          </div>
          <p className="text-xs opacity-70 mt-2">{t.typeHelp}</p>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold mb-2">{t.days}</legend>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => toggleDay(d.value)}
                aria-pressed={days.includes(d.value)}
                className={`text-xs px-3 py-1.5 rounded-full border ${days.includes(d.value) ? "bg-clay-deep text-white border-clay" : "border-[rgba(20,25,43,0.2)]"}`}
              >
                {t.weekdays[d.value] ?? d.value}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold mb-2">{t.windows}</legend>
          <div className="flex flex-col gap-2">
            {windows.map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="time" value={w.start} onChange={(e) => updateWindow(i, "start", e.target.value)} aria-label={t.from} className={field} />
                <span className="text-sm opacity-70">{t.to}</span>
                <input type="time" value={w.end} onChange={(e) => updateWindow(i, "end", e.target.value)} aria-label={t.until} className={field} />
                {windows.length > 1 && (
                  <button type="button" onClick={() => setWindows((prev) => prev.filter((_, idx) => idx !== i))} className="text-xs text-clay-deep">
                    {t.remove}
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setWindows((prev) => [...prev, { start: "08:00", end: "10:00" }])} className="text-xs text-clay-deep self-start">
              {t.addWindow}
            </button>
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-3.5">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>{t.from}</span>
            <input type="date" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} className={field} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>{t.until}</span>
            <input type="date" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} className={field} />
          </label>
        </div>

        {error && (
          <p role="alert" className="text-clay-deep text-sm">
            {error}
          </p>
        )}
        {result && (
          <p role="status" className="text-sage-deep text-sm">
            {fmt(t.created, { created: result.created })}
            {result.skipped > 0 ? fmt(t.skipped, { skipped: result.skipped }) : ""}
          </p>
        )}

        <button type="submit" disabled={saving} className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay-deep text-white self-start disabled:opacity-70">
          {saving ? t.generating : t.submit}
        </button>
      </div>
    </form>
  );
}
