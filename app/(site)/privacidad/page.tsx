import type { Metadata } from "next";

const TITLE = "Política de Privacidad — Carla Montaño";
const DESCRIPTION = "Qué información recopilamos en carlamontano.io, cómo la usamos, y qué derechos tienes sobre ella.";
const LAST_UPDATED = "24 de septiembre de 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <main>
      <header className="bg-ink text-paper px-[8vw] pt-[70px] pb-[50px]">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">Legal</p>
        <h1 className="font-display text-[clamp(28px,4vw,42px)] max-w-[24ch] mb-4 leading-[1.1]">Política de Privacidad</h1>
        <p className="font-mono text-xs opacity-55">Última actualización: {LAST_UPDATED}</p>
      </header>

      <article className="max-w-[680px] mx-auto px-[8vw] py-[70px] prose-post">
        <p>
          Este sitio (carlamontano.io) es operado por Carla Montaño (&quot;nosotros&quot;, &quot;nuestro&quot;). Esta
          política explica qué información recopilamos, cómo la usamos, y qué derechos tienes sobre ella.
        </p>

        <h2>Qué información recopilamos</h2>
        <ul>
          <li>
            <strong>Información de contacto:</strong> cuando te suscribes al newsletter, completas el Diagnóstico Next
            You, llenas el formulario de contacto o compras un producto, recopilamos tu nombre y correo electrónico.
          </li>
          <li>
            <strong>Información de pago:</strong> cuando compras un producto o una sesión de mentoría, el pago se
            procesa a través de Stripe. No almacenamos los datos de tu tarjeta — Stripe los maneja directamente bajo
            sus propios estándares de seguridad (PCI-DSS).
          </li>
          <li>
            <strong>Información de uso:</strong> usamos Google Analytics para entender cómo se usa el sitio (páginas
            visitadas, tiempo en el sitio, ubicación aproximada). Esta información es agregada y no te identifica
            individualmente.
          </li>
          <li>
            <strong>Comunidad:</strong> si te unes a la Comunidad Next You, esa membresía y tu actividad ahí se rigen
            también por las políticas de privacidad de Skool, la plataforma donde vive la comunidad.
          </li>
        </ul>

        <h2>Cómo usamos tu información</h2>
        <ul>
          <li>Para enviarte lo que pediste: tu diagnóstico, el producto que compraste, respuestas a tu mensaje de contacto.</li>
          <li>Para enviarte correos de nuestro newsletter, si te suscribiste — siempre puedes darte de baja con un clic desde cualquier correo.</li>
          <li>Para mejorar el sitio y el contenido, basándonos en qué páginas y recursos son más útiles.</li>
          <li>Nunca vendemos tu información a terceros.</li>
        </ul>

        <h2>Con quién compartimos tu información</h2>
        <p>Usamos los siguientes proveedores para operar el sitio — cada uno solo recibe la información necesaria para su función:</p>
        <ul>
          <li><strong>Stripe</strong> — procesamiento de pagos.</li>
          <li><strong>Resend</strong> — envío de correos (newsletter, confirmaciones, secuencias automáticas).</li>
          <li><strong>Google Analytics</strong> — analítica de uso del sitio.</li>
          <li><strong>Netlify</strong> — hosting del sitio.</li>
          <li><strong>Supabase</strong> — almacenamiento seguro de la base de datos.</li>
          <li><strong>Skool</strong> — plataforma de la Comunidad Next You, si te unes a ella.</li>
        </ul>
        <p>No compartimos tu información con nadie más, excepto si la ley nos lo exige.</p>

        <h2>Cuánto tiempo guardamos tu información</h2>
        <p>
          Guardamos tu información mientras mantengas una relación activa con nosotros (suscrito al newsletter,
          cliente, miembro de la comunidad) o hasta que solicites que la eliminemos.
        </p>

        <h2>Tus derechos</h2>
        <p>Puedes en cualquier momento:</p>
        <ul>
          <li>Pedir una copia de la información que tenemos sobre ti.</li>
          <li>Pedir que corrijamos información incorrecta.</li>
          <li>Pedir que eliminemos tu información (dentro de lo que la ley y nuestras obligaciones contables/fiscales nos permitan).</li>
          <li>Darte de baja del newsletter con un clic desde cualquier correo.</li>
        </ul>
        <p>Para cualquiera de estos, escríbenos a hello@carlamontano.io.</p>

        <h2>Cookies</h2>
        <p>
          Este sitio usa cookies de Google Analytics para entender el uso del sitio. Puedes bloquear o eliminar
          cookies desde la configuración de tu navegador.
        </p>

        <h2>Menores de edad</h2>
        <p>Este sitio no está dirigido a menores de 18 años. No recopilamos intencionalmente información de menores.</p>

        <h2>Cambios a esta política</h2>
        <p>
          Podemos actualizar esta política de vez en cuando. La fecha de &quot;Última actualización&quot; arriba
          refleja la versión más reciente.
        </p>

        <h2>Contacto</h2>
        <p>¿Preguntas sobre esta política? Escríbenos a hello@carlamontano.io.</p>
      </article>
    </main>
  );
}
