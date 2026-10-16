"use client";

import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { switchLocalePath } from "@/lib/i18n/routes";

interface Props {
  locale: Locale;
  label: string;
  ariaLabel: string;
  className?: string;
}

// A plain <a> (full navigation) on purpose: the root layout sets <html lang>, so switching language should reload it.
export default function LanguageSwitcher({ locale, label, ariaLabel, className }: Props) {
  const pathname = usePathname() ?? `/${locale}`;
  const target: Locale = locale === "en" ? "es" : "en";

  function rememberChoice() {
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <a
      href={switchLocalePath(pathname, target)}
      hrefLang={target}
      lang={target}
      aria-label={ariaLabel}
      onClick={rememberChoice}
      className={className ?? "font-mono text-[11.5px] tracking-wide uppercase opacity-65 hover:opacity-100 transition-opacity"}
    >
      {label}
    </a>
  );
}
