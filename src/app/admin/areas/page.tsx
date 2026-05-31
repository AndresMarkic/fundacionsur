import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteArea } from "./actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Áreas" };

type Row = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

const columns: Column<Row>[] = [
  { header: "Orden", cell: (r) => r.order, className: "w-16" },
  { header: "Nombre", cell: (r) => <span className="font-medium">{r.name}</span> },
  { header: "Slug", cell: (r) => <code className="text-xs text-piedra">{r.slug}</code> },
];

export default async function AreasAdminPage() {
  const rows = await prisma.area.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Áreas"
        description="Líneas de trabajo de la fundación."
        newHref="/admin/areas/nuevo"
        newLabel="Nueva área"
      />
      <AdminTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        actions={(r) => (
          <>
            <Link
              href={`/admin/areas/${r.id}`}
              className="text-sm font-medium text-glaciar hover:text-celeste"
            >
              Editar
            </Link>
            <DeleteButton action={deleteArea.bind(null, r.id)} />
          </>
        )}
      />
    </div>
  );
}
