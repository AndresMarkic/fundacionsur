import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { SelectOption } from "@/components/admin/FormField";
import { MenuForm } from "../MenuForm";
import { createMenuItem } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Nuevo ítem de menú" };

export default async function NuevoMenuItemPage() {
  // Solo las raíces pueden ser padres (un nivel de anidación).
  const roots = await prisma.menuItem.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" },
    select: { id: true, label: true },
  });

  const parentOptions: SelectOption[] = [
    { value: "", label: "— Ninguno (raíz) —" },
    ...roots.map((r) => ({ value: r.id, label: r.label })),
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Nuevo ítem de menú" />
      <MenuForm
        action={createMenuItem}
        parentOptions={parentOptions}
        submitLabel="Crear ítem"
      />
    </div>
  );
}
