import type { Metadata } from "next";
import DiagnosticQuiz from "@/components/DiagnosticQuiz";

export const metadata: Metadata = {
  title: "Diagnóstico Next You — Carla Montaño",
  description: "8 preguntas para descubrir cuál de los 8 pilares de NEXT YOU™ necesita tu atención ahora mismo.",
};

export default function DiagnosticoPage() {
  return (
    <main>
      <DiagnosticQuiz />
    </main>
  );
}
