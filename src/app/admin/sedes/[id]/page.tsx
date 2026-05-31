import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SedeForm } from "../SedeForm";
import { updateSede } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Editar sede" };

export default async function EditarSedePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sede = await prisma.sede.findUnique({ where: { id } });
  if (!sede) notFound();

  const action = updateSede.bind(null, id);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Editar sede" />
      <SedeForm
        action={action}
        submitLabel="Guardar cambios"
        initial={{
          name: sede.name,
          address: sede.address,
          phone: sede.phone,
          email: sede.email,
          mapUrl: sede.mapUrl,
          order: sede.order,
        }}
      />
    </div>
  );
}
