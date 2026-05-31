# Diseño — Personalización de apariencia desde el /admin

**Fecha:** 2026-05-31
**Estado:** Aprobado por el cliente
**Proyecto:** Fundación Sur (web + CMS). Spec base: `2026-05-31-fundacion-sur-web-design.md`.

---

## 1. Objetivo

Permitir que el administrador personalice, desde `/admin`, **los colores de marca, la tipografía y el contenido del hero** (texto + dos botones), manteniendo SIEMPRE un resultado **profesional y legible**. Por defecto todo queda **idéntico al diseño actual**; nada cambia hasta que el usuario lo modifique. Es imposible dejar texto ilegible (contraste automático).

---

## 2. Modelo de datos

### 2.1 Tema (en `SiteSettings`)
Nuevo campo `themeJson String @default("{}")` (singleton). Estructura:
```json
{
  "colors": {
    "austral":  "#1A2B3C",
    "glaciar":  "#2A7F8A",
    "celeste":  "#4AABB8",
    "piedra":   "#8A9CAD",
    "estepa":   "#C4956A"
  },
  "fontPair": "editorial"
}
```
- Si falta una clave o el JSON es inválido → se usan los **defaults de marca** (los de arriba). Nunca rompe.

### 2.2 Hero (en el `HomeBlock` tipo `hero`, `dataJson`)
```json
{
  "image": "",
  "title": "Desde el sur, junto a las comunidades del territorio.",
  "subtitle": "Desde el sur, junto a las comunidades de Santa Cruz",
  "primary":   { "visible": true, "label": "Conocé la Fundación", "href": "/quienes-somos" },
  "secondary": { "visible": true, "label": "Sumate a nuestra comunidad", "href": "/#suscribite" }
}
```
- Se elimina el "easter-egg" actual (cuando `title === "Fundación Sur"` se renderiza una frase fija). El título se renderiza **tal cual** se guarda (WYSIWYG). El default del título pasa a ser el texto que hoy se ve.

---

## 3. Sistema de colores con contraste automático

### 3.1 Aplicación site-wide
- `globals.css` mantiene los tokens `@theme` con los valores de marca como **default**.
- El **root layout** (Server Component, `force-dynamic`) lee `getSettings().theme` y **inyecta variables CSS** en el elemento `<html>` (style inline → mayor especificidad que `@theme`), sobrescribiendo solo si el usuario personalizó:
  `--color-austral, --color-glaciar, --color-celeste, --color-piedra, --color-estepa` + las derivadas (abajo) + las de fuente.
- Como las páginas son `force-dynamic`, el cambio se refleja en toda la web al instante.

### 3.2 Contraste automático (lo que garantiza legibilidad)
- Helper PURO `contrastColor(hex): "#FFFFFF" | "#0E1A26"` — calcula luminancia relativa (sRGB) y devuelve texto **claro u oscuro** según cuál tenga mejor contraste. **Testeado.**
- Para cada color usado como **fondo** se computa server-side y se inyecta su par de texto:
  `--on-austral, --on-glaciar, --on-celeste, --on-estepa` (= `contrastColor(color)`).
- **Piedra** (se usa como **texto** secundario/fechas/bordes sobre fondo claro): si el color elegido tiene contraste insuficiente sobre blanco (ratio < 3.0), se **oscurece** automáticamente hacia un tono legible antes de aplicarse (helper `ensureReadableOnLight(hex)`, testeado). El valor aplicado va a `--color-piedra`.
- Los componentes que hoy hardcodean el texto sobre color (p. ej. `text-white` sobre `bg-austral`) pasan a usar la variable `--on-*` correspondiente.

### 3.3 Componentes a ajustar (usar `--on-*` en vez de color de texto fijo)
- **Navbar** (texto sobre blanco → usa austral; ok), **Footer** (`bg-austral` → texto `--on-austral`), **HeroBlock** (velo austral → `--on-austral`), **CtaBlock** (franja `bg-glaciar` → `--on-glaciar`), **PrensaBlock** (sección oscura austral → `--on-austral`), **Button** sólido (`bg-glaciar` → `--on-glaciar`), badges/píldoras con fondo de color, contadores si tienen fondo. Revisar todos los usos de `text-white`/`text-austral` sobre superficies de color de marca.
- Los **acentos** (celeste/estepa como color de texto sobre blanco) se mantienen como acento; si el usuario los elige muy claros, se usan solo donde no comprometen lectura (hovers, líneas), no para texto largo.

---

## 4. Tipografía (5 combinaciones curadas)

`fontPair` ∈ { editorial, moderna, clasica, sobria, humanista }:

| key | Títulos | Cuerpo | Nota |
|---|---|---|---|
| `editorial` (default) | Cormorant Garamond | Inter | la actual |
| `moderna` | Poppins | Inter | geométrica |
| `clasica` | Playfair Display | Source Sans 3 | serif clásica |
| `sobria` | Libre Franklin | Libre Franklin | sans única |
| `humanista` | Fraunces | Nunito Sans | serif cálida + sans amable |

- Todas vía `next/font/google` con `display:swap`, definidas a nivel módulo en el layout.
- Se aplica el par elegido mapeando sus variables a `--font-display` / `--font-body` (inyectadas en `<html>`).
- **Carga eficiente:** preload solo del par por defecto; los demás cargan on-demand (solo se descargan si el usuario los selecciona). Evitar FOUT grave con swap.

---

## 5. Hero editable
- `HeroBlock` renderiza: eyebrow ("Patagonia austral · Santa Cruz"), `title`, `subtitle`, y los dos botones **según `primary`/`secondary`** (cada uno se muestra solo si `visible` y tiene `label`).
- Texto del título **literal** (sin easter-egg). Mantener el resaltado de marca solo como estilo tipográfico, no como reemplazo de texto.
- Imagen de fondo + velo (ya implementado).

---

## 6. Admin

### 6.1 Nuevo apartado "Apariencia" (`/admin/apariencia`)
- En el sidebar del admin, ítem **"Apariencia"**.
- Form con: 5 selectores de color (con su hex visible y editable), selector de **combinación tipográfica** (las 5), y botón **"Restablecer valores por defecto"** (resetea `themeJson` al default de marca).
- Server action `updateTheme` (guard `auth()`), valida que los colores sean hex válidos (helper `isHexColor`, testeado; si inválido → error de campo), `revalidatePath("/", "layout")` + `revalidatePath("/")`.
- (Opcional/nice-to-have, no bloqueante) mini-previsualización de la paleta.

### 6.2 Hero en el editor de Home (`/admin/home` → bloque Hero)
- Campos: imagen (ya está), título, subtítulo, y por cada botón: **mostrar/ocultar** (checkbox), **texto**, **enlace**. Defaults = los actuales.
- Actualizar `defaultBlockData("hero")`, `BlockForm` (caso hero), `buildBlockData` (caso hero) y el test de contrato `READ_KEYS.hero`.

---

## 7. Defaults y seguridad
- **Sin personalizar = idéntico a hoy.** Los defaults del tema = colores/fuente actuales; los defaults del hero = textos/botones actuales.
- Contraste automático ⇒ **nunca texto ilegible**.
- Validación server-side de hex y de URLs de botones.

---

## 8. Fuera de alcance (YAGNI)
- Fuentes arbitrarias de Google (solo las 5 curadas).
- Más de 2 botones en el hero (lista libre).
- Editar la paleta por página/sección (es global).
- Modo oscuro / múltiples temas guardados.
- Personalizar espaciados/tamaños tipográficos (solo familia tipográfica).

---

## 9. Self-review
- Sin placeholders sin resolver: colores, fuentes, campos del hero y helpers (contrastColor, ensureReadableOnLight, isHexColor) están definidos.
- Consistencia: `themeJson` en SiteSettings; hero en su `dataJson`. Nombres `--on-*` coherentes con los componentes a ajustar.
- Riesgo principal: alcance del refactor de `text-*` sobre superficies de color → acotado a la lista de §3.3; defaults preservan el look actual, así que el QA es comparar "sin cambios" vs original.
