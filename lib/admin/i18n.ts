import { cookies, headers } from "next/headers";
import { isLocale, type Locale } from "@/lib/i18n/config";

import { ADMIN_LOCALE_COOKIE } from "@/lib/admin/constants";

/** Language of the admin panel for this request: the saved choice, else the browser's language (Spanish or English). */
export function getAdminLocale(): Locale {
  const saved = cookies().get(ADMIN_LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;
  const accept = headers().get("accept-language")?.toLowerCase() ?? "";
  return accept.startsWith("es") ? "es" : "en";
}
