"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { UsuarioFormState } from "./actions";

type Action = (
  prev: UsuarioFormState,
  formData: FormData,
) => Promise<UsuarioFormState>;

const inputClasses =
  "w-full rounded-lg border border-piedra/30 bg-white px-3 py-2.5 text-sm text-austral outline-none transition-colors focus:border-glaciar focus:ring-2 focus:ring-glaciar/20";

export function UsuarioForm({
  action,
  submitLabel = "Crear usuario",
  initial,
  passwordOptional = false,
}: {
  action: Action;
  submitLabel?: string;
  initial?: { usuario: string; nombre: string | null };
  passwordOptional?: boolean;
}) {
  const [state, formAction] = useActionState<UsuarioFormState, FormData>(
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
        name="usuario"
        label="Usuario"
        required
        placeholder="administrador"
        defaultValue={initial?.usuario}
        error={state.errors?.usuario}
        hint="Nombre de acceso al panel. Se guarda en minúsculas."
      />
      <FormField name="nombre" label="Nombre" defaultValue={initial?.nombre ?? ""} />

      {/* Campo de contraseña: FormField no tiene variante password, así que lo
          renderizamos directo con el mismo estilo. En edición es opcional. */}
      <div className="space-y-1.5">
        <label
          htmlFor="field-password"
          className="block text-sm font-medium text-austral"
        >
          Contraseña
          {!passwordOptional ? (
            <span className="ml-0.5 text-red-600">*</span>
          ) : null}
        </label>
        <input
          id="field-password"
          name="password"
          type="password"
          required={!passwordOptional}
          minLength={6}
          autoComplete="new-password"
          className={inputClasses}
        />
        {state.errors?.password ? (
          <p role="alert" className="text-xs text-red-600">
            {state.errors.password}
          </p>
        ) : (
          <p className="text-xs text-piedra">
            {passwordOptional
              ? "Dejala vacía para mantener la actual. Mínimo 6 caracteres si la cambiás."
              : "Mínimo 6 caracteres."}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Link
          href="/admin/usuarios"
          className="text-sm text-piedra hover:text-austral"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
