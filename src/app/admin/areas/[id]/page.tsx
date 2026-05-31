import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AreaForm } from "../AreaForm";
import { updateArea } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Editar área" };

export default async function EditarAreaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const area = await prisma.area.findUnique({ where: { id } });
  if (!area) notFound();

  const action = updateArea.bind(null, id);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Editar área" />
      <AreaForm
        action={action}
        submitLabel="Guardar cambios"
        initial={{
          name: area.name,
          slug: area.slug,
          icon: area.icon,
          shortDescription: area.shortDescription,
          pageContent: area.pageContent,
          order: area.order,
        }}
      />
    </div>
  );
}
