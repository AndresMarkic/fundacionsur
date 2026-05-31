import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { dateInputValue } from "@/lib/format";
import { InformeForm } from "../InformeForm";
import { updateInforme } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Editar informe" };

export default async function EditarInformePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const informe = await prisma.informe.findUnique({ where: { id } });
  if (!informe) notFound();

  const action = updateInforme.bind(null, id);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Editar informe" />
      <InformeForm
        action={action}
        submitLabel="Guardar cambios"
        initial={{
          title: informe.title,
          description: informe.description,
          coverImage: informe.coverImage,
          fileUrl: informe.fileUrl,
          date: dateInputValue(informe.date),
        }}
      />
    </div>
  );
}
