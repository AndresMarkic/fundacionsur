import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AreaForm } from "../AreaForm";
import { createArea } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Nueva área" };

export default function NuevaAreaPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Nueva área" />
      <AreaForm action={createArea} submitLabel="Crear área" />
    </div>
  );
}
