"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { SedeFormState } from "./actions";

type Action = (
  prev: SedeFormState,
  formData: FormData,
) => Promise<SedeFormState>;

export type SedeInitial = {
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  mapUrl: string | null;
  order: number;
};

export function SedeForm({
  action,
  initial,
  submitLabel = "Guardar",
}: {
  action: Action;
  initial?: SedeInitial;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<SedeFormState, FormData>(
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
        required
        defaultValue={initial?.name}
        error={state.errors?.name}
      />
      <FormField
        name="address"
        label="Dirección"
        defaultValue={initial?.address}
      />
      <FormField name="phone" label="Teléfono" defaultValue={initial?.phone} />
      <FormField name="email" label="Email" defaultValue={initial?.email} />
      <FormField
        name="mapUrl"
        label="URL del mapa"
        variant="url"
        placeholder="https://maps..."
        defaultValue={initial?.mapUrl}
      />
      <FormField
        name="order"
        label="Orden"
        variant="number"
        min={0}
        defaultValue={initial?.order ?? 0}
      />

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Link
          href="/admin/sedes"
          className="text-sm text-piedra hover:text-austral"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
