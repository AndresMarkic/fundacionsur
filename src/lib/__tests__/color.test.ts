import { describe, it, expect } from "vitest";
import {
  isHexColor,
  contrastColor,
  contrastRatio,
  ensureReadableOnLight,
} from "@/lib/color";

describe("isHexColor", () => {
  it("acepta hex de 6 dígitos con #", () => {
    expect(isHexColor("#1A2B3C")).toBe(true);
  });

  it("rechaza hex corto de 3 dígitos", () => {
    expect(isHexColor("#fff")).toBe(false);
  });

  it("rechaza hex sin #", () => {
    expect(isHexColor("1A2B3C")).toBe(false);
  });

  it("rechaza dígitos no hexadecimales", () => {
    expect(isHexColor("#GG0000")).toBe(false);
  });
});

describe("contrastColor", () => {
  it("devuelve texto claro sobre fondo oscuro", () => {
    expect(contrastColor("#1A2B3C")).toBe("#FFFFFF");
  });

  it("devuelve texto oscuro sobre fondo blanco", () => {
    expect(contrastColor("#FFFFFF")).toBe("#0E1A26");
  });

  it("elige el de mayor contraste para un acento medio", () => {
    expect(contrastColor("#4AABB8")).toBe("#0E1A26");
  });
});

describe("ensureReadableOnLight", () => {
  it("oscurece un color claro hasta tener contraste >= 3.0 sobre blanco", () => {
    const out = ensureReadableOnLight("#FFFFFF");
    expect(contrastRatio(out, "#FFFFFF")).toBeGreaterThanOrEqual(3.0);
    // El resultado debe ser más oscuro que la entrada.
    expect(out).not.toBe("#FFFFFF");
  });

  it("deja sin cambios un color ya legible sobre blanco", () => {
    expect(ensureReadableOnLight("#1A2B3C")).toBe("#1A2B3C");
  });
});

describe("contrastRatio", () => {
  it("blanco contra negro da ~21", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
  });
});
