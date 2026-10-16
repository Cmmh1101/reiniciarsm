"use client";

import { useState } from "react";
import Link from "next/link";
import { computeProfile, QUESTION_COUNT, type ProfileKey } from "@/lib/nextStep";
import { NEXT_STEP_CONTENT, type ProfileText } from "@/lib/i18n/content/nextStep";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routes";
import { MONTANO_SYSTEMS_URL } from "@/lib/constants";

type Screen = "cover" | "questions" | "capture" | "result";

const buttonClass = "inline-block font-body font-semibold text-[15px] px-7 py-3.5 rounded-[3px] bg-clay text-white hover:-translate-y-px transition-transform";
const secondaryClass = "inline-block font-body font-semibold text-[15px] px-7 py-3.5 rounded-[3px] border border-[rgba(237,230,216,0.4)] hover:-translate-y-px transition-transform";

function linkFor(locale: Locale, target: ProfileText["primary"]["target"] | ProfileText["secondary"]["target"]): { href: string; external?: boolean } {
  const work = localizedPath(locale, "workWithMe");
  const contact = localizedPath(locale, "contact");
  switch (target) {
    case "book-sos":
      return { href: `${work}?plan=sos#book` };
    case "book-session":
      return { href: `${work}?plan=session#book` };
    case "next-you":
      return { href: localizedPath(locale, "nextYou") };
    case "shop":
      return { href: localizedPath(locale, "shop") };
    case "resources":
      return { href: localizedPath(locale, "resources") };
    case "mentoring":
      return { href: localizedPath(locale, "mentoring") };
    case "diagnostic":
      return { href: localizedPath(locale, "diagnostic") };
    case "contact-workshop":
      return { href: `${contact}?intent=workshop` };
    case "contact-build":
      return { href: `${contact}?intent=custom-build` };
    case "montano-systems":
      return { href: MONTANO_SYSTEMS_URL, external: true };
  }
}

function ActionLink({ locale, target, label, className }: { locale: Locale; target: ProfileText["primary"]["target"] | ProfileText["secondary"]["target"]; label: string; className: string }) {
  const { href, external } = linkFor(locale, target);
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {label} ↗
    </a>
  ) : (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export default function NextStepQuiz({ locale }: { locale: Locale }) {
  const c = NEXT_STEP_CONTENT[locale];
  const [screen, setScreen] = useState<Screen>("cover");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<ProfileKey | null>(null);

  function start() {
    setCurrent(0);
    setAnswers([]);
    setProfile(null);
    setScreen("questions");
  }

  function choose(option: number) {
    const next = [...answers.slice(0, current), option];
    setAnswers(next);
    if (current + 1 < QUESTION_COUNT) setCurrent(current + 1);
    else setScreen("capture");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const computed = computeProfile(answers);

    if (honeypot) {
      setProfile(computed);
      setScreen("result");
      return;
    }
    if (!name.trim()) {
      setError(c.errorName);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(c.errorEmail);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/next-step-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), answers, locale }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setProfile((data.profile as ProfileKey) ?? computed);
    } catch {
      // Don't block the result on a network hiccup — show it; worst case the lead didn't save.
      setProfile(computed);
    } finally {
      setSubmitting(false);
      setScreen("result");
    }
  }

  const progress = screen === "questions" ? (current / QUESTION_COUNT) * 100 : 0;
  const q = c.questions[current];
  const result = profile ? c.profiles[profile] : null;

  return (
    <div className="w-full bg-ink text-paper px-[8vw] py-24">
      <div className="max-w-[640px] mx-auto">
        {screen === "questions" && (
          <div className="h-1 rounded-full overflow-hidden mb-8 bg-[rgba(237,230,216,0.15)]">
            <div className="h-full bg-sage transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        )}

        {screen === "cover" && (
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-3">{c.eyebrow}</p>
            <h1 className="font-display font-semibold text-3xl md:text-5xl leading-[1.08] mb-4">{c.title}</h1>
            <p className="text-[rgba(237,230,216,0.8)] mb-7">{c.lead}</p>
            <button type="button" onClick={start} className={buttonClass}>
              {c.start}
            </button>
          </div>
        )}

        {screen === "questions" && q && (
          <div>
            <p className="font-mono text-[13px] text-sage mb-2">{c.questionOf(current + 1, QUESTION_COUNT)}</p>
            <h2 className="font-display font-semibold text-xl md:text-[26px] mb-6">{q.question}</h2>
            <div className="flex flex-col gap-2.5">
              {q.options.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => choose(i)}
                  className={`text-left bg-white text-ink border rounded-[3px] px-[18px] py-3.5 text-[15px] hover:border-clay hover:bg-[#fdf1ec] transition-colors ${
                    answers[current] === i ? "border-clay" : "border-[rgba(20,25,43,0.15)]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {current > 0 && (
              <button type="button" onClick={() => setCurrent(current - 1)} className="mt-5 font-mono text-xs opacity-60 hover:opacity-100">
                ← {locale === "en" ? "Back" : "Atrás"}
              </button>
            )}
          </div>
        )}

        {screen === "capture" && (
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-3">{c.captureEyebrow}</p>
            <h2 className="font-display font-semibold text-xl md:text-[28px] mb-3">{c.captureTitle}</h2>
            <p className="text-sm text-[rgba(237,230,216,0.75)] mb-5 max-w-[48ch]">{c.captureBody}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[420px]" noValidate>
              <label className="flex flex-col gap-1.5 text-sm font-semibold">
                <span>{c.name}</span>
                <input
                  type="text"
                  autoComplete="given-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(237,230,216,0.25)] bg-white text-ink"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-semibold">
                <span>{c.email}</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(237,230,216,0.25)] bg-white text-ink"
                />
              </label>
              {/* Honeypot anti-spam: hidden from real users, a bot will fill it in */}
              <label className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                <span>{c.honeypot}</span>
                <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </label>
              {error && (
                <p role="alert" className="text-clay-soft text-sm">
                  {error}
                </p>
              )}
              <button type="submit" disabled={submitting} className={`${buttonClass} disabled:opacity-60`}>
                {submitting ? c.sending : c.seeResult}
              </button>
            </form>
          </div>
        )}

        {screen === "result" && result && (
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-3">{c.resultEyebrow}</p>
            <h2 className="font-display font-semibold text-2xl md:text-4xl leading-[1.1] mb-4">{result.label}</h2>
            <p className="text-[rgba(237,230,216,0.85)] mb-7 max-w-[56ch]">{result.summary}</p>
            <div className="flex flex-wrap gap-3 mb-6">
              <ActionLink locale={locale} target={result.primary.target} label={result.primary.cta} className={buttonClass} />
              <ActionLink locale={locale} target={result.secondary.target} label={result.secondary.cta} className={secondaryClass} />
            </div>
            <p className="text-xs opacity-55 mb-5">{c.emailNote}</p>
            <button type="button" onClick={start} className="font-mono text-xs opacity-60 hover:opacity-100 underline">
              {c.retake}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
