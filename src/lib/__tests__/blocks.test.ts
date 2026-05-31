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

  it("banner trae image/imageMobile/link/alt", () => {
    expect(defaultBlockData("banner")).toEqual({
      image: "",
      imageMobile: "",
      link: "",
      alt: "",
    });
  });

  it("cta trae title/text/buttonLabel", () => {
    expect(defaultBlockData("cta")).toEqual({
      title: "Sumate a Fundación Sur",
      text: "Suscribite y recibí nuestras novedades.",
      buttonLabel: "Suscribite",
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
