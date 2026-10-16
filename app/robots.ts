import type { MetadataRoute } from "next";

// Only the production deploy should be indexed. Netlify sets CONTEXT to "production", "deploy-preview" or "branch-deploy".
const isProduction = !process.env.CONTEXT || process.env.CONTEXT === "production";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carlamontano.io";

  if (!isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
