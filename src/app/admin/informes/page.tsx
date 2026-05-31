import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDate } from "@/lib/format";
import { deleteInforme } from "./actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Informes" };

type Row = {
  id: string;
  title: string;
  date: Date;
  fileUrl: string;
};

const columns: Column<Row>[] = [
  { header: "Título", cell: (r) => <span className="font-medium">{r.title}</span> },
  { header: "Fecha", cell: (r) => formatDate(r.date), className: "whitespace-nowrap" },
  {
    header: "Archivo",
    cell: (r) => (
      <a
        href={r.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-celeste underline"
      >
        PDF
      </a>
    ),
  },
];

export default async function InformesAdminPage() {
  const rows = await prisma.informe.findMany({ orderBy: { date: "desc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Informes"
        description="Documentos y PDF descargables."
        newHref="/admin/informes/nuevo"
        newLabel="Nuevo informe"
      />
      <AdminTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        actions={(r) => (
          <>
            <Link
              href={`/admin/informes/${r.id}`}
              className="text-sm font-medium text-glaciar hover:text-celeste"
            >
              Editar
            </Link>
            <DeleteButton action={deleteInforme.bind(null, r.id)} />
          </>
        )}
      />
    </div>
  );
}
