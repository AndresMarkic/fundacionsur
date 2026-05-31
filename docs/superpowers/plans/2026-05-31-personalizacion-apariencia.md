# Personalización de apariencia — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Aplicar TDD en helpers; cada server action verifica `auth()` primero; revisión spec + seguridad al cerrar. Trabajar en `master`, sin ramas nuevas.

**Goal:** Que el admin personalice colores (con contraste automático), tipografía (5 combinaciones) y el hero (texto + 2 botones) desde `/admin`, manteniendo todo profesional y legible; defaults = diseño actual.

**Architecture:** Un "tema" (5 colores + `fontPair`) se guarda en `SiteSettings.themeJson`. El root layout lo lee, computa colores de texto por contraste y **inyecta variables CSS en `<html>`** (sobrescriben los tokens `@theme` por defecto). Los componentes con texto sobre color usan tokens `--color-on-*`. Las 5 combinaciones tipográficas se cargan con `next/font` y se activa la elegida vía variable. El hero lee su texto/botones de su `dataJson`.

**Tech Stack:** Next.js 16 (App Router) · Tailwind v4 (`@theme`) · Prisma 7 · Auth.js v5 · Vitest.

**Spec:** `docs/superpowers/specs/2026-05-31-personalizacion-apariencia-design.md`

---

## P1 — Helpers de color (PURO, TDD)

### T1.1 — `src/lib/color.ts` + tests
- **Test** `src/lib/__tests__/color.test.ts`:
  - `isHexColor("#1A2B3C")===true`; `isHexColor("#fff")===false`; `isHexColor("1A2B3C")===false`; `isHexColor("#GG0000")===false`.
  - `contrastColor("#1A2B3C")==="#FFFFFF"` (fondo oscuro → texto claro); `contrastColor("#FFFFFF")==="#0E1A26"`; `contrastColor("#4AABB8")` → comparar: devuelve el de mayor contraste (esperado `#0E1A26`).
  - `ensureReadableOnLight("#FFFFFF")` → devuelve un color con ratio ≥ 3.0 sobre blanco (más oscuro que el input); `ensureReadableOnLight("#1A2B3C")==="#1A2B3C"` (ya legible, sin cambios).
  - `contrastRatio("#000000","#FFFFFF")` ≈ 21 (tolerancia).
- **Impl** `src/lib/color.ts`:
```ts
export function isHexColor(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v.trim());
}

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

function relLuminance(hex: string): number {
  const lin = toRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function contrastRatio(a: string, b: string): number {
  const la = relLuminance(a), lb = relLuminance(b);
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
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase();
}
```
- **Commit:** `feat: helpers de color (contraste, hex) tested`.

### T1.2 — `src/lib/theme.ts` (defaults + parse) + tests
- Define defaults de marca y `FONT_PAIRS`, y un parser tolerante.
```ts
import { isHexColor } from "@/lib/color";

export const DEFAULT_COLORS = {
  austral: "#1A2B3C", glaciar: "#2A7F8A", celeste: "#4AABB8",
  piedra: "#8A9CAD", estepa: "#C4956A",
} as const;
export type ColorKey = keyof typeof DEFAULT_COLORS;

export const FONT_PAIRS = ["editorial", "moderna", "clasica", "sobria", "humanista"] as const;
export type FontPair = (typeof FONT_PAIRS)[number];
export const DEFAULT_FONT_PAIR: FontPair = "editorial";

export type Theme = { colors: Record<ColorKey, string>; fontPair: FontPair };

export function parseTheme(raw: string | null | undefined): Theme {
  let colors = { ...DEFAULT_COLORS };
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
  } catch { /* defaults */ }
  return { colors, fontPair };
}
```
- **Test** `src/lib/__tests__/theme.test.ts`: `parseTheme(null)` → defaults; JSON inválido → defaults; color inválido se ignora (queda default); `fontPair` desconocido → editorial; colores/fontPair válidos se respetan.
- **Commit:** `feat: modelo de tema (defaults + parse) tested`.

---

## P2 — Esquema y lectura

### T2.1 — Migración: `themeJson` en SiteSettings
- En `prisma/schema.prisma`, agregar a `SiteSettings`: `themeJson String @default("{}")`.
- `npx prisma migrate dev --name site_theme`.
- **Commit:** `feat: campo themeJson en SiteSettings (migración)`.

### T2.2 — `getSettings` expone `theme`
- En `src/lib/content.ts`: extender `SiteSettingsView` con `theme: Theme` y parsear con `parseTheme(row.themeJson)` en `getSettings()` (default seguro si no hay fila).
- **Commit:** `feat: getSettings devuelve el tema parseado`.

---

## P3 — Aplicación del tema (colores + fuentes) en el layout

### T3.1 — Tokens `--color-on-*` por defecto en globals.css
- En `@theme` de `src/app/globals.css`, agregar defaults (coinciden con el look actual):
```css
--color-on-austral: #FFFFFF;
--color-on-glaciar: #FFFFFF;
--color-on-celeste: #0E1A26;
--color-on-estepa: #0E1A26;
```
- **Commit:** `feat: tokens on-color por defecto`.

### T3.2 — Cargar las 5 combinaciones tipográficas
- En `src/app/layout.tsx`, definir con `next/font/google` (a nivel módulo) las 8 familias necesarias, exponiendo `variable`:
  Cormorant Garamond, Inter (default → `preload:true`); Poppins, Playfair Display, Source Sans 3, Libre Franklin, Fraunces, Nunito Sans (`preload:false`).
- Aplicar TODAS las `.variable` en `className` de `<html>` (definen `--font-cormorant`, etc., sin descargarse hasta que se usan).
- Mapa `FONT_PAIR_VARS: Record<FontPair, { display: string; body: string }>` con los nombres de variable (p. ej. editorial → `{ display: "var(--font-cormorant)", body: "var(--font-inter)" }`).
- **Commit:** `feat: cargar combinaciones tipográficas (next/font)`.

### T3.3 — Inyectar el tema en `<html>`
- En el root layout (ya `async`/`force-dynamic`), tras `getSettings()`:
```ts
const { colors, fontPair } = settings.theme;
const piedra = ensureReadableOnLight(colors.piedra);
const fonts = FONT_PAIR_VARS[fontPair];
const styleVars = {
  "--color-austral": colors.austral,
  "--color-glaciar": colors.glaciar,
  "--color-celeste": colors.celeste,
  "--color-piedra": piedra,
  "--color-estepa": colors.estepa,
  "--color-on-austral": contrastColor(colors.austral),
  "--color-on-glaciar": contrastColor(colors.glaciar),
  "--color-on-celeste": contrastColor(colors.celeste),
  "--color-on-estepa": contrastColor(colors.estepa),
  "--font-display": fonts.display,
  "--font-body": fonts.body,
} as React.CSSProperties;
```
  y `<html lang="es" className={allFontVariables} style={styleVars}>`.
- **Verificar:** sin tema guardado, la web se ve EXACTAMENTE igual que antes (defaults). Cambiar `themeJson` en la BD cambia colores/fuente en toda la web.
- **Commit:** `feat: inyección del tema (colores+contraste+fuente) en el layout`.

---

## P4 — Componentes: texto sobre color usa `--color-on-*`

### T4.1 — Reemplazar colores de texto fijos sobre superficies de marca
Cambiar `text-white`/`text-austral` por el token `on-*` correspondiente SOLO donde el fondo es un color de marca:
- `src/components/layout/Footer.tsx`: contenedor `bg-austral` → textos a `text-on-austral` (y opacidades con `text-on-austral/70` etc.).
- `src/components/blocks/HeroBlock.tsx`: contenido sobre velo austral → `text-on-austral` (título, subtítulo).
- `src/components/blocks/CtaBlock.tsx`: franja `bg-glaciar` → `text-on-glaciar`.
- `src/components/blocks/PrensaBlock.tsx`: sección oscura austral → `text-on-austral`.
- `src/components/ui/Button.tsx`: variante `solid` (`bg-glaciar`) → `text-on-glaciar` (en vez de `text-white`).
- Badges/píldoras con fondo de color de marca (revisar admin/listas): usar `on-*`.
- **No** tocar textos sobre fondo blanco/`bg-fondo` (esos usan `text-austral`/`text-piedra`, que ya se autoajustan vía las variables base).
- **Verificar:** con defaults, idéntico a hoy. Probar un tema con austral CLARO → el texto del footer/hero pasa a oscuro automáticamente y se lee.
- **Commit:** `feat: texto sobre color usa on-* (contraste automático)`.

---

## P5 — Hero editable (texto + 2 botones)

### T5.1 — Datos por defecto y editor del hero
- `src/lib/blocks.ts` `defaultBlockData("hero")`:
```ts
return {
  image: "",
  title: "Desde el sur, junto a las comunidades del territorio.",
  subtitle: "Desde el sur, junto a las comunidades de Santa Cruz",
  primary: { visible: true, label: "Conocé la Fundación", href: "/quienes-somos" },
  secondary: { visible: true, label: "Sumate a nuestra comunidad", href: "/#suscribite" },
};
```
- `src/app/admin/home/BlockForm.tsx` (caso hero): imagen (ya), título, subtítulo, y para cada botón: checkbox `<name>Visible`, texto `<name>Label`, enlace `<name>Href` (primary/secondary).
- `src/app/admin/home/actions.ts` `buildBlockData` (caso hero): armar `{ image, title, subtitle, primary:{visible,label,href}, secondary:{...} }` (visible desde checkbox; href con `trimmed`).
- `src/lib/__tests__/blocks.test.ts`: actualizar `READ_KEYS.hero` a `["image","title","subtitle","primary.visible","primary.label","primary.href","secondary.visible","secondary.label","secondary.href"]` y el test de igualdad de `defaultBlockData("hero")`.
- **Commit:** `feat: hero editable (texto + 2 botones) en el editor`.

### T5.2 — Render del hero según datos
- `src/components/blocks/HeroBlock.tsx`: renderizar `title` literal (sin easter-egg), `subtitle`, y cada botón solo si `visible && label`:
  - primary → `<Button variant="solid" href={primary.href}>{primary.label}</Button>`
  - secondary → `<Button variant="link" href={secondary.href}>{secondary.label}</Button>`
  - Helper local para leer objetos anidados de `data` con fallback a defaults.
- **Verificar:** ocultar un botón lo saca; cambiar texto/enlace se refleja; sin datos → defaults actuales.
- **Commit:** `feat: hero renderiza texto y botones configurables`.

---

## P6 — Admin: apartado "Apariencia"

### T6.1 — Página y acción
- `src/app/admin/apariencia/page.tsx` (server, lee `getSettings().theme`) + `AparienciaForm.tsx` (client): 5 inputs `type="color"` (con hex visible/editable) para austral/glaciar/celeste/piedra/estepa, un `<select>` de combinación tipográfica (FONT_PAIRS con nombres amigables), botón Guardar (SubmitButton) y botón **"Restablecer valores por defecto"**.
- `src/app/admin/apariencia/actions.ts`: `updateTheme` (guard `auth()`): valida cada color con `isHexColor` (si inválido → estado de error), valida `fontPair ∈ FONT_PAIRS`, arma `themeJson = JSON.stringify({colors, fontPair})`, `prisma.siteSettings.upsert({ where:{id:"singleton"}, ... })`, `revalidatePath("/", "layout")` + `revalidatePath("/")`. Acción `resetTheme` → `themeJson = "{}"`.
- `src/components/admin/AdminSidebar.tsx`: agregar ítem **"Apariencia"** → `/admin/apariencia`.
- **TDD:** los helpers ya están testeados; agregar test de `updateTheme` validación (rechaza hex inválido) al estilo del test de integración existente, o al menos un test puro de "armado de themeJson".
- **Verificar:** cambiar colores/fuente en `/admin/apariencia` y ver el cambio en toda la web; "Restablecer" vuelve al original; sin sesión la acción falla.
- **Commit:** `feat: apartado Apariencia en el admin (colores + fuentes + reset)`.

---

## P7 — Verificación final
- `npm test` verde (color, theme, blocks, previos). `npm run build` OK. `tsc --noEmit` y `eslint src` limpios.
- QA visual: (a) defaults → idéntico a hoy; (b) tema con un color de fondo claro → textos se invierten y se leen; (c) cada combinación tipográfica aplica; (d) hero: ocultar/editar botones y texto.
- **Commit (si aplica):** `chore: verificación final personalización`.

---

## Self-review (cobertura del spec)
- §2 modelo (themeJson + hero data) → T2.1, T5.1 ✅
- §3 colores + contraste automático → P1, T3.1, T3.3, T4.1 ✅
- §4 tipografía (5 pares) → T3.2, T3.3, T6.1 ✅
- §5 hero editable → P5 ✅
- §6 admin Apariencia + hero en home → T6.1, T5.1 ✅
- §7 defaults preservados → verificación en T3.3/T4.1 ✅
- Helpers nombrados consistentes: `isHexColor`, `contrastColor`, `contrastRatio`, `ensureReadableOnLight`, `parseTheme`, `FONT_PAIRS`. Sin placeholders.
