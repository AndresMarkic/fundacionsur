"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FormField } from "@/components/admin/FormField";
import { UploadField } from "@/components/admin/UploadField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { AutoridadFormState } from "./actions";

type Action = (
  prev: AutoridadFormState,
  formData: FormData,
) => Promise<AutoridadFormState>;

export type AutoridadInitial = {
  name: string;
  role: string;
  photo: string | null;
  bio: string | null;
  order: number;
};

export function AutoridadForm({
  action,
  initial,
  submitLabel = "Guardar",
}: {
  action: Action;
  initial?: AutoridadInitial;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<AutoridadFormState, FormData>(
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
        name="role"
        label="Rol / cargo"
        required
        defaultValue={initial?.role}
        error={state.errors?.role}
      />
      <UploadField
        name="photo"
        label="Foto (opcional)"
        accept="image"
        defaultUrl={initial?.photo}
      />
      <FormField
        name="bio"
        label="Biografía (opcional)"
        variant="textarea"
        rows={4}
        defaultValue={initial?.bio}
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
          href="/admin/autoridades"
          className="text-sm text-piedra hover:text-austral"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
