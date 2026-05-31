"use client";

import { useFormStatus } from "react-dom";

/**
 * Botón de envío que refleja el estado del form padre (`useFormStatus`).
 * Muestra `pendingLabel` mientras la acción está en curso y se deshabilita.
 */
export function SubmitButton({
  children = "Guardar",
  pendingLabel = "Guardando…",
  className = "",
}: {
  children?: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ||
        "inline-flex items-center justify-center rounded-full bg-glaciar px-6 py-3 text-sm font-medium text-on-glaciar transition-all duration-200 hover:bg-austral hover:text-on-austral disabled:cursor-not-allowed disabled:opacity-60"
      }
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
