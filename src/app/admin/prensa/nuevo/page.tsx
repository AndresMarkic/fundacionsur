import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PrensaForm } from "../PrensaForm";
import { createPrensa } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Nuevo recorte de prensa" };

export default function NuevoPrensaPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Nuevo recorte de prensa" />
      <PrensaForm action={createPrensa} submitLabel="Crear recorte" />
    </div>
  );
}
