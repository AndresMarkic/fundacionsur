import { describe, it, expect } from "vitest";
import {
  parseTheme,
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
