"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClass = "font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.15)] bg-white";

export default function ContactForm({ locale, copy, initialIntent }: { locale: Locale; copy: Dictionary["contact"]; initialIntent?: string }) {
  const startIntent = copy.intents.some((i) => i.value === initialIntent) ? (initialIntent as string) : copy.intents[0].value;
  const [intent, setIntent] = useState(startIntent);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !EMAIL_RE.test(email) || !message.trim()) {
      setError(copy.required);
      return;
    }

    setStatus("loading");
    try {
      const intentLabel = copy.intents.find((i) => i.value === intent)?.label ?? intent;
      const res = await fetch("/api/contact-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject: intentLabel, intent, locale, message }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
    } catch {
      setStatus("error");
      setError(copy.error);
    }
  }

  if (status === "done") {
    return <p className="text-base opacity-80">{copy.success}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[480px]">
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        <span>{copy.intentLabel}</span>
        <select value={intent} onChange={(e) => setIntent(e.target.value)} className={inputClass}>
          {copy.intents.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <input type="text" placeholder={copy.nameLabel} value={name} onChange={(e) => setName(e.target.value)} aria-label={copy.nameLabel} className={inputClass} />
        <input type="email" placeholder={copy.emailLabel} required value={email} onChange={(e) => setEmail(e.target.value)} aria-label={copy.emailLabel} className={inputClass} />
      </div>
      <textarea
        placeholder={copy.messageLabel}
        aria-label={copy.messageLabel}
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={`${inputClass} resize-none`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper self-start disabled:opacity-60"
      >
        {status === "loading" ? copy.sending : `${copy.send} →`}
      </button>
      {error && <p role="alert" className="text-clay text-sm">{error}</p>}
    </form>
  );
}
