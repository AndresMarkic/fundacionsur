import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getSettings } from "@/lib/content";
import { SettingsForm } from "./SettingsForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Ajustes" };

export default async function AjustesAdminPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Ajustes del sitio"
        description="Datos de contacto, redes y pie de página."
      />
      <SettingsForm
        initial={{
          address: settings.address,
          email: settings.email,
          phone: settings.phone,
          social: settings.social,
          footerText: settings.footerText,
        }}
      />
    </div>
  );
}
