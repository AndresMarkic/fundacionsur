import type { ReactNode } from "react";

export type Column<T> = {
  /** Encabezado de la columna. */
  header: string;
  /** Render de la celda para una fila. */
  cell: (row: T) => ReactNode;
  /** Clases extra para la celda (alineación, ancho, etc.). */
  className?: string;
};

/**
 * Tabla genérica del panel. Recibe `columns` (definición de celdas), `rows`
 * (datos), y un render opcional de `actions` por fila (Editar/Eliminar). Server
 * Component: las acciones interactivas las inyecta el llamador como nodos.
 */
export function AdminTable<T>({
  columns,
  rows,
  rowKey,
  actions,
  emptyMessage = "No hay registros todavía.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  actions?: (row: T) => ReactNode;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-piedra/30 bg-white p-10 text-center text-sm text-piedra">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-piedra/15 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-piedra/15 bg-fondo/60">
            {columns.map((col) => (
              <th
                key={col.header}
                className={`px-4 py-3 font-medium text-piedra ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
            {actions ? (
              <th className="px-4 py-3 text-right font-medium text-piedra">
                Acciones
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-piedra/10 last:border-0 hover:bg-fondo/40"
            >
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={`px-4 py-3 text-austral ${col.className ?? ""}`}
                >
                  {col.cell(row)}
                </td>
              ))}
              {actions ? (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-4">
                    {actions(row)}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
