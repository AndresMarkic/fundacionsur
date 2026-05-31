/**
 * Metadatos y datos por defecto de los bloques de la home. PURO (sin BD ni
 * request), testeable. Las claves de cada `defaultBlockData` deben coincidir
 * con las que leen los componentes en `src/components/blocks/*`.
 */

/** Tipos de bloque conocidos, en el orden en que se ofrecen al crear. */
export const BLOCK_TYPES = [
  "hero",
  "noticias",
  "informes",
  "areas",
  "banner",
  "mision",
  "prensa",
  "contadores",
  "cta",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

/** Nombre amigable por tipo (para listados y selects del admin). */
export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: "Hero / Portada",
  noticias: "Últimas noticias",
  informes: "Informes",
  areas: "Nuestras áreas",
  banner: "Banner",
  mision: "Quiénes somos / Misión",
  prensa: "En los medios (prensa)",
  contadores: "Contadores",
  cta: "Llamado a la acción (CTA)",
};

/** true si `type` es uno de los tipos de bloque conocidos. */
export function isBlockType(type: string): type is BlockType {
  return (BLOCK_TYPES as readonly string[]).includes(type);
}

/** Nombre amigable del tipo; si es desconocido, devuelve el propio string. */
export function blockLabel(type: string): string {
  return isBlockType(type) ? BLOCK_LABELS[type] : type;
}

export type ContadorItem = { label: string; value: number; suffix: string };

/**
 * Objeto de datos por defecto para un nuevo bloque del tipo dado. Las claves
 * espejan lo que esperan los componentes de `src/components/blocks/`. Un tipo
 * desconocido devuelve `{}` (el render lo ignora sin romper la home).
 */
export function defaultBlockData(type: string): Record<string, unknown> {
  switch (type) {
    case "hero":
      return {
        image: "",
        title: "Fundación Sur",
        subtitle: "Desde el sur, junto a las comunidades de Santa Cruz",
        link: "/",
      };
    case "noticias":
      return { title: "Últimas noticias", limit: 6 };
    case "informes":
      return { title: "Informes", intro: "" };
    case "areas":
      return { title: "Nuestras áreas" };
    case "banner":
      return { image: "", imageMobile: "", link: "", alt: "" };
    case "mision":
      return {
        title: "Quiénes somos",
        text: "",
        image: "",
        cta: { label: "Conocé más", href: "/quienes-somos" },
      };
    case "prensa":
      return { title: "En los medios", limit: 4 };
    case "contadores":
      return {
        title: "Nuestro recorrido",
        items: [] as ContadorItem[],
      };
    case "cta":
      return {
        title: "Sumate a Fundación Sur",
        text: "Suscribite y recibí nuestras novedades.",
        buttonLabel: "Suscribite",
      };
    default:
      return {};
  }
}
