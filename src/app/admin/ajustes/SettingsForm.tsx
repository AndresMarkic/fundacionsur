"use client";

import { useActionState } from "react";
import { FormField } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { updateSettings, type SettingsFormState } from "./actions";

export type SettingsInitial = {
  address: string;
  email: string;
  phone: string;
  social: Record<string, string>;
  footerText: string;
};

const SOCIAL_FIELDS: Array<{ key: string; label: string; placeholder: string }> = [
  { key: "x", label: "X (Twitter)", placeholder: "https://x.com/fundacionsur" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@fundacionsur" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/fundacionsur" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/fundacionsur" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/fundacionsur" },
];

export function SettingsForm({ initial }: { initial: SettingsInitial }) {
  const [state, formAction] = useActionState<SettingsFormState, FormData>(
    updateSettings,
    {},
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {state.message ? (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-lg px-3 py-2 text-sm ${
            state.ok
              ? "bg-glaciar/10 text-glaciar"
              : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <FormField
        name="address"
        label="Dirección"
        defaultValue={initial.address}
        placeholder="Av. Siempre Viva 123, CABA"
      />
      <FormField
        name="email"
        label="Email de contacto"
        defaultValue={initial.email}
        placeholder="contacto@fundacionsur.org"
      />
      <FormField
        name="phone"
        label="Teléfono"
        defaultValue={initial.phone}
        placeholder="+54 11 1234-5678"
      />

      <fieldset className="space-y-4 rounded-xl border border-piedra/15 p-4">
        <legend className="px-1 text-sm font-medium text-austral">
          Redes sociales
        </legend>
        <p className="text-xs text-piedra">
          URL completa (http:// o https://). Dejala vacía para no mostrar esa red.
        </p>
        {SOCIAL_FIELDS.map((f) => (
          <FormField
            key={f.key}
            name={`social.${f.key}`}
            label={f.label}
            variant="url"
            defaultValue={initial.social[f.key] ?? ""}
            placeholder={f.placeholder}
            error={state.errors?.[`social.${f.key}`]}
          />
        ))}
      </fieldset>

      <FormField
        name="footerText"
        label="Texto del pie de página"
        variant="textarea"
        rows={3}
        defaultValue={initial.footerText}
        hint="Texto breve que aparece en el footer del sitio."
      />

      <div className="pt-2">
        <SubmitButton>Guardar ajustes</SubmitButton>
      </div>
    </form>
  );
}
