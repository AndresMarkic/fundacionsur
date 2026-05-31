"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FormField, type SelectOption } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { MenuFormState } from "./actions";

type Action = (
  prev: MenuFormState,
  formData: FormData,
) => Promise<MenuFormState>;

export type MenuInitial = {
  label: string;
  href: string;
  parentId: string | null;
  isCTA: boolean;
  visible: boolean;
};

const checkboxRow =
  "flex items-center gap-2.5 text-sm font-medium text-austral";
const checkboxInput =
  "h-4 w-4 rounded border-piedra/40 text-glaciar focus:ring-glaciar/30";

export function MenuForm({
  action,
  initial,
  parentOptions,
  submitLabel = "Guardar",
}: {
  action: Action;
  initial?: MenuInitial;
  /** Opciones de "padre": "— Ninguno (raíz) —" + raíces elegibles. */
  parentOptions: SelectOption[];
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<MenuFormState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {state.message ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.message}
        </p>
      ) : null}

      <FormField
        name="label"
        label="Texto del ítem"
        required
        defaultValue={initial?.label}
        error={state.errors?.label}
        placeholder="Quiénes somos"
      />

      <FormField
        name="href"
        label="Enlace (href)"
        required
        defaultValue={initial?.href}
        error={state.errors?.href}
        placeholder="/quienes-somos o https://..."
        hint="Puede ser una ruta interna (/prensa) o una URL externa."
      />

      <FormField
        name="parentId"
        label="Ítem padre"
        variant="select"
        defaultValue={initial?.parentId ?? ""}
        options={parentOptions}
        hint="Anidá este ítem bajo otro para que aparezca como desplegable. Solo se permite un nivel de anidación."
      />

      <div className="space-y-3 pt-1">
        <label className={checkboxRow}>
          <input
            type="checkbox"
            name="isCTA"
            defaultChecked={initial?.isCTA ?? false}
            className={checkboxInput}
          />
          Mostrar como botón destacado (CTA)
        </label>
        <label className={checkboxRow}>
          <input
            type="checkbox"
            name="visible"
            defaultChecked={initial?.visible ?? true}
            className={checkboxInput}
          />
          Visible en el sitio
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Link
          href="/admin/menu"
          className="text-sm text-piedra hover:text-austral"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
