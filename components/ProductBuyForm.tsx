"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProductBuyForm({ productId }: { productId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !EMAIL_RE.test(email)) {
      setError("Completa tu nombre y un correo válido.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/product-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "No se pudo iniciar el pago.");
      window.location.href = data.url;
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "No se pudo iniciar el pago.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 max-w-[380px]">
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.15)]"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.15)]"
      />
      <button
        type="submit"
        disabled={loading}
        className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper self-start disabled:opacity-60"
      >
        {loading ? "Redirigiendo a pago..." : "Comprar →"}
      </button>
      {error && <p className="text-clay text-sm">{error}</p>}
    </form>
  );
}
