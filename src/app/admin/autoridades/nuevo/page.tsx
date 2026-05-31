import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AutoridadForm } from "../AutoridadForm";
import { createAutoridad } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Nueva autoridad" };

export default function NuevaAutoridadPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Nueva autoridad" />
      <AutoridadForm action={createAutoridad} submitLabel="Crear autoridad" />
    </div>
  );
}
