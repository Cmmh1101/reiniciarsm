"use client";

import { useState } from "react";

export default function ReviewForm({ purchaseId }: { purchaseId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (rating < 1) {
      setError("Selecciona una calificación de 1 a 5 estrellas.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/review-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId, rating, comment: comment.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo enviar tu reseña.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar tu reseña.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <p className="font-display text-2xl mb-3">¡Gracias por tu reseña!</p>
        <p className="opacity-70">La vamos a revisar antes de publicarla.</p>
      </div>
    );
  }

  const activeStars = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-[420px] mx-auto">
      <div className="flex justify-center gap-1.5" role="radiogroup" aria-label="Calificación">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} estrellas`}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(n)}
            className={`text-4xl leading-none transition-colors ${n <= activeStars ? "text-clay" : "text-[rgba(20,25,43,0.2)]"}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Cuéntanos qué te pareció (opcional)"
        rows={4}
        className="font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.15)] resize-none"
      />

      {error && <p className="text-clay text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper self-center disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Enviar reseña →"}
      </button>
    </form>
  );
}
