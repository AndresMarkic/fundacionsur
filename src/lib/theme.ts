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

/** Nombres humanos de cada combinación tipográfica (para el select del admin). */
export const FONT_PAIR_LABELS: Record<FontPair, string> = {
  editorial: "Editorial austral (actual)",
  moderna: "Moderna",
  clasica: "Clásica",
  sobria: "Sobria",
  humanista: "Humanista",
};

/** Nombres humanos de cada color de marca (para etiquetas del admin). */
export const COLOR_LABELS: Record<ColorKey, string> = {
  austral: "Austral (azul profundo)",
  glaciar: "Glaciar (verde azulado)",
  celeste: "Celeste",
  piedra: "Piedra (gris)",
  estepa: "Estepa (terracota)",
};

export type ThemePayloadInput = {
  colors: Record<string, string>;
  fontPair: string;
};

export type ThemePayloadResult =
  | { ok: true; themeJson: string }
  | { ok: false; errors: Record<string, string> };

/**
 * Valida y arma el `themeJson` a partir de la entrada del form. PURA (sin BD ni
 * request), testeable. Valida que los 5 colores sean hex `#RRGGBB` y que
 * `fontPair` sea uno de `FONT_PAIRS`. Devuelve `{ ok, themeJson }` o
 * `{ ok:false, errors }` con un mensaje por campo inválido.
 */
export function buildThemePayload(
  input: ThemePayloadInput,
): ThemePayloadResult {
  const errors: Record<string, string> = {};
  const colors = {} as Record<ColorKey, string>;

  for (const key of Object.keys(DEFAULT_COLORS) as ColorKey[]) {
    const value = (input.colors[key] ?? "").trim();
    if (!isHexColor(value)) {
      errors[key] = "Ingresá un color hexadecimal válido (p. ej. #1A2B3C).";
      continue;
    }
    colors[key] = value.toUpperCase();
  }

  const fontPair = input.fontPair as FontPair;
  if (!FONT_PAIRS.includes(fontPair)) {
    errors.fontPair = "Elegí una combinación tipográfica válida.";
  }

  if (Object.keys(errors).length) return { ok: false, errors };

  return { ok: true, themeJson: JSON.stringify({ colors, fontPair }) };
}

export function parseTheme(raw: string | null | undefined): Theme {
  const colors: Record<ColorKey, string> = { ...DEFAULT_COLORS };
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
