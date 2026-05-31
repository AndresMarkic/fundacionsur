"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { FieldErrors } from "@/lib/admin";

export type SedeFormState = {
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
    address: get("address"),
    phone: get("phone"),
    email: get("email"),
    mapUrl: get("mapUrl"),
    order: Number.parseInt(get("order"), 10) || 0,
  };
}

function validate(data: ReturnType<typeof readForm>): FieldErrors | null {
  const errors: FieldErrors = {};
  if (!data.name) errors.name = "El nombre es obligatorio.";
  return Object.keys(errors).length ? errors : null;
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/quienes-somos");
}

export async function createSede(
  _prev: SedeFormState,
  formData: FormData,
): Promise<SedeFormState> {
  await requireAuth();
  const data = readForm(formData);
  const errors = validate(data);
  if (errors) return { errors };

  await prisma.sede.create({
    data: {
      name: data.name,
      address: data.address || null,
      phone: data.phone || null,
      email: data.email || null,
      mapUrl: data.mapUrl || null,
      order: data.order,
    },
  });

  revalidate();
  redirect("/admin/sedes");
}

export async function updateSede(
  id: string,
  _prev: SedeFormState,
  formData: FormData,
): Promise<SedeFormState> {
  await requireAuth();
  const existing = await prisma.sede.findUnique({ where: { id } });
  if (!existing) return { message: "La sede no existe." };

  const data = readForm(formData);
  const errors = validate(data);
  if (errors) return { errors };

  await prisma.sede.update({
    where: { id },
    data: {
      name: data.name,
      address: data.address || null,
      phone: data.phone || null,
      email: data.email || null,
      mapUrl: data.mapUrl || null,
      order: data.order,
    },
  });

  revalidate();
  redirect("/admin/sedes");
}

export async function deleteSede(id: string): Promise<void> {
  await requireAuth();
  await prisma.sede.delete({ where: { id } });
  revalidate();
  revalidatePath("/admin/sedes");
}
