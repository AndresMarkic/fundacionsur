import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { dateInputValue } from "@/lib/format";
import { PrensaForm } from "../PrensaForm";
import { updatePrensa } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Editar recorte de prensa" };

export default async function EditarPrensaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.prensaItem.findUnique({ where: { id } });
  if (!item) notFound();

  const action = updatePrensa.bind(null, id);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Editar recorte de prensa" />
      <PrensaForm
        action={action}
        submitLabel="Guardar cambios"
        initial={{
          title: item.title,
          mediaOutlet: item.mediaOutlet,
          date: dateInputValue(item.date),
          externalUrl: item.externalUrl,
          thumbnail: item.thumbnail,
        }}
      />
    </div>
  );
}
