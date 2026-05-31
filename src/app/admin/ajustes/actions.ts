"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUrl } from "@/lib/admin";
import type { FieldErrors } from "@/lib/admin";

export type SettingsFormState = {
  errors?: FieldErrors;
  message?: string;
  ok?: boolean;
};

/** Redes sociales editables (clave → etiqueta). Orden estable para el form. */
export const SOCIAL_KEYS = [
  "x",
  "youtube",
  "facebook",
  "instagram",
  "linkedin",
] as const;

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

const get = (formData: FormData, k: string) =>
  (formData.get(k) as string | null)?.toString().trim() ?? "";

/**
 * Guarda los ajustes del sitio (singleton). Guard de auth. Valida que las URLs
 * de redes, si no están vacías, sean http(s); vacío = OK (red no mostrada).
 * Serializa `social` y revalida el layout (donde vive el footer) y la home.
 */
export async function updateSettings(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAuth();

  const address = get(formData, "address");
  const email = get(formData, "email");
  const phone = get(formData, "phone");
  const footerText = get(formData, "footerText");

  const errors: FieldErrors = {};
  const social: Record<string, string> = {};

  for (const key of SOCIAL_KEYS) {
    const value = get(formData, `social.${key}`);
    if (!value) continue; // vacío = OK, no se guarda ni se muestra.
    if (!isValidUrl(value)) {
      errors[`social.${key}`] = "Ingresá una URL válida (http:// o https://).";
      continue;
    }
    social[key] = value;
  }

  if (Object.keys(errors).length) {
    return { errors, message: "Revisá los campos marcados." };
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      address: address || null,
      email: email || null,
      phone: phone || null,
      social: JSON.stringify(social),
      footerText: footerText || null,
    },
    create: {
      id: "singleton",
      address: address || null,
      email: email || null,
      phone: phone || null,
      social: JSON.stringify(social),
      footerText: footerText || null,
    },
  });

  // El footer vive en el layout: revalidamos layout + home.
  revalidatePath("/", "layout");
  revalidatePath("/");

  return { ok: true, message: "Ajustes guardados." };
}
