import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { toCsv } from "@/lib/suscripcion";

// Usa prisma (Node), no edge.
export const runtime = "nodejs";

/**
 * GET /api/suscriptores/export — descarga los suscriptores como CSV.
 * PROTEGIDO: requiere sesión de admin (401 si no hay). Encabezado
 * `Nombre,Email,Fecha`, una fila por suscriptor, orden `createdAt` desc.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response("No autorizado.", { status: 401 });
  }

  const suscriptores = await prisma.suscriptor.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows: string[][] = [
    ["Nombre", "Email", "Fecha"],
    ...suscriptores.map((s) => [
      s.name ?? "",
      s.email,
      formatDate(s.createdAt),
    ]),
  ];

  const csv = toCsv(rows);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="suscriptores.csv"',
    },
  });
}
