const routes = require("./lib/i18n/routes.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Spanish public slugs are served by the same internal (English-named) routes. Specific paths
  // come first so e.g. /es/tienda/gracias wins over /es/tienda/:slug.
  async rewrites() {
    const rewrites = Object.values(routes)
      .filter((r) => r.es !== r.en && r.es !== "")
      .sort((a, b) => a.es.split(":").length - b.es.split(":").length)
      .map((r) => ({ source: `/es/${r.es}`, destination: `/es/${r.en}` }));
    return { beforeFiles: rewrites };
  },

  async redirects() {
    return [
      // Pages and posts that already lived on WordPress under a different slug.
      { source: "/como-elegir-tu-primer-rol-en-tecnologia-desde-diseno-hasta-automatizacion", destination: "/es/recursos/como-elegir-tu-primer-rol-en-tecnologia-desde-diseno-hasta-automatizacion", permanent: true },
      { source: "/de-mesera-a-software-engineer-mi-historia-completa-con-fechas-reales", destination: "/es/recursos/de-mesera-a-software-engineer", permanent: true },
      { source: "/historiasguias", destination: "/es/recursos", permanent: true },
      { source: "/1-1-sessions", destination: "/es/trabaja-conmigo/mentoria", permanent: true },
      { source: "/checkout", destination: "/es/trabaja-conmigo/mentoria", permanent: true },
      { source: "/shop", destination: "/es/trabaja-conmigo/mentoria", permanent: true },

      // WordPress pages with no equivalent on the new site (old lead magnets, WooCommerce account
      // pages, the pre-rebrand landing page, the Linktree-style page).
      { source: "/links", destination: "/es", permanent: true },
      { source: "/checklist-thankyou", destination: "/es", permanent: true },
      { source: "/empieza-aqui", destination: "/es", permanent: true },
      { source: "/customer-dashboard", destination: "/es", permanent: true },
      { source: "/card-link/comunidad", destination: "/es/proyectos/next-you", permanent: true },
      { source: "/card-link/:slug*", destination: "/es", permanent: true },
      { source: "/form/comunidad", destination: "/es/proyectos/next-you", permanent: true },
      { source: "/form/:slug*", destination: "/es", permanent: true },
      { source: "/herramientas", destination: "/es", permanent: true },
      { source: "/products/empieza-en-tecnologia-con-claridad", destination: "/es/tienda/el-mapa-de-tu-reinicio-workbook", permanent: true },

      // Spanish URLs from before the bilingual redesign -> their /es equivalents (flattened, no chains).
      { source: "/blog", destination: "/es/recursos", permanent: true },
      { source: "/blog/:slug", destination: "/es/recursos/:slug", permanent: true },
      { source: "/mi-historia", destination: "/es/sobre-mi", permanent: true },
      { source: "/productos", destination: "/es/tienda", permanent: true },
      { source: "/productos/gracias", destination: "/es/tienda/gracias", permanent: true },
      { source: "/productos/:slug", destination: "/es/tienda/:slug", permanent: true },
      { source: "/mentorias", destination: "/es/trabaja-conmigo/mentoria", permanent: true },
      { source: "/mentorias/gracias", destination: "/es/trabaja-conmigo/mentoria/gracias", permanent: true },
      { source: "/comunidad", destination: "/es/proyectos/next-you", permanent: true },
      { source: "/diagnostico-next-you", destination: "/es/proyectos/next-you/diagnostico", permanent: true },
      { source: "/contacto", destination: "/es/contacto", permanent: true },
      { source: "/privacidad", destination: "/es/privacidad", permanent: true },
      { source: "/terminos", destination: "/es/terminos", permanent: true },
    ];
  },
};

module.exports = nextConfig;
