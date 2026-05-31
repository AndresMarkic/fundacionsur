import { describe, it, expect } from "vitest";
import {
  BLOCK_TYPES,
  blockLabel,
  defaultBlockData,
  isBlockType,
} from "@/lib/blocks";

describe("isBlockType / blockLabel", () => {
  it("reconoce los tipos conocidos", () => {
    expect(isBlockType("hero")).toBe(true);
    expect(isBlockType("mision")).toBe(true);
    expect(isBlockType("desconocido")).toBe(false);
  });

  it("devuelve nombre amigable para tipos conocidos y el propio string si no", () => {
    expect(blockLabel("hero")).toBe("Hero / Portada");
    expect(blockLabel("noticias")).toBe("Últimas noticias");
    expect(blockLabel("loquesea")).toBe("loquesea");
  });
});

describe("defaultBlockData", () => {
  it("hero trae image/title/subtitle/link", () => {
    expect(defaultBlockData("hero")).toEqual({
      image: "",
      title: "Fundación Sur",
      subtitle: "Desde el sur, junto a las comunidades de Santa Cruz",
      link: "/",
    });
  });

  it("noticias trae title y limit numérico", () => {
    const d = defaultBlockData("noticias");
    expect(d.title).toBe("Últimas noticias");
    expect(d.limit).toBe(6);
    expect(typeof d.limit).toBe("number");
  });

  it("mision trae cta anidado con label/href", () => {
    expect(defaultBlockData("mision")).toEqual({
      title: "Quiénes somos",
      text: "",
      image: "",
      cta: { label: "Conocé más", href: "/quienes-somos" },
    });
  });

  it("contadores trae items como array vacío", () => {
    expect(defaultBlockData("contadores")).toEqual({
      title: "Nuestro recorrido",
      items: [],
    });
  });

  it("banner trae image/imageMobile/link/alt/buttonLabel", () => {
    expect(defaultBlockData("banner")).toEqual({
      image: "",
      imageMobile: "",
      link: "",
      alt: "",
      buttonLabel: "",
    });
  });

  it("areas trae title e intro", () => {
    expect(defaultBlockData("areas")).toEqual({
      title: "Nuestras áreas",
      intro: "",
    });
  });

  it("cta trae title/text/buttonLabel/href", () => {
    expect(defaultBlockData("cta")).toEqual({
      title: "Sumate a Fundación Sur",
      text: "Suscribite y recibí nuestras novedades.",
      buttonLabel: "Suscribite",
      href: "/#suscribite",
    });
  });

  it("un tipo desconocido devuelve objeto vacío", () => {
    expect(defaultBlockData("ninguno")).toEqual({});
  });

  it("provee defaults para todos los BLOCK_TYPES sin lanzar", () => {
    for (const t of BLOCK_TYPES) {
      const d = defaultBlockData(t);
      expect(d).toBeTypeOf("object");
    }
  });
});

/**
 * Contrato editor↔componente: `defaultBlockData(type)` debe incluir TODAS las
 * claves que el componente de `src/components/blocks/{Type}Block.tsx` lee de
 * `data`. Si un componente empieza a leer una clave nueva, agregarla acá y en
 * `defaultBlockData` (y en BlockForm + buildBlockData).
 *
 * Las claves anidadas se expresan con punto (p. ej. `cta.label`) y se verifican
 * navegando el objeto por default.
 */
describe("defaultBlockData cubre las claves leídas por cada componente", () => {
  // Claves que cada componente lee de `data` (auditadas en los *Block.tsx).
  const READ_KEYS: Record<string, string[]> = {
    hero: ["image", "link", "title", "subtitle"],
    noticias: ["limit", "title"],
    informes: ["title", "intro"],
    areas: ["title", "intro"],
    banner: ["image", "imageMobile", "link", "alt", "buttonLabel"],
    mision: ["title", "text", "image", "cta.label", "cta.href"],
    prensa: ["title", "limit"],
    contadores: ["title", "items"],
    cta: ["title", "text", "buttonLabel", "href"],
  };

  const hasPath = (obj: Record<string, unknown>, path: string): boolean => {
    const parts = path.split(".");
    let cur: unknown = obj;
    for (const p of parts) {
      if (!cur || typeof cur !== "object" || !(p in (cur as object))) {
        return false;
      }
      cur = (cur as Record<string, unknown>)[p];
    }
    return true;
  };

  for (const type of BLOCK_TYPES) {
    it(`${type}: incluye todas las claves leídas`, () => {
      const d = defaultBlockData(type);
      for (const key of READ_KEYS[type]) {
        expect(hasPath(d, key), `falta "${key}" en defaultBlockData("${type}")`).toBe(
          true,
        );
      }
    });
  }
});
