import { isHexColor } from "@/lib/color";

export const DEFAULT_COLORS = {
  austral: "#1A2B3C",
  glaciar: "#2A7F8A",
  celeste: "#4AABB8",
  piedra: "#8A9CAD",
  estepa: "#C4956A",
} as const;
export type ColorKey = keyof typeof DEFAULT_COLORS;

export const FONT_PAIRS = [
  "editorial",
  "moderna",
  "clasica",
  "sobria",
  "humanista",
] as const;
export type FontPair = (typeof FONT_PAIRS)[number];
export const DEFAULT_FONT_PAIR: FontPair = "editorial";

export type Theme = { colors: Record<ColorKey, string>; fontPair: FontPair };

export function parseTheme(raw: string | null | undefined): Theme {
  const colors = { ...DEFAULT_COLORS };
  let fontPair: FontPair = DEFAULT_FONT_PAIR;
  try {
    const t = raw ? JSON.parse(raw) : {};
    if (t && typeof t === "object") {
      for (const k of Object.keys(DEFAULT_COLORS) as ColorKey[]) {
        const v = t.colors?.[k];
        if (typeof v === "string" && isHexColor(v)) colors[k] = v;
      }
      if (FONT_PAIRS.includes(t.fontPair)) fontPair = t.fontPair;
    }
  } catch {
    /* defaults */
  }
  return { colors, fontPair };
}
