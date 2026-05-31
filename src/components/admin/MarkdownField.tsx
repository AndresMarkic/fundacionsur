"use client";

import { useState } from "react";
import { Markdown } from "@/components/site/Markdown";

const textareaClasses =
  "w-full rounded-lg border border-piedra/30 bg-white px-3 py-2.5 font-mono text-sm text-austral outline-none transition-colors focus:border-glaciar focus:ring-2 focus:ring-glaciar/20";

/**
 * Editor de Markdown (cliente): textarea controlado + toggle "Vista previa"
 * que renderiza con el componente `Markdown` (mismo estilo que el sitio).
 */
export function MarkdownField({
  name,
  label,
  required = false,
  defaultValue,
  error,
  rows = 14,
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string | null;
  error?: string;
  rows?: number;
}) {
  const [value, setValue] = useState<string>(defaultValue ?? "");
  const [preview, setPreview] = useState(false);
  const id = `field-${name}`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-austral">
          {label}
          {required ? <span className="ml-0.5 text-red-600">*</span> : null}
        </label>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className="text-xs font-medium text-glaciar hover:text-celeste"
        >
          {preview ? "Editar" : "Vista previa"}
        </button>
      </div>

      {preview ? (
        <div className="min-h-[8rem] rounded-lg border border-piedra/30 bg-white px-4 py-3">
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <p className="text-sm text-piedra">Nada para previsualizar.</p>
          )}
        </div>
      ) : (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={rows}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={textareaClasses}
        />
      )}

      {/* Cuando está en preview, el textarea se desmonta; conservamos el valor
          en un hidden input para que el form siga enviándolo. */}
      {preview ? <input type="hidden" name={name} value={value} /> : null}

      {error ? (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
