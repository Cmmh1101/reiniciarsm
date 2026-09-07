"use client";

import { useState } from "react";
import { ALT_PAYMENT_EMAIL } from "@/lib/pricing";
import type { MentoriaSlot } from "@/lib/mentorias";

type Plan = "session" | "pack";

// Groups by the viewer's own local calendar day — consistent with how each
// slot's time is already displayed (in the viewer's browser timezone).
function groupByDay(slots: MentoriaSlot[]) {
  const groups = new Map<string, { date: Date; slots: MentoriaSlot[] }>();
  for (const slot of slots) {
    const date = new Date(slot.start_time);
    const key = date.toDateString();
    if (!groups.has(key)) groups.set(key, { date, slots: [] });
    groups.get(key)!.slots.push(slot);
  }
  return [...groups.values()];
}

export default function BookingWidget({ slots }: { slots: MentoriaSlot[] }) {
  const [plan, setPlan] = useState<Plan>("session");
  const dayGroups = groupByDay(slots);
  const [selectedDay, setSelectedDay] = useState<string>(dayGroups[0]?.date.toDateString() ?? "");
  const [slotId, setSlotId] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const timesForSelectedDay = dayGroups.find((g) => g.date.toDateString() === selectedDay)?.slots ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Por favor completa tu nombre y un correo válido.");
      return;
    }
    if (plan === "session" && !slotId) {
      setError("Elige un horario disponible.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = plan === "session" ? "/api/booking-create" : "/api/mentoria-pack-checkout";
      const body =
        plan === "session"
          ? { slot_id: slotId, name: name.trim(), email: email.trim() }
          : { name: name.trim(), email: email.trim() };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "No se pudo iniciar el pago.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar el pago.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-ink-soft border border-[rgba(237,230,216,0.14)] rounded-[2px] p-6">
      <div className="flex gap-2 mb-5">
        <button
          type="button"
          onClick={() => setPlan("session")}
          className={`flex-1 text-left px-4 py-3 rounded-[3px] border text-sm ${
            plan === "session" ? "border-clay bg-[rgba(190,90,52,0.12)]" : "border-[rgba(237,230,216,0.2)]"
          }`}
        >
          <div className="font-semibold">Sesión individual</div>
          <div className="opacity-70 text-xs mt-0.5">$100 · 60 minutos</div>
        </button>
        <button
          type="button"
          onClick={() => setPlan("pack")}
          className={`flex-1 text-left px-4 py-3 rounded-[3px] border text-sm ${
            plan === "pack" ? "border-clay bg-[rgba(190,90,52,0.12)]" : "border-[rgba(237,230,216,0.2)]"
          }`}
        >
          <div className="font-semibold">Paquete de 4 sesiones</div>
          <div className="opacity-70 text-xs mt-0.5">$340 · incluye 1 mes de Comunidad</div>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
        {plan === "session" && (
          <div>
            <span className="text-sm font-semibold block mb-2">Elige un día</span>
            {dayGroups.length === 0 ? (
              <p className="text-sm opacity-60">
                No hay horarios disponibles ahora mismo — escríbeme a{" "}
                <a href={`mailto:${ALT_PAYMENT_EMAIL}`} className="text-clay-soft underline">
                  {ALT_PAYMENT_EMAIL}
                </a>{" "}
                y coordinamos.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-3.5">
                  {dayGroups.map(({ date }) => {
                    const key = date.toDateString();
                    const active = key === selectedDay;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedDay(key);
                          setSlotId("");
                        }}
                        className={`flex flex-col items-center px-3 py-2 rounded-[3px] border text-xs min-w-[56px] ${
                          active ? "border-clay bg-[rgba(190,90,52,0.12)]" : "border-[rgba(237,230,216,0.2)]"
                        }`}
                      >
                        <span className="opacity-60 uppercase">{date.toLocaleDateString("es", { weekday: "short" })}</span>
                        <span className="font-semibold text-sm">{date.getDate()}</span>
                        <span className="opacity-60 uppercase">{date.toLocaleDateString("es", { month: "short" })}</span>
                      </button>
                    );
                  })}
                </div>

                <span className="text-sm font-semibold block mb-2">Elige una hora</span>
                <div className="flex flex-wrap gap-2">
                  {timesForSelectedDay.map((slot) => {
                    const label = new Date(slot.start_time).toLocaleTimeString("es", {
                      hour: "numeric",
                      minute: "2-digit",
                    });
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSlotId(slot.id)}
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
        )}

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(237,230,216,0.25)] bg-white text-ink"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Correo electrónico</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(237,230,216,0.25)] bg-white text-ink"
          />
        </label>

        {error && <p className="text-clay-soft text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="font-body font-semibold text-[15px] px-7 py-3.5 rounded-[3px] bg-clay text-white hover:-translate-y-px transition-transform disabled:opacity-60"
        >
          {loading ? "Redirigiendo a pago..." : plan === "session" ? "Pagar y reservar — $100" : "Comprar paquete — $340"}
        </button>

        <p className="text-xs opacity-55 pt-1">
          ¿No puedes pagar con tarjeta? Escríbeme a{" "}
          <a href={`mailto:${ALT_PAYMENT_EMAIL}`} className="text-clay-soft underline">
            {ALT_PAYMENT_EMAIL}
          </a>{" "}
          para coordinar por Zelle, PayPal o Pago Móvil (solo Venezuela).
        </p>
      </form>
    </div>
  );
}
