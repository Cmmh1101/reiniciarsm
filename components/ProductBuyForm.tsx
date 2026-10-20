"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClass = "font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.15)] bg-white";

export default function ProductBuyForm({ productId, priceCents, locale, copy }: { productId: string; priceCents: number; locale: Locale; copy: Dictionary["shop"]["buyForm"] }) {
  const isFree = priceCents === 0;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !EMAIL_RE.test(email)) {
      setError(copy.errorFields);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/product-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name: name.trim(), email: email.trim(), locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? copy.failed);
      window.location.href = data.url;
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : copy.failed);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 max-w-[380px]">
      <input type="text" placeholder={copy.name} aria-label={copy.name} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      <input type="email" placeholder={copy.email} aria-label={copy.email} value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      <button
        type="submit"
        disabled={loading}
        className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay-deep text-paper self-start disabled:opacity-70"
      >
        {loading ? (isFree ? copy.sending : copy.redirecting) : isFree ? copy.free : copy.buy}
      </button>
      {error && <p role="alert" className="text-clay-deep text-sm">{error}</p>}
    </form>
  );
}
