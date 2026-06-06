import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { UsuarioForm } from "../UsuarioForm";
import { updateUsuario } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Editar usuario" };

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const usuario = await prisma.adminUser.findUnique({
    where: { id },
    select: { id: true, email: true, name: true },
  });
  if (!usuario) notFound();

  const action = updateUsuario.bind(null, id);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Editar usuario" />
      <UsuarioForm
        action={action}
        submitLabel="Guardar cambios"
        passwordOptional
        initial={{ usuario: usuario.email, nombre: usuario.name }}
      />
    </div>
  );
}
