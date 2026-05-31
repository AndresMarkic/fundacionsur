import { prisma } from "@/lib/prisma";
import type { MenuItemView } from "@/lib/types";

// ---------------------------------------------------------------------------
// Helpers puros (testeables sin BD)
// ---------------------------------------------------------------------------

/** Fila cruda de MenuItem (subset necesario para armar el árbol). */
export type MenuRow = {
  id: string;
  label: string;
  href: string;
  parentId: string | null;
  order: number;
  isCTA: boolean;
};

/**
 * Arma el árbol del menú a partir de filas planas:
 * - raíces = items con `parentId === null`, ordenadas por `order` asc.
 * - cada raíz lleva sus hijos (mismo `parentId`) ordenados por `order` asc.
 * - los huérfanos (parentId que no apunta a una raíz existente) se ignoran.
 */
export function buildMenuTree(rows: MenuRow[]): MenuItemView[] {
  const byOrder = (a: MenuRow, b: MenuRow) => a.order - b.order;

  const roots = rows.filter((r) => r.parentId === null).sort(byOrder);
  const rootIds = new Set(roots.map((r) => r.id));

  const childrenByParent = new Map<string, MenuRow[]>();
  for (const row of rows) {
    if (row.parentId && rootIds.has(row.parentId)) {
      const list = childrenByParent.get(row.parentId) ?? [];
      list.push(row);
      childrenByParent.set(row.parentId, list);
    }
  }

  return roots.map((root) => {
    const kids = (childrenByParent.get(root.id) ?? [])
      .sort(byOrder)
      .map((c) => ({ label: c.label, href: c.href, isCTA: c.isCTA }));

    const node: MenuItemView = {
      label: root.label,
      href: root.href,
      isCTA: root.isCTA,
    };
    if (kids.length) node.children = kids;
    return node;
  });
}

/** Fila cruda de HomeBlock (subset necesario para parsear). */
export type HomeBlockRow = {
  id: string;
  type: string;
  order: number;
  visible: boolean;
  dataJson: string;
};

/** HomeBlock con `dataJson` ya parseado a objeto. */
export type ParsedBlock = Omit<HomeBlockRow, "dataJson"> & {
  data: Record<string, unknown>;
};

/**
 * Parsea `dataJson` de un bloque a objeto. Tolera JSON inválido o vacío
 * devolviendo `{}` (nunca lanza, así un bloque corrupto no rompe la home).
 */
export function parseBlock(block: HomeBlockRow): ParsedBlock {
  let data: Record<string, unknown> = {};
  if (block.dataJson) {
    try {
      const parsed = JSON.parse(block.dataJson);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        data = parsed as Record<string, unknown>;
      }
    } catch {
      data = {};
    }
  }
  const { dataJson: _ignored, ...rest } = block;
  void _ignored;
  return { ...rest, data };
}

/** Subset de una noticia necesario para la búsqueda textual. */
export type NoticiaMatchable = {
  title: string;
  excerpt?: string | null;
  body?: string | null;
};

/**
 * ¿La noticia coincide con el término de búsqueda `q`?
 *
 * Búsqueda case-insensitive (y acento-insensitive) sobre title/excerpt/body.
 * SQLite no soporta `mode:"insensitive"`, así que filtramos en JS: el dataset
 * es chico. Una consulta vacía (o de solo espacios) nunca coincide.
 */
export function matchNoticia(noticia: NoticiaMatchable, q: string): boolean {
  const term = normalizeText(q);
  if (!term) return false;
  const haystack = normalizeText(
    [noticia.title, noticia.excerpt ?? "", noticia.body ?? ""].join(" "),
  );
  return haystack.includes(term);
}

/** Pasa a minúsculas y elimina acentos/diacríticos para comparar texto. */
function normalizeText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// ---------------------------------------------------------------------------
// Lectura desde la base (Server-side)
// ---------------------------------------------------------------------------

/** Bloques de home visibles, ordenados por `order` asc, con `data` parseada. */
export async function getHomeBlocks(): Promise<ParsedBlock[]> {
  const rows = await prisma.homeBlock.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => parseBlock(r));
}

/** Menú principal como árbol `MenuItemView[]` (solo items visibles). */
export async function getMenu(): Promise<MenuItemView[]> {
  const rows = await prisma.menuItem.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });
  return buildMenuTree(
    rows.map((r) => ({
      id: r.id,
      label: r.label,
      href: r.href,
      parentId: r.parentId,
      order: r.order,
      isCTA: r.isCTA,
    })),
  );
}

export type SiteSettingsView = {
  address: string;
  email: string;
  phone: string;
  social: Record<string, string>;
  footerText: string;
  counters: Array<{ label: string; value: number; suffix?: string }>;
};

const DEFAULT_SETTINGS: SiteSettingsView = {
  address: "",
  email: "",
  phone: "",
  social: {},
  footerText: "",
  counters: [],
};

function safeParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

/** Ajustes del sitio (singleton). Devuelve defaults seguros si no existe. */
export async function getSettings(): Promise<SiteSettingsView> {
  const row = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  if (!row) return DEFAULT_SETTINGS;

  return {
    address: row.address ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    social: safeParse<Record<string, string>>(row.social, {}),
    footerText: row.footerText ?? "",
    counters: safeParse<SiteSettingsView["counters"]>(row.countersJson, []),
  };
}

/** Últimas noticias publicadas, orden `date` desc. */
export async function getLatestNoticias(limit = 6) {
  return prisma.noticia.findMany({
    where: { status: "published" },
    orderBy: { date: "desc" },
    take: limit,
  });
}

/** Una noticia publicada por slug, o null. */
export async function getNoticiaBySlug(slug: string) {
  return prisma.noticia.findUnique({ where: { slug } });
}

/** Resultado paginado de un listado. */
export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

/**
 * Noticias publicadas, orden `date` desc, con paginación simple.
 * `page` es 1-based; se acota al rango válido [1, totalPages].
 */
export async function getAllNoticias(
  page = 1,
  pageSize = 9,
): Promise<Paginated<Awaited<ReturnType<typeof getLatestNoticias>>[number]>> {
  const where = { status: "published" } as const;
  const total = await prisma.noticia.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, Math.trunc(page) || 1), totalPages);

  const items = await prisma.noticia.findMany({
    where,
    orderBy: { date: "desc" },
    skip: (safePage - 1) * pageSize,
    take: pageSize,
  });

  return { items, page: safePage, pageSize, total, totalPages };
}

/**
 * Busca noticias publicadas que coincidan con `q` (case/acento-insensitive
 * sobre title/excerpt/body). Trae las publicadas y filtra en JS con
 * `matchNoticia`. Orden `date` desc.
 */
export async function searchNoticias(q: string) {
  if (!q.trim()) return [];
  const all = await prisma.noticia.findMany({
    where: { status: "published" },
    orderBy: { date: "desc" },
  });
  return all.filter((n) => matchNoticia(n, q));
}

/** Todas las áreas, orden `order` asc. */
export async function getAreas() {
  return prisma.area.findMany({ orderBy: { order: "asc" } });
}

/** Un área por slug, o null. */
export async function getAreaBySlug(slug: string) {
  return prisma.area.findUnique({ where: { slug } });
}

/** Últimos recortes de prensa, orden `date` desc. */
export async function getLatestPrensa(limit = 4) {
  return prisma.prensaItem.findMany({
    orderBy: { date: "desc" },
    take: limit,
  });
}

/** Todos los recortes de prensa, orden `date` desc. */
export async function getAllPrensa() {
  return prisma.prensaItem.findMany({ orderBy: { date: "desc" } });
}

/** Todos los informes, orden `date` desc. */
export async function getInformes() {
  return prisma.informe.findMany({ orderBy: { date: "desc" } });
}

/** Todas las autoridades, orden `order` asc. */
export async function getAutoridades() {
  return prisma.autoridad.findMany({ orderBy: { order: "asc" } });
}

/** Todas las sedes, orden `order` asc. */
export async function getSedes() {
  return prisma.sede.findMany({ orderBy: { order: "asc" } });
}
