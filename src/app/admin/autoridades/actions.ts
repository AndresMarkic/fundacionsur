"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isUploadPath, type FieldErrors } from "@/lib/admin";

export type AutoridadFormState = {
  errors?: FieldErrors;
  message?: string;
};

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

function readForm(formData: FormData) {
  const get = (k: string) => (formData.get(k) as string | null)?.trim() ?? "";
  return {
    name: get("name"),
    role: get("role"),
    photo: get("photo"),
    bio: get("bio"),
    order: Number.parseInt(get("order"), 10) || 0,
  };
}

function validate(data: ReturnType<typeof readForm>): FieldErrors | null {
  const errors: FieldErrors = {};
  if (!data.name) errors.name = "El nombre es obligatorio.";
  if (!data.role) errors.role = "El rol es obligatorio.";
  if (!isUploadPath(data.photo))
    errors.photo = "Archivo inválido. Subí el archivo con el selector.";
  return Object.keys(errors).length ? errors : null;
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/quienes-somos");
}

export async function createAutoridad(
  _prev: AutoridadFormState,
  formData: FormData,
): Promise<AutoridadFormState> {
  await requireAuth();
  const data = readForm(formData);
  const errors = validate(data);
  if (errors) return { errors };

  await prisma.autoridad.create({
    data: {
      name: data.name,
      role: data.role,
      photo: data.photo || null,
      bio: data.bio || null,
      order: data.order,
    },
  });

  revalidate();
  redirect("/admin/autoridades");
}

export async function updateAutoridad(
  id: string,
  _prev: AutoridadFormState,
  formData: FormData,
): Promise<AutoridadFormState> {
  await requireAuth();
  const existing = await prisma.autoridad.findUnique({ where: { id } });
  if (!existing) return { message: "La autoridad no existe." };

  const data = readForm(formData);
  const errors = validate(data);
  if (errors) return { errors };

  await prisma.autoridad.update({
    where: { id },
    data: {
      name: data.name,
      role: data.role,
      photo: data.photo || null,
      bio: data.bio || null,
      order: data.order,
    },
  });

  revalidate();
  redirect("/admin/autoridades");
}

export async function deleteAutoridad(id: string): Promise<void> {
  await requireAuth();
  await prisma.autoridad.delete({ where: { id } });
  revalidate();
  revalidatePath("/admin/autoridades");
}
