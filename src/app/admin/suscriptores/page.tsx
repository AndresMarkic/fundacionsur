import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { formatDate } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Suscriptores" };

type Row = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
};

const columns: Column<Row>[] = [
  {
    header: "Nombre",
    cell: (r) =>
      r.name ? (
        <span className="font-medium">{r.name}</span>
      ) : (
        <span className="text-piedra">—</span>
      ),
  },
  { header: "Email", cell: (r) => r.email },
  {
    header: "Fecha",
    cell: (r) => formatDate(r.createdAt),
    className: "whitespace-nowrap",
  },
];

export default async function SuscriptoresAdminPage() {
  const rows = await prisma.suscriptor.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <AdminPageHeader
          title="Suscriptores"
          description={`${rows.length} ${
            rows.length === 1 ? "persona suscripta" : "personas suscriptas"
          } a las novedades.`}
        />
        {rows.length > 0 ? (
          <a
            href="/api/suscriptores/export"
            className="inline-flex items-center gap-2 rounded-full border border-glaciar px-5 py-2.5 text-sm font-medium text-glaciar transition-colors hover:bg-glaciar hover:text-white"
          >
            <span aria-hidden="true">↓</span>
            Exportar CSV
          </a>
        ) : null}
      </div>

      <AdminTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        emptyMessage="Todavía no hay suscriptores."
      />
    </div>
  );
}
