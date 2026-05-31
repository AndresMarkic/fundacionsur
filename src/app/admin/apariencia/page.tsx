import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getSettings } from "@/lib/content";
import { AparienciaForm } from "./AparienciaForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Apariencia" };

export default async function AparienciaAdminPage() {
  const { theme } = await getSettings();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Apariencia"
        description="Colores de marca y combinación tipográfica del sitio. Los textos sobre color ajustan su contraste automáticamente."
      />
      <AparienciaForm
        initial={{ colors: theme.colors, fontPair: theme.fontPair }}
      />
    </div>
  );
}
