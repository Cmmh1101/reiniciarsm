"use client";

import { useState } from "react";
import Link from "next/link";
import { PILLARS, PILLAR_PHASE, computeWinner, type Pillar, type QuizScores } from "@/lib/diagnostic";
import { DIAGNOSTIC_UI, getPhaseText, getPillarText } from "@/lib/i18n/content/diagnostic";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";

type Screen = "cover" | "questions" | "capture" | "result";

export default function DiagnosticQuiz({ locale }: { locale: Locale }) {
  const ui = DIAGNOSTIC_UI[locale];
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
      setError(ui.errorName);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(ui.errorEmail);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), scores, locale }),
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
    <div className="w-full bg-ink text-paper px-page py-24">
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
              {ui.eyebrow}
            </p>
            <h2 className="font-display font-semibold text-2xl md:text-4xl mb-4">
              {ui.coverTitle}
            </h2>
            <p className="text-[rgba(237,230,216,0.8)] mb-7">
              {ui.coverBody}
            </p>
            <button
              type="button"
              onClick={start}
              className="inline-block font-body font-semibold text-[15px] px-7 py-3.5 rounded-[3px] bg-clay text-white hover:-translate-y-px transition-transform"
            >
              {ui.start}
            </button>
          </div>
        )}

        {screen === "questions" && (
          <div>
            <p className="font-mono text-[13px] text-sage mb-2">
              {ui.question(currentQuestion + 1, PILLARS.length)}
            </p>
            <h2 className="font-display font-semibold text-xl md:text-[26px] mb-6">
              {getPillarText(locale, PILLARS[currentQuestion].key).question}
            </h2>
            <div className="flex flex-col gap-2.5">
              {PILLARS[currentQuestion].options.map((opt, i) => (
                <button
                  key={opt.score}
                  type="button"
                  onClick={() => selectOption(opt.score)}
                  className="text-left bg-white text-ink border border-[rgba(20,25,43,0.15)] rounded-[3px] px-[18px] py-3.5 text-[15px] hover:border-clay hover:bg-[#fdf1ec] transition-colors"
                >
                  {getPillarText(locale, PILLARS[currentQuestion].key).options[i]}
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === "capture" && (
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-clay mb-3">
              {ui.captureEyebrow}
            </p>
            <h2 className="font-display font-semibold text-xl md:text-[28px] mb-4">
              {ui.captureTitle}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[420px]" noValidate>
              <label className="flex flex-col gap-1.5 text-sm font-semibold">
                <span>{ui.name}</span>
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
                <span>{ui.email}</span>
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
                <span>{ui.honeypot}</span>
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
                {submitting ? ui.sending : ui.seeResult}
              </button>
            </form>
          </div>
        )}

        {screen === "result" && winner && (
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-clay mb-3">
              {ui.resultEyebrow}
            </p>
            <h2 className="font-display font-semibold text-xl md:text-[28px] mb-4">
              {getPillarText(locale, winner.key).archetype}
            </h2>
            {(() => {
              const phaseKey = PILLAR_PHASE[winner.key];
              const phase = phaseKey ? getPhaseText(locale, phaseKey) : null;
              const label = getPillarText(locale, winner.key).label;
              return (
                <p className="font-mono text-sm uppercase tracking-wide text-[#E1D6C2] mb-4">
                  {phase ? (
                    <>
                      {ui.inPhase} <span className="text-clay">{phase.name}</span> &middot; {ui.priorityPillar} {label}
                    </>
                  ) : (
                    <>
                      {ui.priorityPillar} {label} &middot; {ui.allPhases}
                    </>
                  )}
                </p>
              );
            })()}
            <p className="text-[rgba(237,230,216,0.8)] mb-7">{getPillarText(locale, winner.key).description}</p>
            <Link
              href={localizedPath(locale, "nextYou")}
              className="inline-block font-body font-semibold text-[15px] px-7 py-3.5 rounded-[3px] bg-clay text-white hover:-translate-y-px transition-transform"
            >
              {ui.join}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
