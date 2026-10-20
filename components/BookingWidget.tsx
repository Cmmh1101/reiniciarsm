"use client";

import { useState } from "react";
import { ALT_PAYMENT_EMAIL } from "@/lib/pricing";
import type { MentoriaSlot } from "@/lib/mentorias";
import SlotPicker from "@/components/SlotPicker";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";

export type Plan = "sos" | "session" | "pack";

export default function BookingWidget({
  slots,
  locale,
  copy,
  plans,
  initialPlan,
  source,
}: {
  slots: MentoriaSlot[];
  locale: Locale;
  copy: Dictionary["booking"];
  plans: Plan[];
  initialPlan?: Plan;
  // Which page the widget sits on — used to send people back there if they cancel at checkout.
  source: "workWithMe" | "mentoring";
}) {
  const [plan, setPlan] = useState<Plan>(initialPlan && plans.includes(initialPlan) ? initialPlan : plans[0]);
  const [slotId, setSlotId] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Each slot belongs to one kind of session (30-minute Tech SOS or 60-minute 1:1).
  const planSlots = slots.filter((s) => s.session_type === (plan === "sos" ? "sos" : "session"));

  function choosePlan(next: Plan) {
    setPlan(next);
    setSlotId("");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(copy.errorFields);
      return;
    }
    if (plan !== "pack" && !slotId) {
      setError(copy.errorSlot);
      return;
    }

    setLoading(true);
    try {
      const endpoint = plan === "pack" ? "/api/mentoria-pack-checkout" : "/api/booking-create";
      const base = { name: name.trim(), email: email.trim(), locale, source };
      const body = plan === "pack" ? base : { ...base, slot_id: slotId, session_type: plan };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? copy.errorGeneric);
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errorGeneric);
      setLoading(false);
    }
  }

  return (
    <div className="bg-ink-soft text-paper border border-[rgba(237,230,216,0.14)] rounded-[2px] p-6">
      <div className={`grid gap-2 mb-5 ${plans.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {plans.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => choosePlan(p)}
            aria-pressed={plan === p}
            className={`text-left px-4 py-3 rounded-[3px] border text-sm ${
              plan === p ? "border-clay bg-[rgba(190,90,52,0.12)]" : "border-[rgba(237,230,216,0.2)]"
            }`}
          >
            <div className="font-semibold">{copy.plans[p].name}</div>
            <div className="opacity-70 text-xs mt-0.5">{copy.plans[p].meta}</div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
        {plan !== "pack" && (
          <div>
            {planSlots.length === 0 ? (
              <p className="text-sm opacity-90">
                {copy.noSlotsBefore}{" "}
                <a href={`mailto:${ALT_PAYMENT_EMAIL}`} className="text-clay-soft underline">
                  {ALT_PAYMENT_EMAIL}
                </a>{" "}
                {copy.noSlotsAfter}
              </p>
            ) : (
              <SlotPicker key={plan} slots={planSlots} slotId={slotId} onSelect={setSlotId} locale={locale} copy={copy} />
            )}
          </div>
        )}

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>{copy.name}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(237,230,216,0.25)] bg-white text-ink"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>{copy.email}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(237,230,216,0.25)] bg-white text-ink"
          />
        </label>

        {error && <p role="alert" className="text-clay-soft text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="font-body font-semibold text-[15px] px-7 py-3.5 rounded-[3px] bg-clay-deep text-white hover:-translate-y-px transition-transform disabled:opacity-70"
        >
          {loading ? copy.redirecting : copy.pay[plan]}
        </button>

        <p className="text-xs opacity-90 pt-1">
          {copy.altPaymentBefore}{" "}
          <a href={`mailto:${ALT_PAYMENT_EMAIL}`} className="text-clay-soft underline">
            {ALT_PAYMENT_EMAIL}
          </a>{" "}
          {copy.altPaymentAfter}
        </p>
      </form>
    </div>
  );
}
