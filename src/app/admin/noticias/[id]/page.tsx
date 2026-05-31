import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { dateInputValue } from "@/lib/format";
import { NoticiaForm } from "../NoticiaForm";
import { updateNoticia } from "../actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Editar noticia" };

export default async function EditarNoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const noticia = await prisma.noticia.findUnique({ where: { id } });
  if (!noticia) notFound();

  const action = updateNoticia.bind(null, id);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Editar noticia" />
      <NoticiaForm
        action={action}
        submitLabel="Guardar cambios"
        initial={{
          title: noticia.title,
          slug: noticia.slug,
          date: dateInputValue(noticia.date),
          coverImage: noticia.coverImage,
          excerpt: noticia.excerpt,
          body: noticia.body,
          status: noticia.status,
        }}
      />
    </div>
  );
}
