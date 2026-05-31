export function isHexColor(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v.trim());
}

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}

function relLuminance(hex: string): number {
  const lin = toRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function contrastRatio(a: string, b: string): number {
  const la = relLuminance(a),
    lb = relLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const LIGHT = "#FFFFFF";
const DARK = "#0E1A26";

/** Texto (claro u oscuro) con mejor contraste sobre el fondo `bg`. */
export function contrastColor(bg: string): "#FFFFFF" | "#0E1A26" {
  return contrastRatio(bg, LIGHT) >= contrastRatio(bg, DARK) ? LIGHT : DARK;
}

/** Oscurece `hex` hasta que tenga ratio >= 3.0 sobre blanco (para texto sobre fondo claro). */
export function ensureReadableOnLight(hex: string): string {
  let [r, g, b] = toRgb(hex);
  let guard = 0;
  while (contrastRatio(rgbToHex(r, g, b), LIGHT) < 3.0 && guard++ < 40) {
    r = Math.max(0, Math.round(r * 0.9));
    g = Math.max(0, Math.round(g * 0.9));
    b = Math.max(0, Math.round(b * 0.9));
  }
  return rgbToHex(r, g, b);
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase()
  );
}
