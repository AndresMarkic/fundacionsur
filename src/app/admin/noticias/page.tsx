import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDate } from "@/lib/format";
import { deleteNoticia } from "./actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Noticias" };

type Row = {
  id: string;
  title: string;
  date: Date;
  status: string;
};

const columns: Column<Row>[] = [
  { header: "Título", cell: (r) => <span className="font-medium">{r.title}</span> },
  { header: "Fecha", cell: (r) => formatDate(r.date), className: "whitespace-nowrap" },
  {
    header: "Estado",
    cell: (r) =>
      r.status === "published" ? (
        <span className="rounded-full bg-glaciar/10 px-2.5 py-0.5 text-xs font-medium text-glaciar">
          Publicada
        </span>
      ) : (
        <span className="rounded-full bg-piedra/10 px-2.5 py-0.5 text-xs font-medium text-piedra">
          Borrador
        </span>
      ),
  },
];

export default async function NoticiasAdminPage() {
  const rows = await prisma.noticia.findMany({ orderBy: { date: "desc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Noticias"
        description="Crear, editar y publicar notas."
        newHref="/admin/noticias/nuevo"
        newLabel="Nueva noticia"
      />
      <AdminTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        actions={(r) => (
          <>
            <Link
              href={`/admin/noticias/${r.id}`}
              className="text-sm font-medium text-glaciar hover:text-celeste"
            >
              Editar
            </Link>
            <DeleteButton action={deleteNoticia.bind(null, r.id)} />
          </>
        )}
      />
    </div>
  );
}
