"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUrl, type FieldErrors } from "@/lib/admin";

export type PrensaFormState = {
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
    mediaOutlet: get("mediaOutlet"),
    date: get("date"),
    externalUrl: get("externalUrl"),
    thumbnail: get("thumbnail"),
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
  if (!data.mediaOutlet) errors.mediaOutlet = "El medio es obligatorio.";
  if (!data.externalUrl) errors.externalUrl = "La URL es obligatoria.";
  else if (!isValidUrl(data.externalUrl))
    errors.externalUrl = "Debe ser una URL http(s) válida.";
  return Object.keys(errors).length ? errors : null;
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/prensa");
}

export async function createPrensa(
  _prev: PrensaFormState,
  formData: FormData,
): Promise<PrensaFormState> {
  await requireAuth();
  const data = readForm(formData);
  const errors = validate(data);
  if (errors) return { errors };

  await prisma.prensaItem.create({
    data: {
      title: data.title,
      mediaOutlet: data.mediaOutlet,
      date: parseDate(data.date),
      externalUrl: data.externalUrl,
      thumbnail: data.thumbnail || null,
    },
  });

  revalidate();
  redirect("/admin/prensa");
}

export async function updatePrensa(
  id: string,
  _prev: PrensaFormState,
  formData: FormData,
): Promise<PrensaFormState> {
  await requireAuth();
  const existing = await prisma.prensaItem.findUnique({ where: { id } });
  if (!existing) return { message: "El recorte no existe." };

  const data = readForm(formData);
  const errors = validate(data);
  if (errors) return { errors };

  await prisma.prensaItem.update({
    where: { id },
    data: {
      title: data.title,
      mediaOutlet: data.mediaOutlet,
      date: parseDate(data.date),
      externalUrl: data.externalUrl,
      thumbnail: data.thumbnail || null,
    },
  });

  revalidate();
  redirect("/admin/prensa");
}

export async function deletePrensa(id: string): Promise<void> {
  await requireAuth();
  await prisma.prensaItem.delete({ where: { id } });
  revalidate();
  revalidatePath("/admin/prensa");
}
