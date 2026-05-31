import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { NoticiaForm } from "../NoticiaForm";
import { createNoticia } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Nueva noticia" };

export default function NuevaNoticiaPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Nueva noticia" />
      <NoticiaForm action={createNoticia} submitLabel="Crear noticia" />
    </div>
  );
}
