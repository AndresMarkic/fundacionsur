/** Datos parseados de un bloque (objeto libre desde `dataJson`). */
export type BlockData = Record<string, unknown>;

/** Props comunes a todos los bloques de la home. */
export type BlockProps = {
  data: BlockData;
};

/** Lee un string del data del bloque con fallback. */
export function str(data: BlockData, key: string, fallback = ""): string {
  const v = data[key];
  return typeof v === "string" ? v : fallback;
}

/** Lee un number del data del bloque con fallback. */
export function num(data: BlockData, key: string, fallback: number): number {
  const v = data[key];
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
