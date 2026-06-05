"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { SuscriptorFormState } from "./actions";

type Action = (
  prev: SuscriptorFormState,
  formData: FormData,
) => Promise<SuscriptorFormState>;

export type SuscriptorInitial = { name: string | null; email: string };

export function SuscriptorForm({
  action,
  initial,
  submitLabel = "Guardar",
}: {
  action: Action;
  initial?: SuscriptorInitial;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<SuscriptorFormState, FormData>(
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
        name="name"
        label="Nombre"
        defaultValue={initial?.name ?? ""}
      />
      <FormField
        name="email"
        label="Email"
        required
        defaultValue={initial?.email}
        error={state.errors?.email}
      />

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Link
          href="/admin/suscriptores"
          className="text-sm text-piedra hover:text-austral"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
