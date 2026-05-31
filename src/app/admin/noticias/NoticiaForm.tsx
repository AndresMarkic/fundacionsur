"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/admin/FormField";
import { UploadField } from "@/components/admin/UploadField";
import { MarkdownField } from "@/components/admin/MarkdownField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { slugify } from "@/lib/slug";
import type { NoticiaFormState } from "./actions";

type Action = (
  prev: NoticiaFormState,
  formData: FormData,
) => Promise<NoticiaFormState>;

export type NoticiaInitial = {
  title: string;
  slug: string;
  date: string;
  coverImage: string | null;
  excerpt: string | null;
  body: string;
  status: string;
};

const inputClasses =
  "w-full rounded-lg border border-piedra/30 bg-white px-3 py-2.5 text-sm text-austral outline-none transition-colors focus:border-glaciar focus:ring-2 focus:ring-glaciar/20";

export function NoticiaForm({
  action,
  initial,
  submitLabel = "Guardar",
}: {
  action: Action;
  initial?: NoticiaInitial;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<NoticiaFormState, FormData>(
    action,
    {},
  );
  const [title, setTitle] = useState(initial?.title ?? "");
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
          htmlFor="field-title"
          className="block text-sm font-medium text-austral"
        >
          Título<span className="ml-0.5 text-red-600">*</span>
        </label>
        <input
          id="field-title"
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className={inputClasses}
        />
        {state.errors?.title ? (
          <p role="alert" className="text-xs text-red-600">
            {state.errors.title}
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
          placeholder="se-genera-del-titulo"
          className={inputClasses}
        />
        <p className="text-xs text-piedra">
          Se autocompleta desde el título. Si ya existe, se agrega un sufijo.
        </p>
      </div>

      <FormField
        name="date"
        label="Fecha"
        variant="date"
        defaultValue={initial?.date}
      />

      <UploadField
        name="coverImage"
        label="Imagen de portada"
        accept="image"
        defaultUrl={initial?.coverImage}
      />

      <FormField
        name="excerpt"
        label="Bajada / extracto"
        variant="textarea"
        rows={3}
        defaultValue={initial?.excerpt}
      />

      <MarkdownField
        name="body"
        label="Cuerpo"
        required
        defaultValue={initial?.body}
        error={state.errors?.body}
      />

      <FormField
        name="status"
        label="Estado"
        variant="select"
        defaultValue={initial?.status ?? "draft"}
        options={[
          { value: "draft", label: "Borrador" },
          { value: "published", label: "Publicada" },
        ]}
      />

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Link
          href="/admin/noticias"
          className="text-sm text-piedra hover:text-austral"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
