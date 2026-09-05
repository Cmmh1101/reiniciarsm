"use client";

import { useState } from "react";
import { PILLARS, computeWinner, type Pillar, type QuizScores } from "@/lib/diagnostic";

type Screen = "cover" | "questions" | "capture" | "result";

export default function DiagnosticQuiz() {
  const [screen, setScreen] = useState<Screen>("cover");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<QuizScores>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [winner, setWinner] = useState<Pillar | null>(null);

  function start() {
    setCurrentQuestion(0);
    setScores({});
    setScreen("questions");
  }

  function selectOption(score: number) {
    const pillar = PILLARS[currentQuestion];
    const nextScores = { ...scores, [pillar.key]: score };
    setScores(nextScores);

    if (currentQuestion + 1 < PILLARS.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setScreen("capture");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const computedWinner = computeWinner(scores);

    if (honeypot) {
      setWinner(computedWinner);
      setScreen("result");
      return;
    }
    if (!name.trim()) {
      setError("Por favor escribe tu nombre.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Por favor escribe un correo válido.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), scores }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setWinner(PILLARS.find((p) => p.key === data.pillar) ?? computedWinner);
    } catch {
      // Don't block the result on a network hiccup — the lead can still see
      // their result; worst case the row didn't save and she can follow up.
      setWinner(computedWinner);
    } finally {
      setSubmitting(false);
      setScreen("result");
    }
  }

  const progress = screen === "questions" ? (currentQuestion / PILLARS.length) * 100 : 0;

  return (
    <div className="w-full bg-ink text-paper px-[8vw] py-24">
      <div className="max-w-[640px] mx-auto">
        {screen === "questions" && (
          <div className="h-1 rounded-full overflow-hidden mb-8 bg-[rgba(237,230,216,0.15)]">
            <div
              className="h-full bg-sage transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {screen === "cover" && (
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-clay mb-3">
              Diagnóstico Next You
            </p>
            <h2 className="font-display font-semibold text-2xl md:text-4xl mb-4">
              8 preguntas para descubrir tu próximo paso.
            </h2>
            <p className="text-[rgba(237,230,216,0.8)] mb-7">
              Identifica cuál de los 8 pilares de NEXT YOU™ necesita tu atención ahora mismo. Toma
              menos de 3 minutos y no necesitas tener nada resuelto para empezar.
            </p>
            <button
              type="button"
              onClick={start}
              className="inline-block font-body font-semibold text-[15px] px-7 py-3.5 rounded-[3px] bg-clay text-white hover:-translate-y-px transition-transform"
            >
              Empezar diagnóstico →
            </button>
          </div>
        )}

        {screen === "questions" && (
          <div>
            <p className="font-mono text-[13px] text-sage mb-2">
              Pregunta {currentQuestion + 1} de {PILLARS.length}
            </p>
            <h2 className="font-display font-semibold text-xl md:text-[26px] mb-6">
              {PILLARS[currentQuestion].question}
            </h2>
            <div className="flex flex-col gap-2.5">
              {PILLARS[currentQuestion].options.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => selectOption(opt.score)}
                  className="text-left bg-white text-ink border border-[rgba(20,25,43,0.15)] rounded-[3px] px-[18px] py-3.5 text-[15px] hover:border-clay hover:bg-[#fdf1ec] transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === "capture" && (
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-clay mb-3">
              Ya casi tienes tu resultado
            </p>
            <h2 className="font-display font-semibold text-xl md:text-[28px] mb-4">
              ¿A dónde te enviamos tu diagnóstico?
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[420px]" noValidate>
              <label className="flex flex-col gap-1.5 text-sm font-semibold">
                <span>Nombre</span>
                <input
                  type="text"
                  autoComplete="given-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(237,230,216,0.25)] bg-white text-ink"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-semibold">
                <span>Correo electrónico</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(237,230,216,0.25)] bg-white text-ink"
                />
              </label>
              {/* Honeypot anti-spam: hidden from real users, a bot will fill it in */}
              <label className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                <span>No llenar este campo</span>
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
              {error && (
                <p role="alert" className="text-clay text-sm min-h-[1.1em]">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="inline-block font-body font-semibold text-[15px] px-7 py-3.5 rounded-[3px] bg-clay text-white hover:-translate-y-px transition-transform disabled:opacity-60"
              >
                {submitting ? "Enviando..." : "Ver mi resultado"}
              </button>
            </form>
          </div>
        )}

        {screen === "result" && winner && (
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-clay mb-3">
              Tu arquetipo Next You
            </p>
            <h2 className="font-display font-semibold text-xl md:text-[28px] mb-4">
              {winner.archetype}
            </h2>
            <p className="font-mono text-sm uppercase tracking-wide text-[#E1D6C2] mb-4">
              Pilar prioritario: {winner.key}
            </p>
            <p className="text-[rgba(237,230,216,0.8)] mb-7">{winner.description}</p>
            <a
              href="/comunidad"
              className="inline-block font-body font-semibold text-[15px] px-7 py-3.5 rounded-[3px] bg-clay text-white hover:-translate-y-px transition-transform"
            >
              Únete a la Comunidad Next You
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
