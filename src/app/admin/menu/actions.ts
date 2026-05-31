"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { collectDescendantIds, siblingSwap } from "@/lib/content";
import type { FieldErrors } from "@/lib/admin";

export type MenuFormState = {
  errors?: FieldErrors;
  message?: string;
};

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

/** Revalida el layout (donde vive el header armado con getMenu) y la home. */
function revalidate() {
  revalidatePath("/", "layout");
  revalidatePath("/");
}

function readForm(formData: FormData) {
  const get = (k: string) => (formData.get(k) as string | null)?.trim() ?? "";
  const parentId = get("parentId");
  return {
    label: get("label"),
    href: get("href"),
    parentId: parentId === "" ? null : parentId,
    isCTA: formData.get("isCTA") === "on",
    visible: formData.get("visible") === "on",
  };
}

function validate(data: ReturnType<typeof readForm>): FieldErrors | null {
  const errors: FieldErrors = {};
  if (!data.label) errors.label = "El texto del ítem es obligatorio.";
  if (!data.href) errors.href = "El enlace (href) es obligatorio.";
  return Object.keys(errors).length ? errors : null;
}

/**
 * Resuelve el `parentId` para que no rompa la jerarquía:
 * - El padre debe existir y ser raíz (parentId === null): solo permitimos 1
 *   nivel de anidación, igual que el render del header.
 * - No puede ser el propio ítem ni un descendiente suyo (evita ciclos).
 * Si el candidato no es válido, devuelve `null` (queda como raíz).
 */
async function resolveParentId(
  candidate: string | null,
  currentId?: string,
): Promise<string | null> {
  if (!candidate) return null;
  if (candidate === currentId) return null;

  const rows = await prisma.menuItem.findMany({
    select: { id: true, parentId: true },
  });

  const parent = rows.find((r) => r.id === candidate);
  if (!parent) return null;
  if (parent.parentId !== null) return null; // solo raíces pueden ser padres

  if (currentId) {
    const descendants = collectDescendantIds(rows, currentId);
    if (descendants.has(candidate)) return null;
  }
  return candidate;
}

export async function createMenuItem(
  _prev: MenuFormState,
  formData: FormData,
): Promise<MenuFormState> {
  await requireAuth();
  const data = readForm(formData);
  const errors = validate(data);
  if (errors) return { errors };

  const parentId = await resolveParentId(data.parentId);

  // Append al final entre los hermanos del mismo nivel.
  const last = await prisma.menuItem.findFirst({
    where: { parentId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const order = (last?.order ?? -1) + 1;

  await prisma.menuItem.create({
    data: {
      label: data.label,
      href: data.href,
      parentId,
      order,
      visible: data.visible,
      isCTA: data.isCTA,
    },
  });

  revalidate();
  redirect("/admin/menu");
}

export async function updateMenuItem(
  id: string,
  _prev: MenuFormState,
  formData: FormData,
): Promise<MenuFormState> {
  await requireAuth();
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) return { message: "El ítem no existe." };

  const data = readForm(formData);
  const errors = validate(data);
  if (errors) return { errors };

  const parentId = await resolveParentId(data.parentId, id);

  // Si cambió de padre, lo mandamos al final de sus nuevos hermanos.
  let order = existing.order;
  if (parentId !== existing.parentId) {
    const last = await prisma.menuItem.findFirst({
      where: { parentId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    order = (last?.order ?? -1) + 1;
  }

  await prisma.menuItem.update({
    where: { id },
    data: {
      label: data.label,
      href: data.href,
      parentId,
      order,
      visible: data.visible,
      isCTA: data.isCTA,
    },
  });

  revalidate();
  redirect("/admin/menu");
}

export async function deleteMenuItem(id: string): Promise<void> {
  await requireAuth();
  // onDelete: SetNull en el schema → los hijos quedan como raíz.
  await prisma.menuItem.delete({ where: { id } }).catch(() => {});
  revalidate();
  revalidatePath("/admin/menu");
}

export async function moveMenuItem(
  id: string,
  dir: "up" | "down",
): Promise<void> {
  await requireAuth();
  const rows = await prisma.menuItem.findMany({
    select: { id: true, parentId: true, order: true },
  });
  const swap = siblingSwap(rows, id, dir);
  if (!swap) return; // borde o id inexistente: no-op

  await prisma.$transaction(
    swap.map((s) =>
      prisma.menuItem.update({ where: { id: s.id }, data: { order: s.order } }),
    ),
  );

  revalidate();
  revalidatePath("/admin/menu");
}

export async function toggleMenuItemVisible(id: string): Promise<void> {
  await requireAuth();
  const existing = await prisma.menuItem.findUnique({
    where: { id },
    select: { visible: true },
  });
  if (!existing) return;
  await prisma.menuItem.update({
    where: { id },
    data: { visible: !existing.visible },
  });
  revalidate();
  revalidatePath("/admin/menu");
}
