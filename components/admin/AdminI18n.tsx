"use client";

import { createContext, useContext } from "react";
import type { AdminDictionary } from "@/lib/admin/dictionary";
import type { Locale } from "@/lib/i18n/config";

interface AdminI18nValue {
  locale: Locale;
  t: AdminDictionary;
}

const AdminI18nContext = createContext<AdminI18nValue | null>(null);

export function AdminI18nProvider({ locale, dictionary, children }: { locale: Locale; dictionary: AdminDictionary; children: React.ReactNode }) {
  return <AdminI18nContext.Provider value={{ locale, t: dictionary }}>{children}</AdminI18nContext.Provider>;
}

/** Admin copy and language for client components. */
export function useAdminI18n(): AdminI18nValue {
  const value = useContext(AdminI18nContext);
  if (!value) throw new Error("useAdminI18n must be used inside AdminI18nProvider");
  return value;
}
