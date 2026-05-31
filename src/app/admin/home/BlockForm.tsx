"use client";

import { useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/admin/FormField";
import { UploadField } from "@/components/admin/UploadField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { blockLabel } from "@/lib/blocks";

type Data = Record<string, unknown>;

const s = (d: Data, k: string, fallback = ""): string => {
  const v = d[k];
  return typeof v === "string" ? v : fallback;
};
const n = (d: Data, k: string, fallback: number): number => {
  const v = d[k];
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
};

type CounterRow = { label: string; value: string; suffix: string };

/** Editor de contenido por tipo de bloque. Serializa al hidden via `name`. */
export function BlockForm({
  type,
  data,
  action,
}: {
  type: string;
  data: Data;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-5">
      <Fields type={type} data={data} />
      <div className="flex items-center gap-3 pt-2">
        <SubmitButton>Guardar cambios</SubmitButton>
        <Link
          href="/admin/home"
          className="text-sm text-piedra hover:text-austral"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function Fields({ type, data }: { type: string; data: Data }) {
  switch (type) {
    case "hero":
      return (
        <>
          <UploadField
            name="image"
            label="Imagen de portada"
            accept="image"
            defaultUrl={s(data, "image")}
          />
          <FormField name="title" label="Título" defaultValue={s(data, "title")} />
          <FormField
            name="subtitle"
            label="Subtítulo"
            variant="textarea"
            rows={2}
            defaultValue={s(data, "subtitle")}
          />
          <FormField
            name="link"
            label="Enlace del hero"
            defaultValue={s(data, "link", "/")}
            hint="A dónde lleva al hacer clic en la imagen."
          />
        </>
      );
    case "noticias":
    case "prensa":
      return (
        <>
          <FormField name="title" label="Título" defaultValue={s(data, "title")} />
          <FormField
            name="limit"
            label="Cantidad a mostrar"
            variant="number"
            min={1}
            defaultValue={n(data, "limit", type === "prensa" ? 4 : 6)}
          />
        </>
      );
    case "informes":
      return (
        <>
          <FormField name="title" label="Título" defaultValue={s(data, "title")} />
          <FormField
            name="intro"
            label="Introducción"
            variant="textarea"
            rows={3}
            defaultValue={s(data, "intro")}
          />
        </>
      );
    case "areas":
      return (
        <>
          <FormField name="title" label="Título" defaultValue={s(data, "title")} />
          <FormField
            name="intro"
            label="Introducción"
            variant="textarea"
            rows={3}
            defaultValue={s(data, "intro")}
          />
        </>
      );
    case "banner":
      return (
        <>
          <UploadField
            name="image"
            label="Imagen (escritorio)"
            accept="image"
            defaultUrl={s(data, "image")}
          />
          <UploadField
            name="imageMobile"
            label="Imagen (móvil, opcional)"
            accept="image"
            defaultUrl={s(data, "imageMobile")}
          />
          <FormField name="link" label="Enlace" defaultValue={s(data, "link")} />
          <FormField
            name="alt"
            label="Texto alternativo (alt)"
            defaultValue={s(data, "alt")}
          />
          <FormField
            name="buttonLabel"
            label="Texto del botón (opcional)"
            defaultValue={s(data, "buttonLabel")}
            hint="Si lo completás y hay enlace, se muestra un botón sobre el banner."
          />
        </>
      );
    case "mision": {
      const cta = (data.cta ?? {}) as Data;
      return (
        <>
          <FormField name="title" label="Título" defaultValue={s(data, "title")} />
          <FormField
            name="text"
            label="Texto"
            variant="textarea"
            rows={5}
            defaultValue={s(data, "text")}
          />
          <UploadField
            name="image"
            label="Imagen"
            accept="image"
            defaultUrl={s(data, "image")}
          />
          <FormField
            name="ctaLabel"
            label="Texto del botón"
            defaultValue={s(cta, "label", "Conocé más")}
          />
          <FormField
            name="ctaHref"
            label="Enlace del botón"
            defaultValue={s(cta, "href", "/quienes-somos")}
          />
        </>
      );
    }
    case "contadores":
      return <ContadoresFields data={data} />;
    case "cta":
      return (
        <>
          <FormField name="title" label="Título" defaultValue={s(data, "title")} />
          <FormField
            name="text"
            label="Texto"
            variant="textarea"
            rows={3}
            defaultValue={s(data, "text")}
          />
          <FormField
            name="buttonLabel"
            label="Texto del botón"
            defaultValue={s(data, "buttonLabel")}
          />
          <FormField
            name="href"
            label="Enlace del botón"
            defaultValue={s(data, "href", "/#suscribite")}
            hint="A dónde lleva el botón (p. ej. /#suscribite)."
          />
        </>
      );
    default:
      return (
        <p className="rounded-lg bg-fondo px-3 py-2 text-sm text-piedra">
          Este tipo de bloque ({blockLabel(type)}) no tiene campos editables.
        </p>
      );
  }
}

const inputClasses =
  "w-full rounded-lg border border-piedra/30 bg-white px-3 py-2.5 text-sm text-austral outline-none transition-colors focus:border-glaciar focus:ring-2 focus:ring-glaciar/20";

function ContadoresFields({ data }: { data: Data }) {
  const initial: CounterRow[] = Array.isArray(data.items)
    ? (data.items as Data[]).map((it) => ({
        label: typeof it.label === "string" ? it.label : "",
        value:
          typeof it.value === "number" ? String(it.value) : String(it.value ?? ""),
        suffix: typeof it.suffix === "string" ? it.suffix : "",
      }))
    : [];
  const [rows, setRows] = useState<CounterRow[]>(
    initial.length ? initial : [{ label: "", value: "", suffix: "" }],
  );

  const update = (i: number, key: keyof CounterRow, val: string) =>
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)),
    );
  const addRow = () =>
    setRows((prev) => [...prev, { label: "", value: "", suffix: "" }]);
  const removeRow = (i: number) =>
    setRows((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <>
      <FormField name="title" label="Título" defaultValue={s(data, "title")} />

      <div className="space-y-3">
        <span className="block text-sm font-medium text-austral">
          Contadores
        </span>
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_5rem_5rem_auto] items-center gap-2 rounded-lg border border-piedra/20 bg-fondo/40 p-2"
          >
            <input
              name="counterLabel"
              value={row.label}
              onChange={(e) => update(i, "label", e.target.value)}
              placeholder="Etiqueta (p. ej. Voluntarios)"
              className={inputClasses}
            />
            <input
              name="counterValue"
              type="number"
              value={row.value}
              onChange={(e) => update(i, "value", e.target.value)}
              placeholder="Valor"
              className={inputClasses}
            />
            <input
              name="counterSuffix"
              value={row.suffix}
              onChange={(e) => update(i, "suffix", e.target.value)}
              placeholder="Sufijo (+)"
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              aria-label="Quitar fila"
              className="rounded-md px-2 py-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Quitar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addRow}
          className="text-sm font-medium text-glaciar hover:text-celeste"
        >
          + Agregar contador
        </button>
        <p className="text-xs text-piedra">
          Las filas sin etiqueta se descartan al guardar.
        </p>
      </div>
    </>
  );
}
