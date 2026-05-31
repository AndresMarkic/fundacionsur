"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { FieldErrors } from "@/lib/admin";

export type InformeFormState = {
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
    title: get("title"),
    description: get("description"),
    coverImage: get("coverImage"),
    fileUrl: get("fileUrl"),
    date: get("date"),
  };
}

function parseDate(value: string): Date {
  if (!value) return new Date();
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function validate(data: ReturnType<typeof readForm>): FieldErrors | null {
  const errors: FieldErrors = {};
  if (!data.title) errors.title = "El título es obligatorio.";
  if (!data.fileUrl) errors.fileUrl = "El archivo PDF es obligatorio.";
  return Object.keys(errors).length ? errors : null;
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/informes");
}

export async function createInforme(
  _prev: InformeFormState,
  formData: FormData,
): Promise<InformeFormState> {
  await requireAuth();
  const data = readForm(formData);
  const errors = validate(data);
  if (errors) return { errors };

  await prisma.informe.create({
    data: {
      title: data.title,
      description: data.description || null,
      coverImage: data.coverImage || null,
      fileUrl: data.fileUrl,
      date: parseDate(data.date),
    },
  });

  revalidate();
  redirect("/admin/informes");
}

export async function updateInforme(
  id: string,
  _prev: InformeFormState,
  formData: FormData,
): Promise<InformeFormState> {
  await requireAuth();
  const existing = await prisma.informe.findUnique({ where: { id } });
  if (!existing) return { message: "El informe no existe." };

  const data = readForm(formData);
  const errors = validate(data);
  if (errors) return { errors };

  await prisma.informe.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      coverImage: data.coverImage || null,
      fileUrl: data.fileUrl,
      date: parseDate(data.date),
    },
  });

  revalidate();
  redirect("/admin/informes");
}

export async function deleteInforme(id: string): Promise<void> {
  await requireAuth();
  await prisma.informe.delete({ where: { id } });
  revalidate();
  revalidatePath("/admin/informes");
}
