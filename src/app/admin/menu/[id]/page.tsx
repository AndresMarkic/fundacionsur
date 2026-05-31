import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { SelectOption } from "@/components/admin/FormField";
import { collectDescendantIds } from "@/lib/content";
import { MenuForm } from "../MenuForm";
import { updateMenuItem } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Editar ítem de menú" };

export default async function EditarMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const all = await prisma.menuItem.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      label: true,
      href: true,
      parentId: true,
      visible: true,
      isCTA: true,
    },
  });

  const item = all.find((i) => i.id === id);
  if (!item) notFound();

  // Padres elegibles: raíces, excluyendo el propio ítem y sus descendientes
  // (evita ciclos). Solo raíces pueden ser padres (un nivel de anidación).
  const descendants = collectDescendantIds(all, id);
  const parentOptions: SelectOption[] = [
    { value: "", label: "— Ninguno (raíz) —" },
    ...all
      .filter(
        (i) => i.parentId === null && i.id !== id && !descendants.has(i.id),
      )
      .map((i) => ({ value: i.id, label: i.label })),
  ];

  const action = updateMenuItem.bind(null, id);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Editar ítem de menú" />
      <MenuForm
        action={action}
        parentOptions={parentOptions}
        submitLabel="Guardar cambios"
        initial={{
          label: item.label,
          href: item.href,
          parentId: item.parentId,
          isCTA: item.isCTA,
          visible: item.visible,
        }}
      />
    </div>
  );
}
