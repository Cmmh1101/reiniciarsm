/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Preserves SEO and existing links from the old WordPress site once carlamontano.io's DNS
  // points here. Built from a full crawl of WordPress's own wp-sitemap.xml — see the migration
  // memory notes for the source list. `/herramientas`, `/contacto`, and the paid product at
  // `/products/empieza-en-tecnologia-con-claridad` were deliberately left out — those need
  // Carla's decision on a destination before redirecting, not a silent guess.
  async redirects() {
    return [
      // Blog posts that already lived on WordPress under a different slug.
      {
        source: "/como-elegir-tu-primer-rol-en-tecnologia-desde-diseno-hasta-automatizacion",
        destination: "/blog/como-elegir-tu-primer-rol-en-tecnologia-desde-diseno-hasta-automatizacion",
        permanent: true,
      },
      {
        source: "/de-mesera-a-software-engineer-mi-historia-completa-con-fechas-reales",
        destination: "/blog/de-mesera-a-software-engineer",
        permanent: true,
      },

      // WordPress pages that moved to a different path on the new site.
      { source: "/historiasguias", destination: "/blog", permanent: true },
      { source: "/1-1-sessions", destination: "/mentorias", permanent: true },
      { source: "/checkout", destination: "/mentorias", permanent: true },
      { source: "/shop", destination: "/mentorias", permanent: true },

      // WordPress pages with no equivalent on the new site (old lead magnets, WooCommerce
      // account pages, the pre-rebrand "Tu Camino Tech" landing page, the Linktree-style page).
      { source: "/links", destination: "/", permanent: true },
      { source: "/checklist-thankyou", destination: "/", permanent: true },
      { source: "/empieza-aqui", destination: "/", permanent: true },
      { source: "/customer-dashboard", destination: "/", permanent: true },

      // Bricks builder "card-link" entries that powered the old /links page.
      { source: "/card-link/comunidad", destination: "/comunidad", permanent: true },
      { source: "/card-link/:slug*", destination: "/", permanent: true },

      // FluentCRM form landing artifacts (not real content pages).
      { source: "/form/comunidad", destination: "/comunidad", permanent: true },
      { source: "/form/:slug*", destination: "/", permanent: true },
    ];
  },
};

module.exports = nextConfig;
