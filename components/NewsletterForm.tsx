"use client";

// Not wired yet — Flujo 2 / newsletter signup lands in Fase 2. Presentational only,
// matching the reference mockup (which also had onsubmit="return false;").

export function NewsletterFormHome() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex gap-2.5 flex-wrap justify-center">
      <input
        type="text"
        placeholder="Nombre"
        className="font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.12)] bg-paper flex-1 min-w-[200px]"
      />
      <input
        type="email"
        placeholder="Email"
        className="font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.12)] bg-paper flex-1 min-w-[200px]"
      />
      <button
        type="submit"
        className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper inline-flex items-center gap-2.5"
      >
        Unirme →
      </button>
    </form>
  );
}

export function NewsletterFormCompact() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex gap-2.5 flex-wrap justify-center">
      <input
        type="email"
        placeholder="Email"
        className="font-body text-sm px-4 py-3.5 rounded-[2px] border border-[rgba(20,25,43,0.12)] bg-paper flex-1 min-w-[200px] max-w-xs"
      />
      <button
        type="submit"
        className="font-mono text-xs tracking-wide uppercase px-[26px] py-3.5 rounded-[2px] bg-clay text-paper inline-flex items-center gap-2"
      >
        Unirme →
      </button>
    </form>
  );
}
