"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function useNewsletterSubmit() {
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
        body: JSON.stringify({ name, email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return { status, submit };
}

export function NewsletterFormHome() {
  const { status, submit } = useNewsletterSubmit();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (status === "done") {
    return <p className="text-sm opacity-70">Listo — revisa tu correo, ya te escribí.</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(name, email);
      }}
      className="flex gap-2.5 flex-wrap justify-center"
    >
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.12)] bg-paper flex-1 min-w-[200px]"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.12)] bg-paper flex-1 min-w-[200px]"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper inline-flex items-center gap-2.5 disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Unirme →"}
      </button>
      {status === "error" && <p className="text-clay text-xs w-full text-center">Correo inválido — inténtalo de nuevo.</p>}
    </form>
  );
}

export function NewsletterFormCompact() {
  const { status, submit } = useNewsletterSubmit();
  const [email, setEmail] = useState("");

  if (status === "done") {
    return <p className="text-sm opacity-70">Listo — revisa tu correo, ya te escribí.</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit("", email);
      }}
      className="flex gap-2.5 flex-wrap justify-center"
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.12)] bg-paper flex-1 min-w-[200px] max-w-xs"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="font-mono text-xs tracking-wide uppercase px-[26px] py-3.5 rounded-[2px] bg-clay text-paper inline-flex items-center gap-2 disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Unirme →"}
      </button>
      {status === "error" && <p className="text-clay text-xs w-full text-center">Correo inválido — inténtalo de nuevo.</p>}
    </form>
  );
}
