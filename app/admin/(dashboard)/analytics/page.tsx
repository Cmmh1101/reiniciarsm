export default function AdminAnalyticsPage() {
  return (
    <main className="p-10 max-w-2xl">
      <h1 className="font-display text-2xl mb-4">Analytics</h1>
      <p className="opacity-70 mb-3">
        Google Analytics (GA4) todavía no está instalado en el sitio — no encontré ningún tag de
        seguimiento en carlamontano.io.
      </p>
      <p className="opacity-70">
        Para activar esta sección necesito: (1) que confirmes si quieres usar GA4, (2) acceso para
        crear o el ID de una propiedad GA4 existente, y (3) permiso para instalar el tag en el
        sitio. Una vez esté eso, el tráfico se sincroniza una vez al día y se muestra aquí — sin
        depender de la API de Google en el momento en que abres el panel.
      </p>
    </main>
  );
}
