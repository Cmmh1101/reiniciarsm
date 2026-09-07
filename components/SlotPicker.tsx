"use client";

import { useMemo, useState } from "react";
import type { MentoriaSlot } from "@/lib/mentorias";

type View = "week" | "month";

function dateKey(d: Date) {
  return d.toDateString();
}
function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}
function addDays(d: Date, n: number) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}
// Monday-start week, matching common LatAm calendar convention.
function startOfWeek(d: Date) {
  const copy = startOfDay(d);
  const day = copy.getDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(copy, diff);
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

const WEEKDAY_LABELS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

export default function SlotPicker({
  slots,
  slotId,
  onSelect,
}: {
  slots: MentoriaSlot[];
  slotId: string;
  onSelect: (id: string) => void;
}) {
  const [view, setView] = useState<View>("week");
  const today = useMemo(() => startOfDay(new Date()), []);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(today));
  const [monthStart, setMonthStart] = useState(() => startOfMonth(today));
  const [selectedDay, setSelectedDay] = useState<string>("");

  const slotsByDay = useMemo(() => {
    const map = new Map<string, MentoriaSlot[]>();
    for (const slot of slots) {
      const key = dateKey(new Date(slot.start_time));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(slot);
    }
    return map;
  }, [slots]);

  const timesForSelectedDay = selectedDay ? slotsByDay.get(selectedDay) ?? [] : [];

  function selectDay(d: Date) {
    setSelectedDay(dateKey(d));
    onSelect("");
  }

  const canGoBackWeek = startOfWeek(addDays(weekStart, -1)) >= startOfWeek(today);
  const canGoBackMonth = addMonths(monthStart, -1) >= startOfMonth(today);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setView("week")}
          className={`text-xs px-3 py-1.5 rounded-full border ${view === "week" ? "bg-clay text-white border-clay" : "border-[rgba(237,230,216,0.25)]"}`}
        >
          Semana
        </button>
        <button
          type="button"
          onClick={() => setView("month")}
          className={`text-xs px-3 py-1.5 rounded-full border ${view === "month" ? "bg-clay text-white border-clay" : "border-[rgba(237,230,216,0.25)]"}`}
        >
          Mes
        </button>
      </div>

      {view === "week" ? (
        <div className="mb-3.5">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              disabled={!canGoBackWeek}
              onClick={() => setWeekStart((w) => startOfWeek(addDays(w, -7)))}
              className="text-sm px-2 py-1 disabled:opacity-25"
            >
              ←
            </button>
            <span className="text-xs opacity-70">
              {weekStart.toLocaleDateString("es", { day: "numeric", month: "short" })} –{" "}
              {addDays(weekStart, 6).toLocaleDateString("es", { day: "numeric", month: "short" })}
            </span>
            <button
              type="button"
              onClick={() => setWeekStart((w) => startOfWeek(addDays(w, 7)))}
              className="text-sm px-2 py-1"
            >
              →
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).map((d, i) => {
              const key = dateKey(d);
              const hasSlots = (slotsByDay.get(key)?.length ?? 0) > 0;
              const isPast = d < today;
              const active = key === selectedDay;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={!hasSlots || isPast}
                  onClick={() => selectDay(d)}
                  className={`flex flex-col items-center px-1.5 py-2 rounded-[3px] border text-xs ${
                    active
                      ? "border-clay bg-[rgba(190,90,52,0.12)]"
                      : hasSlots && !isPast
                        ? "border-[rgba(237,230,216,0.2)]"
                        : "border-[rgba(237,230,216,0.08)] opacity-30"
                  }`}
                >
                  <span className="opacity-60 uppercase">{WEEKDAY_LABELS[i]}</span>
                  <span className="font-semibold text-sm">{d.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-3.5">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              disabled={!canGoBackMonth}
              onClick={() => setMonthStart((m) => addMonths(m, -1))}
              className="text-sm px-2 py-1 disabled:opacity-25"
            >
              ←
            </button>
            <span className="text-xs opacity-70 capitalize">
              {monthStart.toLocaleDateString("es", { month: "long", year: "numeric" })}
            </span>
            <button type="button" onClick={() => setMonthStart((m) => addMonths(m, 1))} className="text-sm px-2 py-1">
              →
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label} className="text-[10px] opacity-50 uppercase">
                {label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {(() => {
              const gridStart = startOfWeek(monthStart);
              const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
              return cells.map((d) => {
                const key = dateKey(d);
                const inMonth = d.getMonth() === monthStart.getMonth();
                const hasSlots = (slotsByDay.get(key)?.length ?? 0) > 0;
                const isPast = d < today;
                const active = key === selectedDay;
                if (!inMonth) return <span key={key} />;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!hasSlots || isPast}
                    onClick={() => selectDay(d)}
                    className={`aspect-square flex items-center justify-center rounded-[3px] border text-xs ${
                      active
                        ? "border-clay bg-[rgba(190,90,52,0.12)]"
                        : hasSlots && !isPast
                          ? "border-[rgba(237,230,216,0.2)]"
                          : "border-transparent opacity-25"
                    }`}
                  >
                    {d.getDate()}
                  </button>
                );
              });
            })()}
          </div>
        </div>
      )}

      {selectedDay && (
        <>
          <span className="text-sm font-semibold block mb-2">Elige una hora</span>
          <div className="flex flex-wrap gap-2">
            {timesForSelectedDay.map((slot) => {
              const label = new Date(slot.start_time).toLocaleTimeString("es", { hour: "numeric", minute: "2-digit" });
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onSelect(slot.id)}
                  className={`px-3.5 py-2 rounded-[3px] border text-sm ${
                    slotId === slot.id ? "border-clay bg-[rgba(190,90,52,0.12)]" : "border-[rgba(237,230,216,0.2)]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
