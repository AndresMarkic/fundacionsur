import { describe, it, expect } from "vitest";
import {
  parseTheme,
  buildThemePayload,
  DEFAULT_COLORS,
  DEFAULT_FONT_PAIR,
} from "@/lib/theme";

describe("parseTheme", () => {
  it("devuelve defaults con entrada null", () => {
    expect(parseTheme(null)).toEqual({
      colors: { ...DEFAULT_COLORS },
      fontPair: DEFAULT_FONT_PAIR,
    });
  });

  it("devuelve defaults con JSON inválido", () => {
    expect(parseTheme("{no es json")).toEqual({
      colors: { ...DEFAULT_COLORS },
      fontPair: DEFAULT_FONT_PAIR,
    });
  });

  it("ignora un color inválido y conserva el default", () => {
    const t = parseTheme(JSON.stringify({ colors: { austral: "rojo" } }));
    expect(t.colors.austral).toBe(DEFAULT_COLORS.austral);
  });

  it("usa editorial ante un fontPair desconocido", () => {
    const t = parseTheme(JSON.stringify({ fontPair: "comicsans" }));
    expect(t.fontPair).toBe(DEFAULT_FONT_PAIR);
  });

  it("respeta colores y fontPair válidos", () => {
    const t = parseTheme(
      JSON.stringify({
        colors: { austral: "#112233", glaciar: "#445566" },
        fontPair: "moderna",
      }),
    );
    expect(t.colors.austral).toBe("#112233");
    expect(t.colors.glaciar).toBe("#445566");
    // Los no especificados quedan en default.
    expect(t.colors.celeste).toBe(DEFAULT_COLORS.celeste);
    expect(t.fontPair).toBe("moderna");
  });
});

describe("buildThemePayload", () => {
  const validColors = { ...DEFAULT_COLORS } as Record<string, string>;

  it("arma el themeJson con colores válidos y fontPair válido", () => {
    const res = buildThemePayload({ colors: validColors, fontPair: "moderna" });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(JSON.parse(res.themeJson)).toEqual({
        colors: { ...DEFAULT_COLORS },
        fontPair: "moderna",
      });
    }
  });

  it("normaliza el hex a mayúsculas", () => {
    const res = buildThemePayload({
      colors: { ...validColors, austral: "#1a2b3c" },
      fontPair: "editorial",
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(JSON.parse(res.themeJson).colors.austral).toBe("#1A2B3C");
    }
  });

  it("rechaza un color hex inválido", () => {
    const res = buildThemePayload({
      colors: { ...validColors, glaciar: "rojo" },
      fontPair: "editorial",
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.glaciar).toBeTruthy();
      expect(res.errors.austral).toBeUndefined();
    }
  });

  it("rechaza un hex corto (#fff)", () => {
    const res = buildThemePayload({
      colors: { ...validColors, celeste: "#fff" },
      fontPair: "editorial",
    });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors.celeste).toBeTruthy();
  });

  it("rechaza un fontPair desconocido", () => {
    const res = buildThemePayload({
      colors: validColors,
      fontPair: "comicsans",
    });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.errors.fontPair).toBeTruthy();
  });

  it("acumula varios errores", () => {
    const res = buildThemePayload({
      colors: { ...validColors, austral: "nope", piedra: "tampoco" },
      fontPair: "xx",
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(Object.keys(res.errors).sort()).toEqual([
        "austral",
        "fontPair",
        "piedra",
      ]);
    }
  });
});
