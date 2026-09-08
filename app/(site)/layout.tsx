import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carlamontano.io";
const DEFAULT_TITLE = "Carla Montaño — Reiniciar Sin Mapa";
const DEFAULT_DESCRIPTION =
  "Reiniciar Sin Mapa / NEXT YOU™ — mentoría y comunidad para reinventarte profesionalmente.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    siteName: "Carla Montaño",
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
