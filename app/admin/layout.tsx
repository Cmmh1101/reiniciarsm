import type { Metadata } from "next";
import { AdminI18nProvider } from "@/components/admin/AdminI18n";
import { getAdminDictionary } from "@/lib/admin/dictionary";
import { getAdminLocale } from "@/lib/admin/i18n";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin — Carla Montaño",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const locale = getAdminLocale();
  return (
    <html lang={locale}>
      <body>
        <AdminI18nProvider locale={locale} dictionary={getAdminDictionary(locale)}>
          {children}
        </AdminI18nProvider>
      </body>
    </html>
  );
}
