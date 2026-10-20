"use client";

import { useRouter } from "next/navigation";
import { ADMIN_LOCALE_COOKIE } from "@/lib/admin/constants";
import type { Locale } from "@/lib/i18n/config";

// Saves the choice in a cookie and re-renders the page in the new language.
export default function AdminLanguageSwitcher({ locale, className }: { locale: Locale; className?: string }) {
  const router = useRouter();

  function choose(next: Locale) {
    if (next === locale) return;
    document.cookie = `${ADMIN_LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div role="group" aria-label="Language / Idioma" className={className ?? "flex gap-1 font-mono text-[11px] uppercase tracking-wide"}>
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => choose(l)}
          aria-pressed={locale === l}
          lang={l}
          className={`px-2 py-1 rounded-[3px] border ${locale === l ? "border-current opacity-100" : "border-transparent opacity-70 hover:opacity-100"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
