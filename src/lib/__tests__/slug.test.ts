import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/slug";

describe("slugify", () => {
  it("quita acentos/diacríticos, pasa a minúsculas y usa '-' como separador", () => {
    expect(slugify("Áreas del Sur!")).toBe("areas-del-sur");
  });

  it("colapsa múltiples espacios y recorta los extremos", () => {
    expect(slugify("  Hola   Mundo  ")).toBe("hola-mundo");
  });

  it("colapsa múltiples separadores no-alfanuméricos en uno solo", () => {
    expect(slugify("foo --- bar___baz")).toBe("foo-bar-baz");
  });

  it("recorta guiones de los extremos", () => {
    expect(slugify("---Campus Sur---")).toBe("campus-sur");
  });

  it("maneja la ñ y otros diacríticos del español", () => {
    expect(slugify("Quiénes somos")).toBe("quienes-somos");
    expect(slugify("Año Niño")).toBe("ano-nino");
  });

  it("devuelve cadena vacía si no hay caracteres alfanuméricos", () => {
    expect(slugify("---!!!---")).toBe("");
  });
});
