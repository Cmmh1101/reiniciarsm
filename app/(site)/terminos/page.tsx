import type { Metadata } from "next";

const TITLE = "Términos y Condiciones — Carla Montaño";
const DESCRIPTION = "Los términos que rigen el uso de carlamontano.io y la compra de nuestros productos y servicios.";
const LAST_UPDATED = "24 de septiembre de 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: true, follow: true },
};

export default function TerminosPage() {
  return (
    <main>
      <header className="bg-ink text-paper px-[8vw] pt-[70px] pb-[50px]">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">Legal</p>
        <h1 className="font-display text-[clamp(28px,4vw,42px)] max-w-[24ch] mb-4 leading-[1.1]">Términos y Condiciones</h1>
        <p className="font-mono text-xs opacity-55">Última actualización: {LAST_UPDATED}</p>
      </header>

      <article className="max-w-[680px] mx-auto px-[8vw] py-[70px] prose-post">
        <p>Al usar este sitio (carlamontano.io) o comprar cualquiera de nuestros productos o servicios, aceptas estos términos.</p>

        <h2>Quiénes somos</h2>
        <p>
          Este sitio es operado por Carla Montaño, bajo el proyecto Reiniciar Sin Mapa / NEXT YOU™. Puedes
          contactarnos en hello@carlamontano.io.
        </p>

        <h2>Qué ofrecemos</h2>
        <ul>
          <li>Contenido educativo gratuito (blog, Diagnóstico Next You, redes sociales).</li>
          <li>Productos digitales descargables (guías, workbooks, plantillas de sitio web).</li>
          <li>Sesiones de mentoría 1:1.</li>
          <li>La Comunidad Next You, una membresía alojada en Skool.</li>
        </ul>

        <h2>Productos digitales</h2>
        <ul>
          <li>Al comprar un producto digital, recibes un enlace de descarga por correo y en la página de confirmación.</li>
          <li>El enlace de descarga es personal — no lo compartas ni lo revendas.</li>
          <li>
            Por la naturaleza de los productos digitales, no ofrecemos reembolsos una vez que el enlace de descarga
            fue entregado, salvo que la ley aplicable exija lo contrario. Si tienes un problema con tu compra
            (archivo dañado, el correo no llegó, etc.), escríbenos a hello@carlamontano.io y lo resolvemos.
          </li>
          <li>
            Las plantillas de sitio web se entregan &quot;tal cual&quot; — no incluyen soporte técnico de instalación
            salvo que se indique lo contrario en la descripción del producto.
          </li>
        </ul>

        <h2>Mentoría</h2>
        <ul>
          <li>Las sesiones de mentoría se agendan según la disponibilidad mostrada en el sitio.</li>
          <li>Si necesitas cancelar o reprogramar, avísanos con al menos 24 horas de anticipación escribiendo a hello@carlamontano.io.</li>
          <li>Los paquetes de sesiones deben usarse dentro de los 3 meses siguientes a la compra.</li>
        </ul>

        <h2>Comunidad Next You</h2>
        <ul>
          <li>El acceso a la Comunidad Next You se gestiona a través de Skool y está sujeto también a los términos de esa plataforma.</li>
          <li>Puedes cancelar tu membresía en cualquier momento desde tu cuenta de Skool.</li>
        </ul>

        <h2>Propiedad intelectual</h2>
        <p>
          Todo el contenido de este sitio —textos, guiones, gráficas, el método NEXT YOU™, los productos digitales—
          es propiedad de Carla Montaño. No puedes copiarlo, redistribuirlo ni revenderlo sin permiso escrito, salvo
          la plantilla de sitio web, que sí está pensada para que la adaptes y uses como base de tu propio sitio.
        </p>

        <h2>No es asesoría profesional</h2>
        <p>
          El contenido de este sitio, la mentoría y la Comunidad Next You son de carácter educativo y de
          acompañamiento. No sustituyen asesoría legal, migratoria, financiera, psicológica o médica profesional. Los
          resultados de cualquier persona dependen de su propio esfuerzo y circunstancias — no garantizamos
          resultados específicos.
        </p>

        <h2>Limitación de responsabilidad</h2>
        <p>
          Usamos el sitio y nuestros servicios de buena fe, pero no somos responsables por daños indirectos derivados
          de su uso, en la medida permitida por la ley.
        </p>

        <h2>Cambios a estos términos</h2>
        <p>
          Podemos actualizar estos términos de vez en cuando. La fecha de &quot;Última actualización&quot; arriba
          refleja la versión más reciente.
        </p>

        <h2>Ley aplicable</h2>
        <p>Estos términos se rigen por las leyes aplicables en la jurisdicción donde opera este negocio.</p>

        <h2>Contacto</h2>
        <p>¿Preguntas sobre estos términos? Escríbenos a hello@carlamontano.io.</p>
      </article>
    </main>
  );
}
