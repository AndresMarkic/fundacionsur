"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FormField } from "@/components/admin/FormField";
import { UploadField } from "@/components/admin/UploadField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { InformeFormState } from "./actions";

type Action = (
  prev: InformeFormState,
  formData: FormData,
) => Promise<InformeFormState>;

export type InformeInitial = {
  title: string;
  description: string | null;
  coverImage: string | null;
  fileUrl: string;
  date: string;
};

export function InformeForm({
  action,
  initial,
  submitLabel = "Guardar",
}: {
  action: Action;
  initial?: InformeInitial;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<InformeFormState, FormData>(
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
        name="description"
        label="Descripción"
        variant="textarea"
        rows={3}
        defaultValue={initial?.description}
      />
      <FormField
        name="date"
        label="Fecha"
        variant="date"
        defaultValue={initial?.date}
      />
      <UploadField
        name="coverImage"
        label="Imagen de portada (opcional)"
        accept="image"
        defaultUrl={initial?.coverImage}
      />
      <UploadField
        name="fileUrl"
        label="Archivo PDF"
        accept="pdf"
        required
        defaultUrl={initial?.fileUrl}
      />
      {state.errors?.fileUrl ? (
        <p role="alert" className="text-xs text-red-600">
          {state.errors.fileUrl}
        </p>
      ) : null}

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Link
          href="/admin/informes"
          className="text-sm text-piedra hover:text-austral"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
