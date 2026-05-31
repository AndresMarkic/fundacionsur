import type { ReactNode } from "react";

type Variant = "text" | "textarea" | "date" | "select" | "url" | "number";

export type SelectOption = { value: string; label: string };

const inputClasses =
  "w-full rounded-lg border border-piedra/30 bg-white px-3 py-2.5 text-sm text-austral outline-none transition-colors focus:border-glaciar focus:ring-2 focus:ring-glaciar/20";

/**
 * Campo de formulario genérico: label + control + error. Server Component
 * (uncontrolled, usa `defaultValue`). Variantes: text, textarea, date, select,
 * url, number. Para `select`, pasar `options`.
 */
export function FormField({
  name,
  label,
  variant = "text",
  required = false,
  defaultValue,
  placeholder,
  error,
  options,
  rows = 4,
  hint,
  min,
  children,
}: {
  name: string;
  label: string;
  variant?: Variant;
  required?: boolean;
  defaultValue?: string | number | null;
  placeholder?: string;
  error?: string;
  options?: SelectOption[];
  rows?: number;
  hint?: string;
  min?: number;
  children?: ReactNode;
}) {
  const id = `field-${name}`;
  const value = defaultValue ?? undefined;
  const valueStr = value === undefined ? undefined : String(value);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-austral">
        {label}
        {required ? <span className="ml-0.5 text-red-600">*</span> : null}
      </label>

      {variant === "textarea" ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={rows}
          defaultValue={valueStr}
          placeholder={placeholder}
          className={inputClasses}
        />
      ) : variant === "select" ? (
        <select
          id={id}
          name={name}
          required={required}
          defaultValue={valueStr}
          className={inputClasses}
        >
          {(options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          required={required}
          defaultValue={valueStr}
          placeholder={placeholder}
          min={variant === "number" ? min : undefined}
          type={
            variant === "date"
              ? "date"
              : variant === "url"
                ? "url"
                : variant === "number"
                  ? "number"
                  : "text"
          }
          className={inputClasses}
        />
      )}

      {children}

      {hint && !error ? (
        <p className="text-xs text-piedra">{hint}</p>
      ) : null}
      {error ? (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
