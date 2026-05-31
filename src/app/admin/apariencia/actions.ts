"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildThemePayload, DEFAULT_COLORS, type ColorKey } from "@/lib/theme";

export type ThemeFormState = {
  errors?: Record<string, string>;
  message?: string;
  ok?: boolean;
};

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

const get = (formData: FormData, k: string) =>
  (formData.get(k) as string | null)?.toString() ?? "";

function revalidate() {
  // El tema vive en <html> (root layout): revalidamos layout + home.
  revalidatePath("/", "layout");
  revalidatePath("/");
}

/**
 * Guarda el tema (5 colores + combinación tipográfica) en `SiteSettings`.
 * Guard de auth. Valida con `buildThemePayload` (hex y fontPair); si algo es
 * inválido devuelve estado de error para `useActionState` (no lanza).
 */
export async function updateTheme(
  _prev: ThemeFormState,
  formData: FormData,
): Promise<ThemeFormState> {
  await requireAuth();

  const colors: Record<string, string> = {};
  for (const key of Object.keys(DEFAULT_COLORS) as ColorKey[]) {
    colors[key] = get(formData, key);
  }

  const result = buildThemePayload({
    colors,
    fontPair: get(formData, "fontPair"),
  });

  if (!result.ok) {
    return { errors: result.errors, message: "Revisá los campos marcados." };
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { themeJson: result.themeJson },
    create: { id: "singleton", themeJson: result.themeJson },
  });

  revalidate();
  return { ok: true, message: "Apariencia guardada." };
}

/** Restablece el tema a los valores por defecto (themeJson vacío). Guard de auth. */
export async function resetTheme(): Promise<void> {
  await requireAuth();
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { themeJson: "{}" },
    create: { id: "singleton", themeJson: "{}" },
  });
  revalidate();
}
