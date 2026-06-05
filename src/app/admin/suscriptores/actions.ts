"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidEmail } from "@/lib/suscripcion";
import type { FieldErrors } from "@/lib/admin";

export type SuscriptorFormState = {
  errors?: FieldErrors;
  message?: string;
};

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

export async function updateSuscriptor(
  id: string,
  _prev: SuscriptorFormState,
  formData: FormData,
): Promise<SuscriptorFormState> {
  await requireAuth();
  const existing = await prisma.suscriptor.findUnique({ where: { id } });
  if (!existing) return { message: "El suscriptor no existe." };

  const name = ((formData.get("name") as string | null) ?? "").trim();
  const email = ((formData.get("email") as string | null) ?? "")
    .trim()
    .toLowerCase();

  const errors: FieldErrors = {};
  if (!isValidEmail(email)) {
    errors.email = "Ingresá un email válido.";
  } else {
    const dup = await prisma.suscriptor.findUnique({ where: { email } });
    if (dup && dup.id !== id) {
      errors.email = "Ya existe un suscriptor con ese email.";
    }
  }
  if (Object.keys(errors).length) return { errors };

  await prisma.suscriptor.update({
    where: { id },
    data: { name: name || null, email },
  });

  revalidatePath("/admin/suscriptores");
  redirect("/admin/suscriptores");
}

export async function deleteSuscriptor(id: string): Promise<void> {
  await requireAuth();
  await prisma.suscriptor.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/suscriptores");
}
