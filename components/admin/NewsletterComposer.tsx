"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewsletterComposer({ subscriberCount }: { subscriberCount: number }) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ sent: number; total: number } | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSend() {
    setError("");
    setResult(null);

    if (!subject.trim() || !content.trim()) {
      setError("Escribe un asunto y contenido.");
      return;
    }
    if (!confirm(`¿Enviar este correo a los ${subscriberCount} suscriptores activos? Esta acción no se puede deshacer.`)) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/newsletter-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), content: content.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo enviar.");
      setResult(data);
      setSubject("");
      setContent("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border border-[rgba(20,25,43,0.12)] rounded-[3px] p-6 mb-8 max-w-2xl">
      <h2 className="font-semibold mb-1">Escribir newsletter</h2>
      <p className="text-xs opacity-60 mb-4">
        Se envía a los {subscriberCount} contactos suscritos (no incluye a quienes se dieron de baja). Tu nombre, saludo y
        enlace de baja se agregan automáticamente.
      </p>

      <div className="flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Asunto</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Contenido</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
          />
        </label>

        {error && <p className="text-clay text-sm">{error}</p>}
        {result && (
          <p className="text-sage text-sm">
            Enviado a {result.sent} de {result.total} suscriptores.
          </p>
        )}

        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay text-white self-start disabled:opacity-60"
        >
          {sending ? "Enviando..." : `Enviar a ${subscriberCount} suscriptores`}
        </button>
      </div>
    </div>
  );
}
