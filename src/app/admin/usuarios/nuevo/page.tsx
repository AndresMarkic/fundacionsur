import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { UsuarioForm } from "../UsuarioForm";
import { createUsuario } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Nuevo usuario" };

export default function NuevoUsuarioPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Nuevo usuario" />
      <UsuarioForm action={createUsuario} submitLabel="Crear usuario" />
    </div>
  );
}
