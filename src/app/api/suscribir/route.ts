import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidEmail } from "@/lib/suscripcion";

// Usa prisma (Node), no edge.
export const runtime = "nodejs";

/**
 * POST /api/suscribir — alta pública a la lista de suscriptores. SIN auth.
 *
 * Acepta `multipart/form-data`, `application/x-www-form-urlencoded` o JSON con
 * `email` (obligatorio) y `name` (opcional). Campo trampa `website` (honeypot):
 * si viene con valor, respondemos 200 sin guardar (descartamos el bot en
 * silencio). Email inválido → 400. Upsert por email (no duplica) → 200.
 */
export async function POST(request: Request) {
  let email = "";
  let name = "";
  let honeypot = "";

  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as Record<string, unknown>;
      email = typeof body.email === "string" ? body.email : "";
      name = typeof body.name === "string" ? body.name : "";
      honeypot = typeof body.website === "string" ? body.website : "";
    } else {
      const formData = await request.formData();
      email = (formData.get("email") as string | null)?.toString() ?? "";
      name = (formData.get("name") as string | null)?.toString() ?? "";
      honeypot = (formData.get("website") as string | null)?.toString() ?? "";
    }
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  email = email.trim();
  name = name.trim();

  // Honeypot: un humano deja `website` vacío. Si vino con algo → es bot.
  // Respondemos OK para no darle pistas, pero NO guardamos.
  if (honeypot.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Ingresá un email válido." },
      { status: 400 },
    );
  }

  await prisma.suscriptor.upsert({
    where: { email },
    update: name ? { name } : {},
    create: { email, name: name || null },
  });

  return NextResponse.json({ ok: true });
}
