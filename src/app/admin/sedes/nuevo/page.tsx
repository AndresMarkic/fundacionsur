import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SedeForm } from "../SedeForm";
import { createSede } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Nueva sede" };

export default function NuevaSedePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Nueva sede" />
      <SedeForm action={createSede} submitLabel="Crear sede" />
    </div>
  );
}
