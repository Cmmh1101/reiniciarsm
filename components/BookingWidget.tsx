"use client";

import { useState } from "react";
import { ALT_PAYMENT_EMAIL } from "@/lib/pricing";
import type { MentoriaSlot } from "@/lib/mentorias";

type Plan = "session" | "pack";

export default function BookingWidget({ slots }: { slots: MentoriaSlot[] }) {
  const [plan, setPlan] = useState<Plan>("session");
  const [slotId, setSlotId] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
            <span className="text-sm font-semibold block mb-2">Elige un horario</span>
            {slots.length === 0 ? (
              <p className="text-sm opacity-60">
                No hay horarios disponibles ahora mismo — escríbeme a{" "}
                <a href={`mailto:${ALT_PAYMENT_EMAIL}`} className="text-clay-soft underline">
                  {ALT_PAYMENT_EMAIL}
                </a>{" "}
                y coordinamos.
              </p>
            ) : (
              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
                {slots.map((slot) => {
                  const date = new Date(slot.start_time);
                  const label = date.toLocaleString("es", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  });
                  return (
                    <label
                      key={slot.id}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-[3px] border text-sm cursor-pointer ${
                        slotId === slot.id ? "border-clay bg-[rgba(190,90,52,0.12)]" : "border-[rgba(237,230,216,0.2)]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        value={slot.id}
                        checked={slotId === slot.id}
                        onChange={() => setSlotId(slot.id)}
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
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
