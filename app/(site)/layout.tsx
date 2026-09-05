import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";

export const metadata: Metadata = {
  title: "Carla Montaño — Reiniciar Sin Mapa",
  description: "Reiniciar Sin Mapa / NEXT YOU™ — mentoría y comunidad para reinventarte profesionalmente.",
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
