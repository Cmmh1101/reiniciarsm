"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminI18n } from "@/components/admin/AdminI18n";
import { fmt } from "@/lib/admin/dictionary";
import { addDaysKey, zonedParts } from "@/lib/admin/time";
import type { AdminSlot } from "@/lib/adminSlots";
import {
  MENTORIA_SESSION_PRICE_CENTS,
  MENTORIA_SESSION_PRODUCT,
  TECH_SOS_PRICE_CENTS,
  TECH_SOS_PRODUCT,
} from "@/lib/pricing";

const ROW_H = 56; // pixels per hour
const METHODS = ["zelle", "paypal", "pago_movil", "otro"] as const;

interface Props {
  slots: AdminSlot[];
  weekStart: string; // Monday, YYYY-MM-DD in the admin time zone
  todayKey: string;
  timeZone: string;
  hasBlocking: boolean;
}

async function post(url: string, body: unknown): Promise<{ ok: boolean; data: Record<string, unknown> }> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export default function AvailabilityCalendar({ slots, weekStart, todayKey, timeZone, hasBlocking }: Props) {
  const router = useRouter();
  const { locale, t: all } = useAdminI18n();
  const t = all.sessions;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  const [reason, setReason] = useState("");
  const [showBook, setShowBook] = useState(false);
  const [book, setBook] = useState({ name: "", email: "", amount: "", method: "zelle", language: locale as string });

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDaysKey(weekStart, i)), [weekStart]);

  // Place every slot on its day, in the admin time zone.
  const placed = useMemo(
    () =>
      slots.map((slot) => {
        const p = zonedParts(slot.start_time, timeZone);
        return { slot, dateKey: p.dateKey, start: p.minutes, end: p.minutes + slot.duration_minutes };
      }),
    [slots, timeZone]
  );

  const startHour = placed.length ? Math.max(0, Math.floor(Math.min(...placed.map((p) => p.start)) / 60)) : 8;
  const endHour = placed.length ? Math.min(24, Math.max(startHour + 4, Math.ceil(Math.max(...placed.map((p) => p.end)) / 60))) : 18;
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const gridHeight = hours.length * ROW_H;

  const counts = {
    open: slots.filter((s) => s.state === "open").length,
    booked: slots.filter((s) => s.state === "booked").length,
    blocked: slots.filter((s) => s.state === "blocked").length,
  };

  const selected = selectedId ? slots.find((s) => s.id === selectedId) ?? null : null;

  const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit", timeZone });
  const dayLabel = (key: string, opts: Intl.DateTimeFormatOptions) => new Date(`${key}T12:00:00Z`).toLocaleDateString(locale, { ...opts, timeZone: "UTC" });
  const weekRange = `${dayLabel(days[0], { day: "numeric", month: "short" })} – ${dayLabel(days[6], { day: "numeric", month: "short" })}`;

  function select(slot: AdminSlot) {
    setSelectedId(slot.id);
    setMessage(null);
    setShowBook(false);
    setReason("");
    const cents = slot.session_type === "sos" ? TECH_SOS_PRICE_CENTS : MENTORIA_SESSION_PRICE_CENTS;
    setBook((b) => ({ ...b, amount: String(cents / 100) }));
  }

  async function run(action: () => Promise<{ ok: boolean; data: Record<string, unknown> }>, okText?: string, after?: () => void) {
    setBusy(true);
    setMessage(null);
    try {
      const { ok, data } = await action();
      if (!ok) {
        const err = typeof data.error === "string" ? data.error : "";
        setMessage({ kind: "error", text: err === "migration_missing" ? t.migrationMissing : err || all.common.error });
        return;
      }
      if (okText) setMessage({ kind: "ok", text: okText });
      after?.();
      router.refresh();
    } catch {
      setMessage({ kind: "error", text: all.common.error });
    } finally {
      setBusy(false);
    }
  }

  const setBlocked = (ids: string[], blocked: boolean, why?: string) => run(() => post("/api/admin/slots/block", { slot_ids: ids, blocked, reason: why }));

  function dayAction(dateKey: string) {
    const daySlots = placed.filter((p) => p.dateKey === dateKey).map((p) => p.slot);
    const open = daySlots.filter((s) => s.state === "open");
    const blocked = daySlots.filter((s) => s.state === "blocked");
    if (open.length > 0) return { label: t.calendar.blockDay, confirm: t.panel.blockDayConfirm, ids: open.map((s) => s.id), blocked: true };
    if (blocked.length > 0) return { label: t.calendar.unblockDay, confirm: t.panel.unblockDayConfirm, ids: blocked.map((s) => s.id), blocked: false };
    return null;
  }

  function submitBooking() {
    if (!selected) return;
    const amountCents = Math.round(parseFloat(book.amount) * 100);
    if (!book.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(book.email.trim()) || !amountCents || amountCents <= 0) {
      setMessage({ kind: "error", text: t.panel.fieldsRequired });
      return;
    }
    run(
      () =>
        post("/api/admin/manual-payment", {
          name: book.name.trim(),
          email: book.email.trim(),
          product: selected.session_type === "sos" ? TECH_SOS_PRODUCT : MENTORIA_SESSION_PRODUCT,
          amount_cents: amountCents,
          payment_method: book.method,
          slot_id: selected.id,
          locale: book.language,
        }),
      t.panel.booked,
      () => {
        setShowBook(false);
        setBook((b) => ({ ...b, name: "", email: "" }));
      }
    );
  }

  const chipStyle = (state: AdminSlot["state"]): { className: string; style?: React.CSSProperties } => {
    switch (state) {
      case "booked":
        return { className: "bg-sage text-white border border-sage" };
      case "blocked":
        return {
          className: "text-ink/70 border border-[rgba(20,25,43,0.3)]",
          style: { backgroundImage: "repeating-linear-gradient(45deg, rgba(20,25,43,0.14) 0 6px, transparent 6px 12px)" },
        };
      case "held":
        return { className: "bg-[rgba(201,162,39,0.25)] border border-gold text-ink" };
      default:
        return { className: "bg-white border border-[rgba(20,25,43,0.28)] text-ink hover:border-clay" };
    }
  };

  const legend: [AdminSlot["state"], string][] = [
    ["open", t.calendar.legend.open],
    ["booked", t.calendar.legend.booked],
    ["blocked", t.calendar.legend.blocked],
    ["held", t.calendar.legend.held],
  ];

  const navLink = "font-mono text-xs uppercase tracking-wide px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.2)] hover:border-ink";

  return (
    <section aria-label={t.title} className="mb-10">
      {/* Navigation */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Link href={`?week=${addDaysKey(weekStart, -7)}`} className={navLink} aria-label={t.calendar.prevWeek}>
          ←
        </Link>
        <Link href="?" className={navLink}>
          {t.calendar.today}
        </Link>
        <Link href={`?week=${addDaysKey(weekStart, 7)}`} className={navLink} aria-label={t.calendar.nextWeek}>
          →
        </Link>
        <h2 className="font-display text-lg ml-2">{fmt(t.calendar.week, { range: weekRange })}</h2>
        <label className="ml-auto flex items-center gap-2 text-xs">
          <span className="opacity-60">{t.calendar.jumpTo}</span>
          <input
            type="date"
            value={weekStart}
            onChange={(e) => e.target.value && router.push(`?week=${e.target.value}`)}
            className="font-body text-sm px-2 py-1.5 rounded-[3px] border border-[rgba(20,25,43,0.2)]"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-xs">
        <span className="opacity-70">{fmt(t.calendar.summary, counts)}</span>
        <ul className="flex flex-wrap gap-3">
          {legend.map(([state, label]) => (
            <li key={state} className="flex items-center gap-1.5">
              <span className={`inline-block w-3.5 h-3.5 rounded-[2px] ${chipStyle(state).className}`} style={chipStyle(state).style} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
        <span className="opacity-50 ml-auto">{fmt(t.timezone, { tz: timeZone })}</span>
      </div>

      {/* Week grid */}
      <div className="overflow-x-auto border border-[rgba(20,25,43,0.12)] rounded-[3px] bg-paper">
        <div className="min-w-[820px]">
          <div className="grid grid-cols-[52px_repeat(7,minmax(0,1fr))] border-b border-[rgba(20,25,43,0.12)]">
            <div />
            {days.map((key) => {
              const action = hasBlocking ? dayAction(key) : null;
              const isToday = key === todayKey;
              return (
                <div key={key} className={`px-2 py-2 border-l border-[rgba(20,25,43,0.08)] ${isToday ? "bg-[rgba(190,90,52,0.08)]" : ""}`}>
                  <div className="text-[11px] font-mono uppercase tracking-wide opacity-60">{dayLabel(key, { weekday: "short" })}</div>
                  <div className={`font-display text-lg leading-tight ${isToday ? "text-clay" : ""}`}>{dayLabel(key, { day: "numeric", month: "short" })}</div>
                  {action && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => confirm(action.confirm) && setBlocked(action.ids, action.blocked)}
                      className="mt-1 text-[10.5px] font-mono uppercase tracking-wide underline opacity-60 hover:opacity-100 disabled:opacity-40"
                    >
                      {action.label}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-[52px_repeat(7,minmax(0,1fr))]">
            <div className="relative" style={{ height: gridHeight }}>
              {hours.map((h, i) => (
                <div key={h} className="absolute right-2 -translate-y-1/2 text-[10.5px] font-mono opacity-50" style={{ top: i * ROW_H + (i === 0 ? 8 : 0) }}>
                  {new Date(Date.UTC(2000, 0, 1, h)).toLocaleTimeString(locale, { hour: "numeric", timeZone: "UTC" })}
                </div>
              ))}
            </div>
            {days.map((key) => (
              <div
                key={key}
                className={`relative border-l border-[rgba(20,25,43,0.08)] ${key === todayKey ? "bg-[rgba(190,90,52,0.04)]" : ""}`}
                style={{
                  height: gridHeight,
                  backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${ROW_H - 1}px, rgba(20,25,43,0.08) ${ROW_H - 1}px, rgba(20,25,43,0.08) ${ROW_H}px)`,
                }}
              >
                {placed
                  .filter((p) => p.dateKey === key)
                  .map(({ slot, start, end }) => {
                    const style = chipStyle(slot.state);
                    const top = ((start - startHour * 60) / 60) * ROW_H + 1;
                    const height = ((end - start) / 60) * ROW_H - 3;
                    const isSelected = slot.id === selectedId;
                    const label = `${timeLabel(slot.start_time)} · ${t.types[slot.session_type]} · ${t.calendar.legend[slot.state]}`;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => select(slot)}
                        aria-label={label}
                        aria-pressed={isSelected}
                        title={label}
                        className={`absolute left-1 right-1 rounded-[3px] px-1.5 text-left text-[11px] leading-tight overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay ${style.className} ${
                          isSelected ? "ring-2 ring-clay ring-offset-1" : ""
                        }`}
                        style={{ top, height, ...style.style }}
                      >
                        <span className="font-semibold tabular-nums">{timeLabel(slot.start_time)}</span>
                        {slot.session_type === "sos" && <span className="ml-1 font-mono text-[9.5px] opacity-80">SOS</span>}
                        {height > 34 && slot.state === "booked" && slot.booking && <span className="block truncate opacity-90">{slot.booking.name || slot.booking.email}</span>}
                        {height > 34 && slot.state === "blocked" && slot.blocked_reason && <span className="block truncate opacity-80">{slot.blocked_reason}</span>}
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {slots.length === 0 && <p className="text-sm opacity-60 mt-3">{t.calendar.empty}</p>}
      {!hasBlocking && slots.length > 0 && <p className="text-xs text-clay mt-3">{t.migrationMissing}</p>}

      {/* Selected time */}
      <div aria-live="polite" className="mt-5">
        {!selected ? (
          slots.length > 0 && <p className="text-sm opacity-50">{t.calendar.selectHint}</p>
        ) : (
          <div className="border border-[rgba(20,25,43,0.15)] rounded-[3px] p-5 bg-white max-w-2xl">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-display text-lg">
                  {new Date(selected.start_time).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", timeZone })} · {timeLabel(selected.start_time)}
                </p>
                <p className="text-xs font-mono opacity-60">{t.types[selected.session_type]}</p>
              </div>
              <button type="button" onClick={() => setSelectedId(null)} className="text-xs font-mono uppercase tracking-wide opacity-60 hover:opacity-100">
                {all.common.close}
              </button>
            </div>

            <p className="text-sm mb-4">
              {selected.state === "open" && t.panel.statusOpen}
              {selected.state === "blocked" && t.panel.statusBlocked}
              {selected.state === "held" && selected.held_until && fmt(t.panel.statusHeld, { time: timeLabel(selected.held_until) })}
              {selected.state === "booked" && t.panel.statusBooked}
            </p>

            {selected.state === "blocked" && selected.blocked_reason && <p className="text-sm opacity-70 mb-4">{fmt(t.panel.blockedReason, { reason: selected.blocked_reason })}</p>}

            {selected.state === "booked" && selected.booking && (
              <div className="text-sm mb-4">
                <p className="text-xs font-mono uppercase tracking-wide opacity-50 mb-1">{t.panel.client}</p>
                <p>{selected.booking.name || "—"}</p>
                <p className="opacity-60">{selected.booking.email}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 items-end">
              {selected.state === "open" && hasBlocking && (
                <>
                  <label className="flex flex-col gap-1 text-xs flex-1 min-w-[200px]">
                    <span className="opacity-60">{t.panel.reason}</span>
                    <input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      maxLength={120}
                      placeholder={t.panel.reasonPlaceholder}
                      className="font-body text-sm px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.2)]"
                    />
                  </label>
                  <button type="button" disabled={busy} onClick={() => setBlocked([selected.id], true, reason)} className="font-body font-semibold text-sm px-4 py-2 rounded-[3px] bg-ink text-paper disabled:opacity-60">
                    {t.panel.block}
                  </button>
                </>
              )}
              {selected.state === "blocked" && (
                <button type="button" disabled={busy} onClick={() => setBlocked([selected.id], false)} className="font-body font-semibold text-sm px-4 py-2 rounded-[3px] bg-ink text-paper disabled:opacity-60">
                  {t.panel.unblock}
                </button>
              )}
              {selected.state === "open" && (
                <button type="button" disabled={busy} onClick={() => setShowBook((v) => !v)} aria-expanded={showBook} className="font-body font-semibold text-sm px-4 py-2 rounded-[3px] border border-ink disabled:opacity-60">
                  {t.panel.bookFor}
                </button>
              )}
              {selected.state === "booked" && selected.booking && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => confirm(t.panel.cancelConfirm) && run(() => post("/api/admin/slots/cancel-booking", { booking_id: selected.booking!.id }))}
                  className="font-body font-semibold text-sm px-4 py-2 rounded-[3px] border border-clay text-clay disabled:opacity-60"
                >
                  {t.panel.cancelBooking}
                </button>
              )}
              {(selected.state === "open" || selected.state === "blocked") && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => confirm(t.panel.deleteConfirm) && run(() => post("/api/admin/slots/delete", { slot_ids: [selected.id] }), undefined, () => setSelectedId(null))}
                  className="font-mono text-xs uppercase tracking-wide underline opacity-60 hover:opacity-100 disabled:opacity-40 ml-auto"
                >
                  {t.panel.deleteSlot}
                </button>
              )}
            </div>

            {showBook && selected.state === "open" && (
              <div className="mt-4 pt-4 border-t border-[rgba(20,25,43,0.1)] grid sm:grid-cols-2 gap-3">
                <p className="sm:col-span-2 text-xs opacity-60">{t.panel.bookHelp}</p>
                <label className="flex flex-col gap-1 text-xs font-semibold">
                  <span>{all.common.name}</span>
                  <input value={book.name} onChange={(e) => setBook({ ...book, name: e.target.value })} autoComplete="off" className="font-body text-sm font-normal px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.2)]" />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold">
                  <span>{all.common.email}</span>
                  <input type="email" value={book.email} onChange={(e) => setBook({ ...book, email: e.target.value })} autoComplete="off" className="font-body text-sm font-normal px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.2)]" />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold">
                  <span>{t.panel.amount}</span>
                  <input type="number" min="0.01" step="0.01" value={book.amount} onChange={(e) => setBook({ ...book, amount: e.target.value })} className="font-body text-sm font-normal px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.2)]" />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold">
                  <span>{t.panel.method}</span>
                  <select value={book.method} onChange={(e) => setBook({ ...book, method: e.target.value })} className="font-body text-sm font-normal px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.2)] bg-white">
                    {METHODS.map((m) => (
                      <option key={m} value={m}>
                        {all.payments.methods[m]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold">
                  <span>{t.panel.emailLanguage}</span>
                  <select value={book.language} onChange={(e) => setBook({ ...book, language: e.target.value })} className="font-body text-sm font-normal px-3 py-2 rounded-[3px] border border-[rgba(20,25,43,0.2)] bg-white">
                    <option value="es">{all.common.spanish}</option>
                    <option value="en">{all.common.english}</option>
                  </select>
                </label>
                <div className="sm:col-span-2">
                  <button type="button" disabled={busy} onClick={submitBooking} className="font-body font-semibold text-sm px-4 py-2 rounded-[3px] bg-clay text-white disabled:opacity-60">
                    {t.panel.bookSubmit}
                  </button>
                </div>
              </div>
            )}

            {message && (
              <p role={message.kind === "error" ? "alert" : "status"} className={`text-sm mt-3 ${message.kind === "error" ? "text-clay" : "text-sage"}`}>
                {message.text}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
