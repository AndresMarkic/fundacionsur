"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FormField } from "@/components/admin/FormField";
import { UploadField } from "@/components/admin/UploadField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { PrensaFormState } from "./actions";

type Action = (
  prev: PrensaFormState,
  formData: FormData,
) => Promise<PrensaFormState>;

export type PrensaInitial = {
  title: string;
  mediaOutlet: string;
  date: string;
  externalUrl: string;
  thumbnail: string | null;
};

export function PrensaForm({
  action,
  initial,
  submitLabel = "Guardar",
}: {
  action: Action;
  initial?: PrensaInitial;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<PrensaFormState, FormData>(
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
        name="title"
        label="Título"
        required
        defaultValue={initial?.title}
        error={state.errors?.title}
      />
      <FormField
        name="mediaOutlet"
        label="Medio"
        required
        defaultValue={initial?.mediaOutlet}
        error={state.errors?.mediaOutlet}
      />
      <FormField
        name="date"
        label="Fecha"
        variant="date"
        defaultValue={initial?.date}
      />
      <FormField
        name="externalUrl"
        label="URL externa"
        variant="url"
        required
        placeholder="https://..."
        defaultValue={initial?.externalUrl}
        error={state.errors?.externalUrl}
      />
      <UploadField
        name="thumbnail"
        label="Miniatura (opcional)"
        accept="image"
        defaultUrl={initial?.thumbnail}
      />

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Link
          href="/admin/prensa"
          className="text-sm text-piedra hover:text-austral"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
