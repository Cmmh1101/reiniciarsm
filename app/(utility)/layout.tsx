import type { Metadata } from "next";
import Analytics from "@/components/Analytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary } from "@/lib/i18n/dictionary";
import "../globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carlamontano.io";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

// Pages that live outside the /en and /es tree because their links are already in sent emails
// (e.g. /resenar/[purchaseId]). They are Spanish for now — the review-request email is Spanish.
export default function UtilityLayout({ children }: { children: React.ReactNode }) {
  const dict = getDictionary("es");
  return (
    <html lang="es">
      <body>
        <Analytics />
        <Header locale="es" nav={dict.nav} siteName={dict.site.name} />
        {children}
        <Footer locale="es" dict={dict} />
      </body>
    </html>
  );
}
