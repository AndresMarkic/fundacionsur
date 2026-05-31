/**
 * Helpers PUROS para suscripción y export (testeables sin BD ni request).
 */

/**
 * ¿`email` tiene forma de email válido? PURA. Regex razonable: exige una parte
 * local sin espacios, una `@`, un dominio con al menos un punto y un TLD de 2+
 * letras. Recorta espacios antes de validar. Rechaza vacío/null/undefined.
 *
 * @example isValidEmail("a@b.com")  // true
 * @example isValidEmail("a@")       // false
 * @example isValidEmail("a b@c.com")// false
 */
export function isValidEmail(email: string | null | undefined): boolean {
  const v = (email ?? "").trim();
  if (!v) return false;
  // local@dominio.tld — sin espacios, dominio con punto y TLD de 2+ letras.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

/**
 * Escapa un campo CSV: si contiene `,`, `"` o salto de línea, duplica las
 * comillas internas y envuelve todo el campo en comillas dobles. PURA.
 */
function escapeCsvField(field: string): string {
  if (/[",\r\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Convierte una matriz de filas (cada fila = array de celdas string) a un CSV.
 * PURA. Escapa cada campo (comillas duplicadas + envoltura cuando hay `,`/`"`/
 * salto de línea) y separa las filas con CRLF (`\r\n`), según RFC 4180.
 *
 * @example toCsv([["Nombre","Email"],["Ana","a@b.com"]])
 *   // 'Nombre,Email\r\nAna,a@b.com'
 */
export function toCsv(rows: string[][]): string {
  return rows
    .map((row) => row.map((cell) => escapeCsvField(cell ?? "")).join(","))
    .join("\r\n");
}
