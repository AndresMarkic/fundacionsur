import { slugify } from "@/lib/slug";

/**
 * Helpers PUROS para el panel admin (testeables sin BD ni request).
 */

/**
 * Genera un slug único a partir de `base`. Si `existsFn(candidate)` indica que
 * el slug ya está tomado, prueba sufijos incrementales `base-2`, `base-3`, …
 * hasta encontrar uno libre.
 *
 * `existsFn` recibe el candidato y devuelve `true` si ya existe (debe ignorar
 * el propio registro al editar, pasando un `existsFn` que excluya su id).
 *
 * @example uniqueSlug("hola", () => false) // "hola"
 * @example uniqueSlug("Hola Mundo", s => s === "hola-mundo") // "hola-mundo-2"
 */
export function uniqueSlug(
  base: string,
  existsFn: (candidate: string) => boolean,
): string {
  const root = slugify(base) || "item";
  if (!existsFn(root)) return root;
  for (let i = 2; ; i++) {
    const candidate = `${root}-${i}`;
    if (!existsFn(candidate)) return candidate;
  }
}

/** Error de validación: mapa campo → mensaje. */
export type FieldErrors = Record<string, string>;

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: FieldErrors };

/**
 * Valida la entrada de una Noticia: requiere `title` y `body` no vacíos.
 * Devuelve los errores por campo (no lanza) para alimentar `useActionState`.
 */
export function validateNoticiaInput(data: {
  title?: string | null;
  body?: string | null;
}): ValidationResult {
  const errors: FieldErrors = {};
  if (!data.title || !data.title.trim()) {
    errors.title = "El título es obligatorio.";
  }
  if (!data.body || !data.body.trim()) {
    errors.body = "El cuerpo es obligatorio.";
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true };
}

/** true si la URL es un path de upload local válido (o vacío/opcional). */
export function isUploadPath(
  value: string | null | undefined,
  { required = false } = {},
): boolean {
  const v = (value ?? "").trim();
  if (!v) return !required;
  return v.startsWith("/uploads/") && !v.includes("..");
}

/**
 * ¿`value` es una URL http(s) válida? PURA. Rechaza otros protocolos
 * (ftp, javascript, mailto), cadenas vacías y entradas no parseables.
 */
export function isValidUrl(value: string | null | undefined): boolean {
  if (!value || !value.trim()) return false;
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

/**
 * Normaliza un `href` para enlaces/botones: permite rutas internas (`/`),
 * anclas (`#`) y URLs http(s)/mailto/tel. Cualquier otro esquema (p. ej.
 * `javascript:`, `data:`) se descarta devolviendo "". PURA. Evita XSS por
 * `href` malicioso persistido desde el admin.
 */
export function safeHref(value: string | null | undefined): string {
  const v = (value ?? "").trim();
  if (!v) return "";
  if (v.startsWith("/") || v.startsWith("#")) return v;
  if (/^https?:\/\//i.test(v) || /^mailto:/i.test(v) || /^tel:/i.test(v)) return v;
  return "";
}
