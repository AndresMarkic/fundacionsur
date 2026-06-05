import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload, validateUpload } from "@/lib/upload";

// Usa fs (Node), no edge.
export const runtime = "nodejs";

/**
 * POST /api/upload — sube una imagen o PDF. Protegido: requiere sesión de admin.
 * Responde `{ url }` con la ruta pública, o 400 con el error de validación.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo inválido (se esperaba multipart/form-data)." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No se recibió ningún archivo en el campo 'file'." },
      { status: 400 },
    );
  }

  const valid = validateUpload({ type: file.type, size: file.size });
  if (!valid.ok) {
    return NextResponse.json({ error: valid.error }, { status: 400 });
  }

  try {
    const url = await saveUpload(file);
    return NextResponse.json({ url }, { status: 201 });
  } catch (e) {
    console.error("[upload] saveUpload falló:", e);
    const detail = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json(
      { error: `No se pudo guardar el archivo: ${detail}` },
      { status: 500 },
    );
  }
}
