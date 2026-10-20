"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MENTORIA_SESSION_PRODUCT,
  MENTORIA_PACK_PRODUCT,
  TECH_SOS_PRODUCT,
  MENTORIA_SESSION_PRICE_CENTS,
  MENTORIA_PACK_PRICE_CENTS,
  TECH_SOS_PRICE_CENTS,
  isSlotProduct,
  sessionTypeForProduct,
} from "@/lib/pricing";
import type { MentoriaSlot } from "@/lib/mentorias";
import { useAdminI18n } from "@/components/admin/AdminI18n";
import { ADMIN_TIMEZONE } from "@/lib/admin/constants";

const METHOD_KEYS = ["zelle", "paypal", "pago_movil", "otro"] as const;

const PRICE_BY_PRODUCT: Record<string, number> = {
  [MENTORIA_SESSION_PRODUCT]: MENTORIA_SESSION_PRICE_CENTS,
  [MENTORIA_PACK_PRODUCT]: MENTORIA_PACK_PRICE_CENTS,
  [TECH_SOS_PRODUCT]: TECH_SOS_PRICE_CENTS,
};

export default function ManualPaymentForm({ availableSlots }: { availableSlots: MentoriaSlot[] }) {
  const router = useRouter();
  const { locale: adminLocale, t: all } = useAdminI18n();
  const t = all.payments.manual;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState(MENTORIA_SESSION_PRODUCT);
  const [amount, setAmount] = useState((MENTORIA_SESSION_PRICE_CENTS / 100).toString());
  const [paymentMethod, setPaymentMethod] = useState("zelle");
  const [locale, setLocale] = useState<string>(adminLocale === "en" ? "en" : "es");
  const [slotId, setSlotId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleProductChange(value: string) {
    setProduct(value);
    setAmount((PRICE_BY_PRODUCT[value] / 100).toString());
    setSlotId("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const amountCents = Math.round(parseFloat(amount) * 100);
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !amountCents || amountCents <= 0) {
      setError(t.invalid);
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
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t.failed);
      setSuccess(true);
      setName("");
      setEmail("");
      setSlotId("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.failed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[rgba(20,25,43,0.12)] rounded-[3px] p-6 mb-8 max-w-xl">
      <h2 className="font-semibold mb-4">{t.title}</h2>

      <div className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3.5">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>{t.name}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>{t.email}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>{t.product}</span>
            <select
              value={product}
              onChange={(e) => handleProductChange(e.target.value)}
              className="font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            >
              <option value={MENTORIA_SESSION_PRODUCT}>{all.payments.products[MENTORIA_SESSION_PRODUCT]}</option>
              <option value={TECH_SOS_PRODUCT}>{all.payments.products[TECH_SOS_PRODUCT]}</option>
              <option value={MENTORIA_PACK_PRODUCT}>{all.payments.products[MENTORIA_PACK_PRODUCT]}</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>{t.amount}</span>
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
            <span>{t.method}</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            >
              {METHOD_KEYS.map((m) => (
                <option key={m} value={m}>
                  {m === "pago_movil" ? t.pagoMovilOption : all.payments.methods[m]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>{t.emailLanguage}</span>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            >
              <option value="es">{all.common.spanish}</option>
              <option value="en">{all.common.english}</option>
            </select>
          </label>
        </div>

        {isSlotProduct(product) && (
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>{t.slot}</span>
            <select
              value={slotId}
              onChange={(e) => setSlotId(e.target.value)}
              className="font-body text-sm px-3 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            >
              <option value="">{t.unassigned}</option>
              {availableSlots
                .filter((slot) => slot.session_type === sessionTypeForProduct(product))
                .map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {new Date(slot.start_time).toLocaleString(adminLocale, {
                    timeZone: ADMIN_TIMEZONE,
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

        {error && <p className="text-clay-deep text-sm">{error}</p>}
        {success && <p className="text-sage-deep text-sm">{t.success}</p>}

        <button
          type="submit"
          disabled={saving}
          className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay-deep text-white self-start disabled:opacity-70"
        >
          {saving ? t.saving : t.submit}
        </button>
      </div>
    </form>
  );
}
