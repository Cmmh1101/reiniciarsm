const routes = require("./lib/i18n/routes.json");
const legacyRedirects = require("./lib/i18n/legacy-redirects.json");

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
    // Old WordPress and pre-bilingual URLs. The same list is applied in middleware.ts, because on Netlify
    // the middleware runs before these config redirects (and would otherwise send /blog to /es/blog, a 404).
    return legacyRedirects.map((r) => ({ ...r, permanent: true }));
  },
};

module.exports = nextConfig;
