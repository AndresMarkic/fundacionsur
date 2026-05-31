import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/** Tamaño máximo permitido: 8 MB. */
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export type ValidateResult = { ok: true } | { ok: false; error: string };

/**
 * Valida un archivo a subir (PURA, testeable sin fs ni request).
 *
 * Acepta cualquier `image/*` y `application/pdf`; rechaza el resto, los
 * archivos vacíos y los que superan {@link MAX_UPLOAD_BYTES}.
 */
export function validateUpload(file: {
  type: string;
  size: number;
}): ValidateResult {
  const type = (file.type ?? "").toLowerCase();
  const isImage = type.startsWith("image/");
  const isPdf = type === "application/pdf";
  if (!isImage && !isPdf) {
    return { ok: false, error: "Tipo de archivo no permitido." };
  }
  if (!Number.isFinite(file.size) || file.size <= 0) {
    return { ok: false, error: "El archivo está vacío." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "El archivo supera el máximo de 8 MB." };
  }
  return { ok: true };
}

// Extensiones seguras por mime conocido. Para `image/*` no listados caemos a
// una extensión derivada del subtipo, saneada.
const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
};

/** Deriva una extensión segura del mime (y, como respaldo, del nombre). */
export function safeExtension(type: string, fileName?: string): string {
  const mime = (type ?? "").toLowerCase();
  if (EXT_BY_MIME[mime]) return EXT_BY_MIME[mime];

  if (mime.startsWith("image/")) {
    const subtype = mime.slice("image/".length).replace(/\+.*$/, "");
    const cleaned = subtype.replace(/[^a-z0-9]/g, "");
    if (cleaned) return cleaned;
  }

  if (fileName) {
    const ext = path.extname(fileName).replace(/^\./, "").toLowerCase();
    const cleaned = ext.replace(/[^a-z0-9]/g, "");
    if (cleaned) return cleaned;
  }

  return "bin";
}

/** Directorio físico donde se guardan los uploads. */
export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Valida y guarda un `File` en `public/uploads/` con un nombre único, y
 * devuelve la URL pública (`/uploads/<archivo>`). Lanza si la validación falla.
 * Solo Node (usa fs).
 */
export async function saveUpload(file: File): Promise<string> {
  const result = validateUpload({ type: file.type, size: file.size });
  if (!result.ok) {
    throw new Error(result.error);
  }

  const ext = safeExtension(file.type, file.name);
  const fileName = `${randomUUID()}.${ext}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, fileName), buffer);

  return `/uploads/${fileName}`;
}
