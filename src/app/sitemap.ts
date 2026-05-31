import type { MetadataRoute } from "next";
import { getAllNoticias, getAreas } from "@/lib/content";

// El sitemap consulta la base (noticias publicadas + áreas), por eso se sirve
// de forma dinámica: refleja siempre el contenido vigente.
export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Quita la barra final del base URL para evitar `//` al concatenar rutas. */
const BASE = SITE_URL.replace(/\/+$/, "");

/**
 * Sitemap del sitio público. Incluye:
 * - Rutas estáticas indexables (la home y los listados principales).
 * - Una entrada por noticia publicada (`/noticias/[slug]`, lastModified = updatedAt).
 * - Una entrada por área (`/areas/[slug]`).
 *
 * `/buscar` queda fuera a propósito: es `noindex` (sus resultados no aportan al
 * índice). `/admin` y `/api` tampoco se listan (los bloquea robots.txt).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${BASE}/noticias`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE}/prensa`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE}/informes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE}/quienes-somos`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Traemos todas las noticias publicadas (pageSize amplio: el dataset es chico).
  const [{ items: noticias }, areas] = await Promise.all([
    getAllNoticias(1, 1000),
    getAreas(),
  ]);

  const noticiaRoutes: MetadataRoute.Sitemap = noticias.map((n) => ({
    url: `${BASE}/noticias/${n.slug}`,
    lastModified: n.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // El modelo Area no tiene timestamp propio; usamos la fecha de generación.
  const areaRoutes: MetadataRoute.Sitemap = areas.map((a) => ({
    url: `${BASE}/areas/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...noticiaRoutes, ...areaRoutes];
}
