"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClass = "font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.12)] bg-paper flex-1 min-w-[200px]";

function useNewsletterSubmit(locale: Locale) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(name: string, email: string) {
    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, locale }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return { status, submit };
}

interface Props {
  locale: Locale;
  copy: Dictionary["newsletter"];
  withName?: boolean;
  // On a dark background the error text needs the lighter terracotta to stay readable.
  dark?: boolean;
}

export default function NewsletterForm({ locale, copy, withName = true, dark = false }: Props) {
  const { status, submit } = useNewsletterSubmit(locale);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (status === "done") {
    return <p className="text-sm opacity-80">{copy.success}</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(name, email);
      }}
      className="flex gap-2.5 flex-wrap"
    >
      {withName && (
        <input type="text" placeholder={copy.namePlaceholder} aria-label={copy.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      )}
      <input type="email" placeholder={copy.emailPlaceholder} aria-label={copy.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      <button
        type="submit"
        disabled={status === "loading"}
        className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay-deep text-paper inline-flex items-center gap-2.5 disabled:opacity-70"
      >
        {status === "loading" ? copy.sending : `${copy.button} →`}
      </button>
      {status === "error" && <p role="alert" className={`${dark ? "text-clay-soft" : "text-clay-deep"} text-xs w-full`}>{copy.error}</p>}
    </form>
  );
}
