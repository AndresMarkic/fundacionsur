import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AutoridadForm } from "../AutoridadForm";
import { updateAutoridad } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Editar autoridad" };

export default async function EditarAutoridadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const autoridad = await prisma.autoridad.findUnique({ where: { id } });
  if (!autoridad) notFound();

  const action = updateAutoridad.bind(null, id);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Editar autoridad" />
      <AutoridadForm
        action={action}
        submitLabel="Guardar cambios"
        initial={{
          name: autoridad.name,
          role: autoridad.role,
          photo: autoridad.photo,
          bio: autoridad.bio,
          order: autoridad.order,
        }}
      />
    </div>
  );
}
