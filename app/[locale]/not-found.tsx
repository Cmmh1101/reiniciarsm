"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizedPath } from "@/lib/i18n/routes";

// not-found.tsx doesn't receive route params, so the language comes from the requested path.
export default function NotFound() {
  const first = (usePathname() ?? "").split("/")[1];
  const locale = isLocale(first) ? first : DEFAULT_LOCALE;
  const { common, nav } = getDictionary(locale);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-page text-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">404</p>
        <h1 className="font-display text-[clamp(30px,4.4vw,48px)] leading-[1.1] mb-5 max-w-[20ch] mx-auto">{common.notFoundTitle}</h1>
        <p className="opacity-70 text-base max-w-[52ch] mx-auto mb-10">{common.notFoundBody}</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href={localizedPath(locale, "home")}
            className="font-mono text-xs tracking-wide uppercase border border-current opacity-85 hover:opacity-100 px-[26px] py-[15px] rounded-[2px] transition-opacity"
          >
            {common.notFoundCta}
          </Link>
          <Link
            href={localizedPath(locale, "workWithMe")}
            className="font-mono text-xs tracking-wide uppercase px-[26px] py-[15px] rounded-[2px] bg-clay text-paper hover:-translate-y-px transition-transform"
          >
            {nav.workWithMe} →
          </Link>
        </div>
      </div>
    </main>
  );
}
