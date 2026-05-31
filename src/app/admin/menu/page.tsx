import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import {
  deleteMenuItem,
  moveMenuItem,
  toggleMenuItemVisible,
} from "./actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Menú" };

type Item = {
  id: string;
  label: string;
  href: string;
  parentId: string | null;
  order: number;
  visible: boolean;
  isCTA: boolean;
};

/** Fila visual: ítem + nivel de indentación + flags de borde para subir/bajar. */
type RenderRow = {
  item: Item;
  depth: number;
  isFirst: boolean;
  isLast: boolean;
};

/**
 * Aplana el árbol (raíces ordenadas, con hijos indentados) calculando, por
 * nivel, si cada ítem es el primero/último de sus hermanos (para deshabilitar
 * Subir/Bajar en los bordes).
 */
function flattenTree(items: Item[]): RenderRow[] {
  const byOrder = (a: Item, b: Item) => a.order - b.order;
  const roots = items.filter((i) => i.parentId === null).sort(byOrder);
  const rootIds = new Set(roots.map((r) => r.id));
  const childrenOf = (id: string) =>
    items.filter((i) => i.parentId === id).sort(byOrder);

  const rows: RenderRow[] = [];
  roots.forEach((root, ri) => {
    rows.push({
      item: root,
      depth: 0,
      isFirst: ri === 0,
      isLast: ri === roots.length - 1,
    });
    const kids = childrenOf(root.id);
    kids.forEach((kid, ki) => {
      rows.push({
        item: kid,
        depth: 1,
        isFirst: ki === 0,
        isLast: ki === kids.length - 1,
      });
    });
  });

  // Huérfanos (parentId que no es raíz): mostrarlos como raíz al final, así no
  // se "pierden" visualmente del panel.
  const shown = new Set(rows.map((r) => r.item.id));
  const orphans = items
    .filter((i) => !shown.has(i.id) && !(i.parentId && rootIds.has(i.parentId)))
    .sort(byOrder);
  orphans.forEach((o, oi) => {
    rows.push({
      item: o,
      depth: 0,
      isFirst: false,
      isLast: oi === orphans.length - 1,
    });
  });

  return rows;
}

const iconBtn =
  "inline-flex h-7 w-7 items-center justify-center rounded-md border border-piedra/25 text-sm text-austral transition-colors hover:bg-fondo disabled:cursor-not-allowed disabled:opacity-30";

export default async function MenuAdminPage() {
  const items = await prisma.menuItem.findMany({
    orderBy: { order: "asc" },
  });
  const rows = flattenTree(items);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Menú de navegación"
        description="Agregá, reordená, ocultá y anidá los ítems del menú del sitio. Al eliminar un ítem padre, sus hijos pasan a ser ítems raíz."
        newHref="/admin/menu/nuevo"
        newLabel="Nuevo ítem"
      />

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-piedra/30 bg-white p-10 text-center text-sm text-piedra">
          No hay ítems en el menú todavía.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-piedra/15 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-piedra/15 bg-fondo/60">
                <th className="px-4 py-3 font-medium text-piedra">Ítem</th>
                <th className="px-4 py-3 font-medium text-piedra">Enlace</th>
                <th className="px-4 py-3 text-right font-medium text-piedra">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ item, depth, isFirst, isLast }) => (
                <tr
                  key={item.id}
                  className="border-b border-piedra/10 last:border-0 hover:bg-fondo/40"
                >
                  <td className="px-4 py-3 text-austral">
                    <div
                      className="flex items-center gap-2"
                      style={{ paddingLeft: depth * 22 }}
                    >
                      {depth > 0 ? (
                        <span aria-hidden="true" className="text-piedra/50">
                          └
                        </span>
                      ) : null}
                      <span className="font-medium">{item.label}</span>
                      {item.isCTA ? (
                        <span className="rounded-full bg-glaciar/10 px-2 py-0.5 text-xs font-medium text-glaciar">
                          CTA
                        </span>
                      ) : null}
                      {!item.visible ? (
                        <span className="rounded-full bg-piedra/15 px-2 py-0.5 text-xs font-medium text-piedra">
                          Oculto
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-piedra">{item.href}</code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <form action={moveMenuItem.bind(null, item.id, "up")}>
                        <button
                          type="submit"
                          disabled={isFirst}
                          aria-label="Subir"
                          title="Subir"
                          className={iconBtn}
                        >
                          ↑
                        </button>
                      </form>
                      <form action={moveMenuItem.bind(null, item.id, "down")}>
                        <button
                          type="submit"
                          disabled={isLast}
                          aria-label="Bajar"
                          title="Bajar"
                          className={iconBtn}
                        >
                          ↓
                        </button>
                      </form>
                      <form action={toggleMenuItemVisible.bind(null, item.id)}>
                        <button
                          type="submit"
                          className="text-sm font-medium text-piedra hover:text-austral"
                        >
                          {item.visible ? "Ocultar" : "Mostrar"}
                        </button>
                      </form>
                      <Link
                        href={`/admin/menu/${item.id}`}
                        className="text-sm font-medium text-glaciar hover:text-celeste"
                      >
                        Editar
                      </Link>
                      <DeleteButton
                        action={deleteMenuItem.bind(null, item.id)}
                        confirmMessage="¿Eliminar este ítem? Si tiene hijos, pasarán a ser ítems raíz."
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
