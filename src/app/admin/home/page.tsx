import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { blockLabel } from "@/lib/blocks";
import { AddBlockForm } from "./AddBlockForm";
import { deleteBlock, reorderBlock, toggleBlockVisible } from "./actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Home" };

const iconBtn =
  "inline-flex h-7 w-7 items-center justify-center rounded-md border border-piedra/25 text-sm text-austral transition-colors hover:bg-fondo disabled:cursor-not-allowed disabled:opacity-30";

export default async function HomeAdminPage() {
  const blocks = await prisma.homeBlock.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Secciones de la portada"
        description="Reordená, mostrá u ocultá secciones de la home, editá su contenido o agregá nuevas."
      />

      <div className="rounded-2xl border border-piedra/15 bg-white p-4">
        <AddBlockForm />
      </div>

      {blocks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-piedra/30 bg-white p-10 text-center text-sm text-piedra">
          No hay secciones en la portada todavía.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-piedra/15 bg-white">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-piedra/15 bg-fondo/60">
                <th className="w-12 px-4 py-3 font-medium text-piedra">#</th>
                <th className="px-4 py-3 font-medium text-piedra">Sección</th>
                <th className="px-4 py-3 text-right font-medium text-piedra">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block, i) => (
                <tr
                  key={block.id}
                  className="border-b border-piedra/10 last:border-0 hover:bg-fondo/40"
                >
                  <td className="px-4 py-3 text-piedra">{i + 1}</td>
                  <td className="px-4 py-3 text-austral">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {blockLabel(block.type)}
                      </span>
                      <code className="text-xs text-piedra/70">
                        {block.type}
                      </code>
                      {!block.visible ? (
                        <span className="rounded-full bg-piedra/15 px-2 py-0.5 text-xs font-medium text-piedra">
                          Oculto
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <form action={reorderBlock.bind(null, block.id, "up")}>
                        <button
                          type="submit"
                          disabled={i === 0}
                          aria-label="Subir"
                          title="Subir"
                          className={iconBtn}
                        >
                          ↑
                        </button>
                      </form>
                      <form action={reorderBlock.bind(null, block.id, "down")}>
                        <button
                          type="submit"
                          disabled={i === blocks.length - 1}
                          aria-label="Bajar"
                          title="Bajar"
                          className={iconBtn}
                        >
                          ↓
                        </button>
                      </form>
                      <form action={toggleBlockVisible.bind(null, block.id)}>
                        <button
                          type="submit"
                          className="text-sm font-medium text-piedra hover:text-austral"
                        >
                          {block.visible ? "Ocultar" : "Mostrar"}
                        </button>
                      </form>
                      <Link
                        href={`/admin/home/${block.id}`}
                        className="text-sm font-medium text-glaciar hover:text-celeste"
                      >
                        Editar contenido
                      </Link>
                      <DeleteButton
                        action={deleteBlock.bind(null, block.id)}
                        confirmMessage="¿Eliminar esta sección de la portada?"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
