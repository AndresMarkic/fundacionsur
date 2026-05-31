import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Cliente Prisma (singleton).
 *
 * Prisma 7 usa el generador `prisma-client` con el "query compiler", que NO
 * incluye motor embebido: requiere un driver adapter. Para SQLite usamos
 * `@prisma/adapter-better-sqlite3`. La URL viene de `DATABASE_URL`
 * (p. ej. "file:./dev.db", relativa al directorio de trabajo).
 */
const g = globalThis as unknown as { prisma?: PrismaClient };

function createPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

export const prisma = g.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") g.prisma = prisma;
