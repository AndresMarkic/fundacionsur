import Link from "next/link";

/**
 * Encabezado de página del panel: título + (opcional) botón "Nuevo" que
 * enlaza a `newHref`. Sin estado: Server Component.
 */
export function AdminPageHeader({
  title,
  description,
  newHref,
  newLabel = "Nuevo",
}: {
  title: string;
  description?: string;
  newHref?: string;
  newLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl text-austral">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-piedra">{description}</p>
        ) : null}
      </div>
      {newHref ? (
        <Link
          href={newHref}
          className="inline-flex items-center gap-2 rounded-full bg-glaciar px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-austral"
        >
          <span aria-hidden="true">+</span>
          {newLabel}
        </Link>
      ) : null}
    </div>
  );
}
