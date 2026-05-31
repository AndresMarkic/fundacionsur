"use client";

import { useActionState, useState } from "react";
import { SubmitButton } from "@/components/admin/SubmitButton";
import {
  COLOR_LABELS,
  DEFAULT_COLORS,
  FONT_PAIR_LABELS,
  FONT_PAIRS,
  type ColorKey,
  type FontPair,
} from "@/lib/theme";
import { isHexColor } from "@/lib/color";
import { resetTheme, updateTheme, type ThemeFormState } from "./actions";

export type AparienciaInitial = {
  colors: Record<ColorKey, string>;
  fontPair: FontPair;
};

const COLOR_ORDER = Object.keys(DEFAULT_COLORS) as ColorKey[];

/** Input de color: <input type="color"> + input de texto del hex, sincronizados. */
function ColorField({
  name,
  label,
  defaultValue,
  error,
}: {
  name: ColorKey;
  label: string;
  defaultValue: string;
  error?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  // El <input type="color"> solo acepta #RRGGBB; si el texto es inválido,
  // dejamos el picker en su último valor válido (negro por defecto del navegador).
  const pickerValue = isHexColor(value) ? value : "#000000";

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={`color-${name}`}
        className="block text-sm font-medium text-austral"
      >
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          id={`color-${name}`}
          type="color"
          value={pickerValue}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          aria-label={`Selector de color para ${label}`}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-piedra/30 bg-white p-1"
        />
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="#1A2B3C"
          spellCheck={false}
          className="w-full rounded-lg border border-piedra/30 bg-white px-3 py-2.5 font-mono text-sm text-austral outline-none transition-colors focus:border-glaciar focus:ring-2 focus:ring-glaciar/20"
        />
      </div>
      {error ? (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function AparienciaForm({ initial }: { initial: AparienciaInitial }) {
  const [state, formAction] = useActionState<ThemeFormState, FormData>(
    updateTheme,
    {},
  );

  return (
    <div className="max-w-2xl space-y-6">
      {state.message ? (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-lg px-3 py-2 text-sm ${
            state.ok ? "bg-glaciar/10 text-glaciar" : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <form action={formAction} className="space-y-6">
        <fieldset className="space-y-4 rounded-xl border border-piedra/15 p-4">
          <legend className="px-1 text-sm font-medium text-austral">
            Colores de marca
          </legend>
          <p className="text-xs text-piedra">
            Formato hexadecimal (#RRGGBB). El color del texto sobre cada
            superficie se calcula solo para mantener buen contraste.
          </p>
          {COLOR_ORDER.map((key) => (
            <ColorField
              key={key}
              name={key}
              label={COLOR_LABELS[key]}
              defaultValue={initial.colors[key]}
              error={state.errors?.[key]}
            />
          ))}
        </fieldset>

        <div className="space-y-1.5">
          <label
            htmlFor="fontPair"
            className="block text-sm font-medium text-austral"
          >
            Combinación tipográfica
          </label>
          <select
            id="fontPair"
            name="fontPair"
            defaultValue={initial.fontPair}
            className="w-full rounded-lg border border-piedra/30 bg-white px-3 py-2.5 text-sm text-austral outline-none transition-colors focus:border-glaciar focus:ring-2 focus:ring-glaciar/20"
          >
            {FONT_PAIRS.map((fp) => (
              <option key={fp} value={fp}>
                {FONT_PAIR_LABELS[fp]}
              </option>
            ))}
          </select>
          {state.errors?.fontPair ? (
            <p role="alert" className="text-xs text-red-600">
              {state.errors.fontPair}
            </p>
          ) : null}
        </div>

        <div className="pt-2">
          <SubmitButton>Guardar apariencia</SubmitButton>
        </div>
      </form>

      <form
        action={resetTheme}
        className="border-t border-piedra/15 pt-5"
      >
        <p className="mb-3 text-xs text-piedra">
          Volvé a los colores y la tipografía originales de la marca.
        </p>
        <SubmitButton
          pendingLabel="Restableciendo…"
          className="inline-flex items-center justify-center rounded-full border border-austral/25 px-6 py-3 text-sm font-medium text-austral transition-all duration-200 hover:border-austral hover:bg-austral hover:text-on-austral disabled:cursor-not-allowed disabled:opacity-60"
        >
          Restablecer valores por defecto
        </SubmitButton>
      </form>
    </div>
  );
}
