"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/admin/FormField";
import { MarkdownField } from "@/components/admin/MarkdownField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { slugify } from "@/lib/slug";
import type { AreaFormState } from "./actions";

type Action = (
  prev: AreaFormState,
  formData: FormData,
) => Promise<AreaFormState>;

export type AreaInitial = {
  name: string;
  slug: string;
  icon: string | null;
  shortDescription: string;
  pageContent: string | null;
  order: number;
};

const inputClasses =
  "w-full rounded-lg border border-piedra/30 bg-white px-3 py-2.5 text-sm text-austral outline-none transition-colors focus:border-glaciar focus:ring-2 focus:ring-glaciar/20";

export function AreaForm({
  action,
  initial,
  submitLabel = "Guardar",
}: {
  action: Action;
  initial?: AreaInitial;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<AreaFormState, FormData>(
    action,
    {},
  );
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);

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

      <div className="space-y-1.5">
        <label
          htmlFor="field-name"
          className="block text-sm font-medium text-austral"
        >
          Nombre<span className="ml-0.5 text-red-600">*</span>
        </label>
        <input
          id="field-name"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className={inputClasses}
        />
        {state.errors?.name ? (
          <p role="alert" className="text-xs text-red-600">
            {state.errors.name}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="field-slug"
          className="block text-sm font-medium text-austral"
        >
          Slug
        </label>
        <input
          id="field-slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          placeholder="se-genera-del-nombre"
          className={inputClasses}
        />
        <p className="text-xs text-piedra">
          Se autocompleta desde el nombre. Si ya existe, se agrega un sufijo.
        </p>
      </div>

      <FormField
        name="icon"
        label="Icono (texto/emoji o URL, opcional)"
        defaultValue={initial?.icon}
      />
      <FormField
        name="shortDescription"
        label="Descripción corta"
        variant="textarea"
        rows={3}
        required
        defaultValue={initial?.shortDescription}
        error={state.errors?.shortDescription}
      />
      <MarkdownField
        name="pageContent"
        label="Contenido de la página"
        defaultValue={initial?.pageContent}
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
          href="/admin/areas"
          className="text-sm text-piedra hover:text-austral"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
