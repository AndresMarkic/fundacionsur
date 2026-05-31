import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteSede } from "./actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Sedes" };

type Row = {
  id: string;
  name: string;
  address: string | null;
  order: number;
};

const columns: Column<Row>[] = [
  { header: "Orden", cell: (r) => r.order, className: "w-16" },
  { header: "Nombre", cell: (r) => <span className="font-medium">{r.name}</span> },
  { header: "Dirección", cell: (r) => r.address ?? "—" },
];

export default async function SedesAdminPage() {
  const rows = await prisma.sede.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sedes"
        description="Ubicaciones y datos de contacto."
        newHref="/admin/sedes/nuevo"
        newLabel="Nueva sede"
      />
      <AdminTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        actions={(r) => (
          <>
            <Link
              href={`/admin/sedes/${r.id}`}
              className="text-sm font-medium text-glaciar hover:text-celeste"
            >
              Editar
            </Link>
            <DeleteButton action={deleteSede.bind(null, r.id)} />
          </>
        )}
      />
    </div>
  );
}
