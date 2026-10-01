"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/blog", label: "Recursos" },
  { href: "/mentorias", label: "Mentorías" },
  { href: "/productos", label: "Productos" },
  { href: "/comunidad", label: "Comunidad" },
  { href: "/mi-historia", label: "Sobre mí" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[rgba(237,230,216,0.9)] backdrop-blur-[10px] border-b border-[rgba(20,25,43,0.12)]">
      <div className="flex justify-between items-center px-[8vw] py-[18px]">
        <Link href="/" className="flex items-center gap-2.5 font-display font-semibold text-[17px]" onClick={() => setMenuOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path
              d="M3 19 C 7 14, 6 8, 12 8 C 18 8, 15 15, 21 15"
              stroke="var(--clay)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="3" cy="19" r="1.6" fill="var(--ink)" />
            <circle cx="21" cy="15" r="1.6" fill="var(--clay)" />
          </svg>
          Carla Montaño
        </Link>

        <div className="hidden md:flex gap-7 font-mono text-[11.5px] tracking-wide uppercase">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="opacity-65 hover:opacity-100 transition-opacity">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3.5">
          <Link
            href="/diagnostico-next-you"
            className="hidden sm:inline-block font-mono text-xs tracking-wide uppercase px-[18px] py-2.5 rounded-[2px] bg-clay text-paper"
            onClick={() => setMenuOpen(false)}
          >
            Diagnóstico gratis
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="md:hidden w-8 h-8 flex items-center justify-center shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[rgba(20,25,43,0.12)] px-[8vw] py-5 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-mono text-xs tracking-wide uppercase py-3 opacity-75 border-b border-[rgba(20,25,43,0.08)] last:border-b-0"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/diagnostico-next-you"
            onClick={() => setMenuOpen(false)}
            className="sm:hidden mt-4 text-center font-mono text-xs tracking-wide uppercase px-[18px] py-3 rounded-[2px] bg-clay text-paper"
          >
            Diagnóstico gratis
          </Link>
        </div>
      )}
    </nav>
  );
}
