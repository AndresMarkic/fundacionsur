import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteUsuario } from "./actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Usuarios" };

type Row = {
  id: string;
  email: string;
  name: string | null;
};

const columns: Column<Row>[] = [
  {
    header: "Usuario",
    cell: (r) => <span className="font-medium">{r.email}</span>,
  },
  {
    header: "Nombre",
    cell: (r) => r.name ?? <span className="text-piedra">—</span>,
  },
];

export default async function UsuariosAdminPage() {
  const rows = await prisma.adminUser.findMany({
    select: { id: true, email: true, name: true },
    orderBy: { email: "asc" },
  });

  // No permitir borrar el último usuario: dejaría el panel sin acceso.
  const canDelete = rows.length > 1;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Usuarios"
        description="Cuentas con acceso al panel de administración."
        newHref="/admin/usuarios/nuevo"
        newLabel="Nuevo usuario"
      />
      <AdminTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        emptyMessage="No hay usuarios todavía."
        actions={(r) => (
          <>
            <Link
              href={`/admin/usuarios/${r.id}`}
              className="text-sm font-medium text-glaciar hover:text-celeste"
            >
              Editar
            </Link>
            {canDelete ? (
              <DeleteButton
                action={deleteUsuario.bind(null, r.id)}
                confirmMessage="¿Eliminar este usuario? Perderá el acceso al panel."
              />
            ) : null}
          </>
        )}
      />
    </div>
  );
}
