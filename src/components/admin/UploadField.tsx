"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Accept = "image" | "pdf";

/**
 * Campo de subida (cliente). Sube el archivo a `POST /api/upload` y guarda la
 * URL devuelta en un hidden input con el `name` dado, para que el form la
 * envíe a la server action. Muestra preview (imagen) o nombre (pdf), estado de
 * carga y errores, y permite limpiar la selección.
 *
 * `accept="image"` → `image/*`; `accept="pdf"` → `application/pdf`.
 */
export function UploadField({
  name,
  label,
  accept = "image",
  required = false,
  defaultUrl,
}: {
  name: string;
  label: string;
  accept?: Accept;
  required?: boolean;
  defaultUrl?: string | null;
}) {
  const [url, setUrl] = useState<string>(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const acceptAttr = accept === "pdf" ? "application/pdf" : "image/*";
  const isImage = accept === "image";

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !json.url) {
        setError(json.error ?? "No se pudo subir el archivo.");
        return;
      }
      setUrl(json.url);
    } catch {
      setError("Error de red al subir el archivo.");
    } finally {
      setUploading(false);
    }
  }

  function clear() {
    setUrl("");
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const fileName = url ? url.split("/").pop() : "";

  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-medium text-austral">
        {label}
        {required ? <span className="ml-0.5 text-red-600">*</span> : null}
      </span>

      {/* La URL persistida va al form vía hidden input. */}
      <input type="hidden" name={name} value={url} />

      <div className="rounded-lg border border-piedra/30 bg-white p-3">
        {url ? (
          <div className="flex items-center gap-3">
            {isImage ? (
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-fondo">
                <Image
                  src={url}
                  alt="Vista previa"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
            ) : (
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded bg-fondo text-xs font-semibold text-glaciar">
                PDF
              </span>
            )}
            <div className="min-w-0 flex-1">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-sm text-glaciar underline"
              >
                {fileName}
              </a>
              <button
                type="button"
                onClick={clear}
                className="mt-1 text-xs font-medium text-red-600 hover:text-red-800"
              >
                Quitar
              </button>
            </div>
          </div>
        ) : (
          <input
            ref={fileRef}
            type="file"
            accept={acceptAttr}
            onChange={handleChange}
            disabled={uploading}
            className="block w-full text-sm text-austral file:mr-3 file:rounded-full file:border-0 file:bg-glaciar file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-austral disabled:opacity-60"
          />
        )}
      </div>

      {uploading ? (
        <p className="text-xs text-piedra">Subiendo…</p>
      ) : null}
      {error ? (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
