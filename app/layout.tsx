import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carla Montaño — Reiniciar Sin Mapa",
  description: "Reiniciar Sin Mapa / NEXT YOU™ — mentoría y comunidad para reinventarte profesionalmente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
