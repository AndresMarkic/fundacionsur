import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SuscriptorForm } from "../SuscriptorForm";
import { updateSuscriptor } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Editar suscriptor" };

export default async function EditarSuscriptorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const suscriptor = await prisma.suscriptor.findUnique({ where: { id } });
  if (!suscriptor) notFound();

  const action = updateSuscriptor.bind(null, id);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Editar suscriptor" />
      <SuscriptorForm
        action={action}
        submitLabel="Guardar cambios"
        initial={{ name: suscriptor.name, email: suscriptor.email }}
      />
    </div>
  );
}
