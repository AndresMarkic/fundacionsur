import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { parseBlock } from "@/lib/content";
import { blockLabel } from "@/lib/blocks";
import { BlockForm } from "../BlockForm";
import { updateBlockData } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Editar sección" };

export default async function EditarBlockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const block = await prisma.homeBlock.findUnique({ where: { id } });
  if (!block) notFound();

  const { data } = parseBlock(block);
  const action = updateBlockData.bind(null, id);

  return (
    <div className="space-y-6">
      <AdminPageHeader title={`Editar: ${blockLabel(block.type)}`} />
      <BlockForm type={block.type} data={data} action={action} />
    </div>
  );
}
