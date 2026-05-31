"use client";

import { useFormStatus } from "react-dom";

/**
 * Botón de borrado: vive dentro de un `<form action={deleteAction}>` (la action
 * va bindeada con el id). Pide confirmación con `window.confirm` antes de
 * enviar; si el usuario cancela, previene el submit.
 */
function InnerDelete({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm font-medium text-red-600 transition-colors hover:text-red-800 disabled:opacity-50"
    >
      {pending ? "Eliminando…" : label}
    </button>
  );
}

export function DeleteButton({
  action,
  label = "Eliminar",
  confirmMessage = "¿Eliminar este registro? Esta acción no se puede deshacer.",
}: {
  action: () => Promise<void>;
  label?: string;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      className="inline"
    >
      <InnerDelete label={label} />
    </form>
  );
}
