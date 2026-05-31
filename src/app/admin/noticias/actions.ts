"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  isUploadPath,
  uniqueSlug,
  validateNoticiaInput,
  type FieldErrors,
} from "@/lib/admin";
import { slugify } from "@/lib/slug";

export type NoticiaFormState = {
  errors?: FieldErrors;
  message?: string;
};

/** Verifica sesión; lanza si no hay (defensa en profundidad). */
async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

/** Lee y normaliza los campos del form de Noticia. */
function readForm(formData: FormData) {
  const get = (k: string) => (formData.get(k) as string | null)?.trim() ?? "";
  return {
    title: get("title"),
    slug: get("slug"),
    date: get("date"),
    coverImage: get("coverImage"),
    excerpt: get("excerpt"),
    body: formData.get("body")?.toString() ?? "",
    status: get("status") === "published" ? "published" : "draft",
  };
}

/** Parsea una fecha `yyyy-mm-dd` a Date (UTC); usa ahora si está vacía. */
function parseDate(value: string): Date {
  if (!value) return new Date();
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Calcula un slug único. `base` es el slug propuesto (o el title). Excluye el
 * registro `currentId` (en edición) para no chocar consigo mismo.
 */
async function computeUniqueSlug(
  base: string,
  currentId?: string,
): Promise<string> {
  const taken = await prisma.noticia.findMany({
    where: currentId ? { NOT: { id: currentId } } : undefined,
    select: { slug: true },
  });
  const set = new Set(taken.map((t) => t.slug));
  return uniqueSlug(base, (s) => set.has(s));
}

function revalidate(slug: string) {
  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath(`/noticias/${slug}`);
}

export async function createNoticia(
  _prev: NoticiaFormState,
  formData: FormData,
): Promise<NoticiaFormState> {
  await requireAuth();
  const data = readForm(formData);

  const validation = validateNoticiaInput(data);
  if (!validation.ok) return { errors: validation.errors };
  if (!isUploadPath(data.coverImage))
    return {
      errors: { coverImage: "Archivo inválido. Subí el archivo con el selector." },
    };

  const base = data.slug || slugify(data.title);
  const slug = await computeUniqueSlug(base);

  await prisma.noticia.create({
    data: {
      title: data.title,
      slug,
      date: parseDate(data.date),
      coverImage: data.coverImage || null,
      excerpt: data.excerpt || null,
      body: data.body,
      status: data.status,
    },
  });

  revalidate(slug);
  redirect("/admin/noticias");
}

export async function updateNoticia(
  id: string,
  _prev: NoticiaFormState,
  formData: FormData,
): Promise<NoticiaFormState> {
  await requireAuth();
  const existing = await prisma.noticia.findUnique({ where: { id } });
  if (!existing) return { message: "La noticia no existe." };

  const data = readForm(formData);
  const validation = validateNoticiaInput(data);
  if (!validation.ok) return { errors: validation.errors };
  if (!isUploadPath(data.coverImage))
    return {
      errors: { coverImage: "Archivo inválido. Subí el archivo con el selector." },
    };

  const base = data.slug || slugify(data.title);
  const slug = await computeUniqueSlug(base, id);

  await prisma.noticia.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      date: parseDate(data.date),
      coverImage: data.coverImage || null,
      excerpt: data.excerpt || null,
      body: data.body,
      status: data.status,
    },
  });

  revalidate(slug);
  // Si cambió el slug, revalidamos también la URL vieja.
  if (existing.slug !== slug) revalidatePath(`/noticias/${existing.slug}`);
  redirect("/admin/noticias");
}

export async function deleteNoticia(id: string): Promise<void> {
  await requireAuth();
  const existing = await prisma.noticia.findUnique({ where: { id } });
  await prisma.noticia.delete({ where: { id } });
  if (existing) revalidate(existing.slug);
  revalidatePath("/admin/noticias");
}
