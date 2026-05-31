/**
 * Convierte un texto en un slug URL-safe.
 *
 * - Normaliza y elimina acentos/diacríticos (NFD + combining marks).
 * - Pasa a minúsculas.
 * - Reemplaza cualquier secuencia de caracteres no alfanuméricos por un único "-".
 * - Recorta los "-" de los extremos.
 *
 * @example slugify("Áreas del Sur!") // "areas-del-sur"
 * @example slugify("  Hola   Mundo  ") // "hola-mundo"
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
