"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateUsuarioInput, type FieldErrors } from "@/lib/admin";

export type UsuarioFormState = {
  errors?: FieldErrors;
  message?: string;
};

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

/**
 * Crea un usuario admin. El identificador de login es el campo `email` del
 * modelo `AdminUser` (acá rotulado "usuario"; puede ser texto, no solo email).
 * Normaliza a minúsculas y valida unicidad. La contraseña SIEMPRE se guarda
 * hasheada con bcrypt (nunca en texto plano).
 */
export async function createUsuario(
  _prev: UsuarioFormState,
  formData: FormData,
): Promise<UsuarioFormState> {
  await requireAuth();

  const usuario = ((formData.get("usuario") as string | null) ?? "")
    .trim()
    .toLowerCase();
  const nombre = ((formData.get("nombre") as string | null) ?? "").trim();
  const password = (formData.get("password") as string | null) ?? "";

  const result = validateUsuarioInput({ usuario, password });
  if (!result.ok) return { errors: result.errors };

  // Unicidad: el login se hace por este identificador (columna `email`).
  const existing = await prisma.adminUser.findUnique({
    where: { email: usuario },
  });
  if (existing) {
    return { errors: { usuario: "Ya existe un usuario con ese nombre." } };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.create({
    data: {
      email: usuario,
      name: nombre || null,
      passwordHash,
    },
  });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

/**
 * Elimina un usuario admin. Guard de seguridad: NUNCA borra si es el último
 * usuario (dejaría el panel sin acceso). La lista además oculta el botón cuando
 * hay uno solo; este conteo es la defensa de fondo.
 */
export async function deleteUsuario(id: string): Promise<void> {
  await requireAuth();

  // Atómico: contar y borrar dentro de una transacción y abortar si es el
  // último usuario, para no dejar el panel sin acceso (lockout).
  await prisma.$transaction(async (tx) => {
    const count = await tx.adminUser.count();
    if (count <= 1) {
      throw new Error("No se puede borrar el último usuario del sistema.");
    }
    await tx.adminUser.delete({ where: { id } });
  });

  revalidatePath("/admin/usuarios");
}

/**
 * Edita un usuario admin: cambia el identificador de login (`email`) y el
 * nombre, y OPCIONALMENTE la contraseña (solo si se ingresa una nueva; si el
 * campo va vacío, se mantiene la actual). Guard de auth + unicidad (excluyendo
 * el propio registro). La nueva contraseña se guarda hasheada con bcrypt.
 */
export async function updateUsuario(
  id: string,
  _prev: UsuarioFormState,
  formData: FormData,
): Promise<UsuarioFormState> {
  await requireAuth();

  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (!existing) return { message: "El usuario no existe." };

  const usuario = ((formData.get("usuario") as string | null) ?? "")
    .trim()
    .toLowerCase();
  const nombre = ((formData.get("nombre") as string | null) ?? "").trim();
  const password = (formData.get("password") as string | null) ?? "";

  const errors: FieldErrors = {};
  if (!usuario) errors.usuario = "El usuario es obligatorio.";
  if (password && password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }
  if (usuario && usuario !== existing.email) {
    const dup = await prisma.adminUser.findUnique({ where: { email: usuario } });
    if (dup && dup.id !== id) {
      errors.usuario = "Ya existe un usuario con ese nombre.";
    }
  }
  if (Object.keys(errors).length) return { errors };

  const data: { email: string; name: string | null; passwordHash?: string } = {
    email: usuario,
    name: nombre || null,
  };
  if (password) {
    data.passwordHash = await bcrypt.hash(password, 10);
  }
  await prisma.adminUser.update({ where: { id }, data });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}
