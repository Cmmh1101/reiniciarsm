import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

const TITLE = "Contáctame — Carla Montaño";
const DESCRIPTION = "¿Tienes preguntas, ideas o simplemente quieres saludar? Me encantaría leerte.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/contacto" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function ContactoPage() {
  return (
    <main className="px-[8vw] py-24">
      <div className="grid md:grid-cols-[1fr_1fr] gap-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-clay mb-4">Contacto</p>
          <h1 className="font-display text-[clamp(30px,4vw,44px)] leading-[1.1] mb-5 max-w-[16ch]">
            Contáctame
          </h1>
          <p className="text-base opacity-90 mb-4 max-w-[48ch]">{DESCRIPTION}</p>
          <p className="text-base opacity-90 mb-8 max-w-[48ch]">
            Este espacio es para ti: ya sea que quieras colaboración, asesoría o solo compartir tu
            historia, aquí tienes un canal directo conmigo.
          </p>

          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Email</p>
            <a href="mailto:hello@carlamontano.io" className="text-base underline">
              hello@carlamontano.io
            </a>
          </div>

          <div className="border-t border-[rgba(20,25,43,0.12)] pt-8">
            <h2 className="font-display text-xl mb-3">Colaboremos</h2>
            <p className="text-sm opacity-75 max-w-[48ch]">
              ¿Quieres proponer una alianza, invitarme a tu podcast, escribir como invitada en mi
              blog o trabajar en algo juntas? Estoy disponible para proyectos que inspiren y
              ayuden a más mujeres a crecer en tecnología.
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </main>
  );
}
