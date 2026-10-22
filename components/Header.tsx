"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath, matchRoute, type RouteKey } from "@/lib/i18n/routes";
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

/** True when the visitor is on `href` or anywhere under it (e.g. a product page under the shop). Home only matches itself. */
function isActive(pathname: string, href: string, home: string): boolean {
  if (href === home) return pathname === home;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header({ locale, nav, siteName }: { locale: Locale; nav: Dictionary["nav"]; siteName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Spanish pages are served through a rewrite, so the pathname Next reports can be the internal (English) one
  // while the address bar shows the Spanish one. Resolve it to a route and rebuild the public path to compare.
  const rawPathname = usePathname() ?? "";
  const rest = rawPathname.replace(/^\/(en|es)(?=\/|$)/, "");
  const match = matchRoute(locale, rest) ?? matchRoute("en", rest);
  const pathname = match ? localizedPath(locale, match.key, match.params) : rawPathname;
  const home = localizedPath(locale, "home");
  const close = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-[rgba(237,230,216,0.92)] backdrop-blur-[10px] border-b border-[rgba(20,25,43,0.12)]">
      <div className="flex justify-between items-center gap-4 px-page py-2">
        <Link href={localizedPath(locale, "home")} className="shrink-0 block" onClick={close}>
          <Image src="/images/brand/logo-dark.png" alt={siteName} width={352} height={176} priority className="h-14 sm:h-16 w-auto" />
        </Link>

        <div className="hidden lg:flex gap-5 xl:gap-6 font-mono text-[11.5px] tracking-wide uppercase">
          {DESKTOP_LINKS.map((link) => {
            const href = localizedPath(locale, link.route);
            const active = isActive(pathname, href, home);
            return (
              <Link
                key={link.route}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap transition-opacity border-b-2 pb-0.5 ${active ? "opacity-100 border-clay-deep" : "opacity-70 hover:opacity-100 border-transparent"}`}
              >
                {nav[link.label]}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher locale={locale} label={nav.switchTo} ariaLabel={nav.switchAria} />
          <Link
            href={localizedPath(locale, "workWithMe")}
            aria-current={isActive(pathname, localizedPath(locale, "workWithMe"), home) ? "page" : undefined}
            className={`hidden sm:inline-block font-mono text-xs tracking-wide uppercase px-[18px] py-2.5 rounded-[2px] text-paper ${
              isActive(pathname, localizedPath(locale, "workWithMe"), home) ? "bg-ink ring-2 ring-clay-deep ring-offset-2 ring-offset-paper" : "bg-clay-deep"
            }`}
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
        <div className="lg:hidden border-t border-[rgba(20,25,43,0.12)] px-page py-5 flex flex-col gap-1">
          {MOBILE_LINKS.map((link) => {
            const href = localizedPath(locale, link.route);
            const active = isActive(pathname, href, home);
            return (
              <Link
                key={link.route}
                href={href}
                onClick={close}
                aria-current={active ? "page" : undefined}
                className={`font-mono text-xs tracking-wide uppercase py-3 pl-3 border-l-2 border-b border-b-[rgba(20,25,43,0.08)] last:border-b-0 ${
                  active ? "opacity-100 font-semibold border-l-clay-deep" : "opacity-75 border-l-transparent"
                }`}
              >
                {nav[link.label]}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
