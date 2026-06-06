"use client";

import { useActionState } from "react";

type Action = (
  prev: string | undefined,
  formData: FormData,
) => Promise<string | undefined>;

export function LoginForm({ action }: { action: Action }) {
  const [error, formAction, pending] = useActionState<
    string | undefined,
    FormData
  >(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-austral"
        >
          Usuario
        </label>
        <input
          id="email"
          name="email"
          type="text"
          autoComplete="username"
          placeholder="administrador"
          required
          autoFocus
          className="w-full rounded-lg border border-piedra/30 bg-white px-3 py-2.5 text-sm text-austral outline-none transition-colors focus:border-glaciar focus:ring-2 focus:ring-glaciar/20"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-austral"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-piedra/30 bg-white px-3 py-2.5 text-sm text-austral outline-none transition-colors focus:border-glaciar focus:ring-2 focus:ring-glaciar/20"
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-glaciar px-6 py-3 text-sm font-medium text-on-glaciar transition-all duration-200 hover:bg-austral hover:text-on-austral disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
