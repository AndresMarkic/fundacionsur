"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { siblingSwap } from "@/lib/content";
import { defaultBlockData, isBlockType } from "@/lib/blocks";
import { isUploadPath, safeHref } from "@/lib/admin";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

function revalidate() {
  revalidatePath("/");
}

const str = (formData: FormData, k: string) =>
  (formData.get(k) as string | null)?.toString() ?? "";

const trimmed = (formData: FormData, k: string) => str(formData, k).trim();

/** Checkbox: presente ("on"/"true") → true; ausente → false. */
const checkbox = (formData: FormData, k: string) => {
  const v = str(formData, k);
  return v === "on" || v === "true";
};

const numOr = (formData: FormData, k: string, fallback: number) => {
  const n = Number.parseInt(str(formData, k), 10);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * Lee un campo de imagen del UploadField y solo lo conserva si es un path de
 * upload local válido (`/uploads/...`). Si no, devuelve "" para no persistir
 * URLs externas.
 */
const uploadPathOr = (formData: FormData, k: string) => {
  const v = trimmed(formData, k);
  return isUploadPath(v, { required: false }) ? v : "";
};

/**
 * Arma el objeto de datos del bloque a partir del form, según su `type`.
 * Las claves coinciden con las que leen los componentes en
 * `src/components/blocks/`. PURA respecto a la BD (solo lee FormData).
 */
function buildBlockData(
  type: string,
  formData: FormData,
): Record<string, unknown> {
  switch (type) {
    case "hero":
      return {
        image: uploadPathOr(formData, "image"),
        title: str(formData, "title"),
        subtitle: str(formData, "subtitle"),
        primary: {
          visible: checkbox(formData, "primaryVisible"),
          label: str(formData, "primaryLabel"),
          href: safeHref(trimmed(formData, "primaryHref")),
        },
        secondary: {
          visible: checkbox(formData, "secondaryVisible"),
          label: str(formData, "secondaryLabel"),
          href: safeHref(trimmed(formData, "secondaryHref")),
        },
      };
    case "noticias":
      return {
        title: str(formData, "title"),
        limit: numOr(formData, "limit", 6),
      };
    case "informes":
      return {
        title: str(formData, "title"),
        intro: str(formData, "intro"),
      };
    case "areas":
      return {
        title: str(formData, "title"),
        intro: str(formData, "intro"),
      };
    case "banner":
      return {
        image: uploadPathOr(formData, "image"),
        imageMobile: uploadPathOr(formData, "imageMobile"),
        link: safeHref(trimmed(formData, "link")),
        alt: str(formData, "alt"),
        buttonLabel: str(formData, "buttonLabel"),
      };
    case "mision":
      return {
        title: str(formData, "title"),
        text: str(formData, "text"),
        image: uploadPathOr(formData, "image"),
        cta: {
          label: str(formData, "ctaLabel"),
          href: safeHref(trimmed(formData, "ctaHref")),
        },
      };
    case "prensa":
      return {
        title: str(formData, "title"),
        limit: numOr(formData, "limit", 4),
      };
    case "contadores": {
      // Filas dinámicas: labels[], values[], suffixes[] en paralelo.
      const labels = formData.getAll("counterLabel").map((v) => v.toString());
      const values = formData.getAll("counterValue").map((v) => v.toString());
      const suffixes = formData
        .getAll("counterSuffix")
        .map((v) => v.toString());
      const items = labels
        .map((label, i) => ({
          label: label.trim(),
          value: Number.parseInt(values[i] ?? "", 10) || 0,
          suffix: (suffixes[i] ?? "").trim(),
        }))
        .filter((it) => it.label !== "");
      return { title: str(formData, "title"), items };
    }
    case "cta":
      return {
        title: str(formData, "title"),
        text: str(formData, "text"),
        buttonLabel: str(formData, "buttonLabel"),
      };
    default:
      return {};
  }
}

export async function updateBlockData(
  id: string,
  formData: FormData,
): Promise<void> {
  await requireAuth();
  const block = await prisma.homeBlock.findUnique({ where: { id } });
  if (!block) return;

  const data = buildBlockData(block.type, formData);
  await prisma.homeBlock.update({
    where: { id },
    data: { dataJson: JSON.stringify(data) },
  });

  revalidate();
  redirect("/admin/home");
}

export async function reorderBlock(
  id: string,
  dir: "up" | "down",
): Promise<void> {
  await requireAuth();
  const blocks = await prisma.homeBlock.findMany({
    select: { id: true, order: true },
    orderBy: { order: "asc" },
  });
  // Todos los bloques comparten el mismo "nivel": parentId null.
  const rows = blocks.map((b) => ({ ...b, parentId: null as string | null }));
  const swap = siblingSwap(rows, id, dir);
  if (!swap) return;

  await prisma.$transaction(
    swap.map((s) =>
      prisma.homeBlock.update({ where: { id: s.id }, data: { order: s.order } }),
    ),
  );

  revalidate();
  revalidatePath("/admin/home");
}

export async function toggleBlockVisible(id: string): Promise<void> {
  await requireAuth();
  const block = await prisma.homeBlock.findUnique({
    where: { id },
    select: { visible: true },
  });
  if (!block) return;
  await prisma.homeBlock.update({
    where: { id },
    data: { visible: !block.visible },
  });
  revalidate();
  revalidatePath("/admin/home");
}

export async function addBlock(type: string): Promise<void> {
  await requireAuth();
  if (!isBlockType(type)) return;

  const last = await prisma.homeBlock.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const order = (last?.order ?? -1) + 1;

  await prisma.homeBlock.create({
    data: {
      type,
      order,
      visible: true,
      dataJson: JSON.stringify(defaultBlockData(type)),
    },
  });

  revalidate();
  revalidatePath("/admin/home");
}

export async function deleteBlock(id: string): Promise<void> {
  await requireAuth();
  await prisma.homeBlock.delete({ where: { id } }).catch(() => {});
  revalidate();
  revalidatePath("/admin/home");
}
