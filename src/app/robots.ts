import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const BASE = SITE_URL.replace(/\/+$/, "");

/**
 * robots.txt del sitio. Permite todo el sitio público y bloquea el panel
 * (`/admin`) y los endpoints internos (`/api`). Apunta al sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
