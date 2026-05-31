import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteAutoridad } from "./actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Autoridades" };

type Row = {
  id: string;
  name: string;
  role: string;
  order: number;
};

const columns: Column<Row>[] = [
  { header: "Orden", cell: (r) => r.order, className: "w-16" },
  { header: "Nombre", cell: (r) => <span className="font-medium">{r.name}</span> },
  { header: "Rol", cell: (r) => r.role },
];

export default async function AutoridadesAdminPage() {
  const rows = await prisma.autoridad.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Autoridades"
        description="Equipo y consejo de la fundación."
        newHref="/admin/autoridades/nuevo"
        newLabel="Nueva autoridad"
      />
      <AdminTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        actions={(r) => (
          <>
            <Link
              href={`/admin/autoridades/${r.id}`}
              className="text-sm font-medium text-glaciar hover:text-celeste"
            >
              Editar
            </Link>
            <DeleteButton action={deleteAutoridad.bind(null, r.id)} />
          </>
        )}
      />
    </div>
  );
}
