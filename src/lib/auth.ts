import bcrypt from "bcryptjs";

/**
 * Lógica de autorización pura y testeable, separada de next-auth.
 *
 * No importa prisma: el `lookup` se inyecta. Así podemos testear `validateAdmin`
 * sin levantar next-auth ni tocar la base, y `auth.ts` le pasa el lookup real
 * (prisma). bcryptjs sí se usa acá, por eso este módulo corre solo en Node.
 */

/** Admin tal cual vive en la base (incluye el hash). */
export type AdminRecord = {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
};

/** Admin seguro para propagar a la sesión (sin el hash). */
export type SafeAdmin = {
  id: string;
  email: string;
  name: string | null;
};

/** Busca un admin por email (o null si no existe). */
export type AdminLookup = (email: string) => Promise<AdminRecord | null>;

/**
 * Compara `plain` contra un hash bcrypt. Wrapper de `bcrypt.compare` que nunca
 * lanza: ante un hash vacío o malformado devuelve `false` en vez de propagar.
 */
export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  if (!plain || !hash) return false;
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

/**
 * Valida credenciales de admin contra el `lookup` provisto.
 *
 * Devuelve el admin SIN el hash si email+password son correctos, o `null` en
 * cualquier otro caso (campos vacíos, usuario inexistente, password incorrecto).
 * No revela cuál parte falló: siempre `null` ante error.
 */
export async function validateAdmin(
  email: string,
  password: string,
  lookup: AdminLookup,
): Promise<SafeAdmin | null> {
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail || !password) return null;

  const admin = await lookup(cleanEmail);
  if (!admin) return null;

  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) return null;

  return { id: admin.id, email: admin.email, name: admin.name };
}
