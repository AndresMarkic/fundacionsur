import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDate } from "@/lib/format";
import { deletePrensa } from "./actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Prensa" };

type Row = {
  id: string;
  title: string;
  mediaOutlet: string;
  date: Date;
  externalUrl: string;
};

const columns: Column<Row>[] = [
  { header: "Título", cell: (r) => <span className="font-medium">{r.title}</span> },
  { header: "Medio", cell: (r) => r.mediaOutlet },
  { header: "Fecha", cell: (r) => formatDate(r.date), className: "whitespace-nowrap" },
  {
    header: "Enlace",
    cell: (r) => (
      <a
        href={r.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-celeste underline"
      >
        Ver
      </a>
    ),
  },
];

export default async function PrensaAdminPage() {
  const rows = await prisma.prensaItem.findMany({ orderBy: { date: "desc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Prensa"
        description="Repercusión en medios (recortes externos)."
        newHref="/admin/prensa/nuevo"
        newLabel="Nuevo recorte"
      />
      <AdminTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        actions={(r) => (
          <>
            <Link
              href={`/admin/prensa/${r.id}`}
              className="text-sm font-medium text-glaciar hover:text-celeste"
            >
              Editar
            </Link>
            <DeleteButton action={deletePrensa.bind(null, r.id)} />
          </>
        )}
      />
    </div>
  );
}
