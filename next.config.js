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

  // Baseline security headers for every page. (A Content-Security-Policy is deliberately not set here:
  // it needs to be tuned for analytics and payments before it can be enforced without breaking them.)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  async redirects() {
    // Old WordPress and pre-bilingual URLs. The same list is applied in middleware.ts, because on Netlify
    // the middleware runs before these config redirects (and would otherwise send /blog to /es/blog, a 404).
    return legacyRedirects.map((r) => ({ ...r, permanent: true }));
  },
};

module.exports = nextConfig;
