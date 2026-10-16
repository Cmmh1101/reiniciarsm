"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath, type RouteKey } from "@/lib/i18n/routes";
import type { Dictionary } from "@/lib/i18n/dictionary";

const DESKTOP_LINKS: { route: RouteKey; label: keyof Dictionary["nav"] }[] = [
  { route: "home", label: "home" },
  { route: "about", label: "about" },
  { route: "work", label: "work" },
  { route: "ventures", label: "ventures" },
  { route: "shop", label: "shop" },
  { route: "resources", label: "resources" },
  { route: "contact", label: "contact" },
];

const MOBILE_LINKS: { route: RouteKey; label: keyof Dictionary["nav"] }[] = [...DESKTOP_LINKS.slice(0, 1), { route: "workWithMe", label: "workWithMe" }, ...DESKTOP_LINKS.slice(1)];

export default function Header({ locale, nav, siteName }: { locale: Locale; nav: Dictionary["nav"]; siteName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-[rgba(237,230,216,0.92)] backdrop-blur-[10px] border-b border-[rgba(20,25,43,0.12)]">
      <div className="flex justify-between items-center gap-4 px-[8vw] py-[16px]">
        <Link href={localizedPath(locale, "home")} className="flex items-center gap-2.5 font-display font-semibold text-[18px] tracking-tight shrink-0" onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
            <path d="M3 19 C 7 14, 6 8, 12 8 C 18 8, 15 15, 21 15" stroke="var(--clay)" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="3" cy="19" r="1.6" fill="var(--ink)" />
            <circle cx="21" cy="15" r="1.6" fill="var(--clay)" />
          </svg>
          {siteName}
        </Link>

        <div className="hidden lg:flex gap-5 xl:gap-6 font-mono text-[11.5px] tracking-wide uppercase">
          {DESKTOP_LINKS.map((link) => (
            <Link key={link.route} href={localizedPath(locale, link.route)} className="opacity-65 hover:opacity-100 transition-opacity">
              {nav[link.label]}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher locale={locale} label={nav.switchTo} ariaLabel={nav.switchAria} />
          <Link
            href={localizedPath(locale, "workWithMe")}
            className="hidden sm:inline-block font-mono text-xs tracking-wide uppercase px-[18px] py-2.5 rounded-[2px] bg-clay text-paper"
            onClick={close}
          >
            {nav.workWithMe}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? nav.closeMenu : nav.openMenu}
            className="lg:hidden w-8 h-8 flex items-center justify-center shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
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
        <div className="lg:hidden border-t border-[rgba(20,25,43,0.12)] px-[8vw] py-5 flex flex-col gap-1">
          {MOBILE_LINKS.map((link) => (
            <Link
              key={link.route}
              href={localizedPath(locale, link.route)}
              onClick={close}
              className="font-mono text-xs tracking-wide uppercase py-3 opacity-75 border-b border-[rgba(20,25,43,0.08)] last:border-b-0"
            >
              {nav[link.label]}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
