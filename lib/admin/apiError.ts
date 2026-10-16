import { NextResponse } from "next/server";
import { getAdminLocale } from "@/lib/admin/i18n";

/** JSON error response worded in the admin's language (read from the same cookie as the panel). */
export function adminError(status: number, en: string, es: string): NextResponse {
  return NextResponse.json({ error: getAdminLocale() === "es" ? es : en }, { status });
}
