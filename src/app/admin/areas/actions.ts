"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uniqueSlug, type FieldErrors } from "@/lib/admin";
import { slugify } from "@/lib/slug";

export type AreaFormState = {
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
    slug: get("slug"),
    icon: get("icon"),
    shortDescription: get("shortDescription"),
    pageContent: formData.get("pageContent")?.toString() ?? "",
    order: Number.parseInt(get("order"), 10) || 0,
  };
}

function validate(data: ReturnType<typeof readForm>): FieldErrors | null {
  const errors: FieldErrors = {};
  if (!data.name) errors.name = "El nombre es obligatorio.";
  if (!data.shortDescription)
    errors.shortDescription = "La descripción corta es obligatoria.";
  return Object.keys(errors).length ? errors : null;
}

async function computeUniqueSlug(
  base: string,
  currentId?: string,
): Promise<string> {
  const taken = await prisma.area.findMany({
    where: currentId ? { NOT: { id: currentId } } : undefined,
    select: { slug: true },
  });
  const set = new Set(taken.map((t) => t.slug));
  return uniqueSlug(base, (s) => set.has(s));
}

function revalidate(slug: string) {
  revalidatePath("/");
  revalidatePath("/quienes-somos");
  revalidatePath(`/areas/${slug}`);
}

export async function createArea(
  _prev: AreaFormState,
  formData: FormData,
): Promise<AreaFormState> {
  await requireAuth();
  const data = readForm(formData);
  const errors = validate(data);
  if (errors) return { errors };

  const slug = await computeUniqueSlug(data.slug || slugify(data.name));

  await prisma.area.create({
    data: {
      name: data.name,
      slug,
      icon: data.icon || null,
      shortDescription: data.shortDescription,
      pageContent: data.pageContent || null,
      order: data.order,
    },
  });

  revalidate(slug);
  redirect("/admin/areas");
}

export async function updateArea(
  id: string,
  _prev: AreaFormState,
  formData: FormData,
): Promise<AreaFormState> {
  await requireAuth();
  const existing = await prisma.area.findUnique({ where: { id } });
  if (!existing) return { message: "El área no existe." };

  const data = readForm(formData);
  const errors = validate(data);
  if (errors) return { errors };

  const slug = await computeUniqueSlug(data.slug || slugify(data.name), id);

  await prisma.area.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      icon: data.icon || null,
      shortDescription: data.shortDescription,
      pageContent: data.pageContent || null,
      order: data.order,
    },
  });

  revalidate(slug);
  if (existing.slug !== slug) revalidatePath(`/areas/${existing.slug}`);
  redirect("/admin/areas");
}

export async function deleteArea(id: string): Promise<void> {
  await requireAuth();
  const existing = await prisma.area.findUnique({ where: { id } });
  await prisma.area.delete({ where: { id } });
  if (existing) revalidate(existing.slug);
  revalidatePath("/admin/areas");
}
