/**
 * Formatea una fecha al estilo es-AR de día completo: "20 de mayo de 2026".
 * Acepta `Date`, ISO string o timestamp. Devuelve "" si la fecha es inválida.
 */
export function formatDate(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/**
 * Formatea una fecha a `yyyy-mm-dd` (UTC) para usar como `value` de un input
 * `type="date"`. Devuelve "" si la fecha es inválida.
 */
export function dateInputValue(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
