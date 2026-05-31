import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { InformeForm } from "../InformeForm";
import { createInforme } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Nuevo informe" };

export default function NuevoInformePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Nuevo informe" />
      <InformeForm action={createInforme} submitLabel="Crear informe" />
    </div>
  );
}
