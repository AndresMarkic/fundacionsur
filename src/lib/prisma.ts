import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Cliente Prisma (singleton).
 *
 * Prisma 7 usa el generador `prisma-client` con el "query compiler", que NO
 * incluye motor embebido: requiere un driver adapter. Para PostgreSQL usamos
 * `@prisma/adapter-pg` (`PrismaPg`), que internamente abre un pool de `pg`.
 * La cadena de conexión viene de `DATABASE_URL`.
 *
 * El pool de `pg` conecta de forma perezosa (en la primera query), así que
 * construir el cliente en build/import NO abre una conexión: el `next build`
 * puede completar sin una BD viva. Si `DATABASE_URL` falta, no explotamos en
 * import; el error surgirá recién al ejecutar una query real.
 */
const g = globalThis as unknown as { prisma?: PrismaClient };

function createPrisma(): PrismaClient {
  const connectionString = process.env.DATABASE_URL ?? "";
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = g.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") g.prisma = prisma;
