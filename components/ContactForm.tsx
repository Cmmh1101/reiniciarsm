"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!EMAIL_RE.test(email)) {
      setError("Por favor escribe un correo válido.");
      return;
    }
    if (!message.trim()) {
      setError("Escribe un mensaje.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo enviar tu mensaje.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "No se pudo enviar tu mensaje.");
    }
  }

  if (status === "done") {
    return (
      <p className="text-base opacity-80">
        Gracias por escribir — recibí tu mensaje y te responderé lo antes posible.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[480px]">
      <div className="grid sm:grid-cols-2 gap-4">
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
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.15)]"
        />
      </div>
      <input
        type="text"
        placeholder="Asunto"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.15)]"
      />
      <textarea
        placeholder="Tu mensaje"
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.15)] resize-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper self-start disabled:opacity-60"
      >
        {status === "loading" ? "Enviando..." : "Enviar →"}
      </button>
      {error && <p className="text-clay text-sm">{error}</p>}
    </form>
  );
}
