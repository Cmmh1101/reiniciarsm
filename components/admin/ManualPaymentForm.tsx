"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MENTORIA_SESSION_PRODUCT, MENTORIA_PACK_PRODUCT, MENTORIA_SESSION_PRICE_CENTS, MENTORIA_PACK_PRICE_CENTS } from "@/lib/pricing";
import type { MentoriaSlot } from "@/lib/mentorias";

const METHODS = [
  { value: "zelle", label: "Zelle" },
  { value: "paypal", label: "PayPal" },
  { value: "pago_movil", label: "Pago Móvil (Venezuela)" },
  { value: "otro", label: "Otro" },
];

export default function ManualPaymentForm({ availableSlots }: { availableSlots: MentoriaSlot[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState(MENTORIA_SESSION_PRODUCT);
  const [amount, setAmount] = useState((MENTORIA_SESSION_PRICE_CENTS / 100).toString());
  const [paymentMethod, setPaymentMethod] = useState("zelle");
  const [slotId, setSlotId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleProductChange(value: string) {
    setProduct(value);
    setAmount(((value === MENTORIA_SESSION_PRODUCT ? MENTORIA_SESSION_PRICE_CENTS : MENTORIA_PACK_PRICE_CENTS) / 100).toString());
    if (value !== MENTORIA_SESSION_PRODUCT) setSlotId("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const amountCents = Math.round(parseFloat(amount) * 100);
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !amountCents || amountCents <= 0) {
      setError("Completa nombre, correo válido y un monto mayor a 0.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/manual-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          product,
          amount_cents: amountCents,
          payment_method: paymentMethod,
          slot_id: slotId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo registrar el pago.");
      setSuccess(true);
      setName("");
      setEmail("");
      setSlotId("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el pago.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[rgba(20,25,43,0.12)] rounded-[3px] p-6 mb-8 max-w-xl">
      <h2 className="font-semibold mb-4">Registrar pago manual (Zelle / PayPal / Pago Móvil)</h2>

      <div className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3.5">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>Nombre</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>Correo</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            />
          </label>
        </div>

        <div className="grid grid-cols-3 gap-3.5">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>Producto</span>
            <select
              value={product}
              onChange={(e) => handleProductChange(e.target.value)}
              className="font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            >
              <option value={MENTORIA_SESSION_PRODUCT}>Sesión individual</option>
              <option value={MENTORIA_PACK_PRODUCT}>Paquete de 4</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>Monto (USD)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>Método</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            >
              {METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {product === MENTORIA_SESSION_PRODUCT && (
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>Horario (opcional — deja en blanco si coordinas después)</span>
            <select
              value={slotId}
              onChange={(e) => setSlotId(e.target.value)}
              className="font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            >
              <option value="">Sin asignar</option>
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {new Date(slot.start_time).toLocaleString("es", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </option>
              ))}
            </select>
          </label>
        )}

        {error && <p className="text-clay text-sm">{error}</p>}
        {success && <p className="text-sage text-sm">Pago registrado correctamente.</p>}

        <button
          type="submit"
          disabled={saving}
          className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay text-white self-start disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Registrar pago"}
        </button>
      </div>
    </form>
  );
}
