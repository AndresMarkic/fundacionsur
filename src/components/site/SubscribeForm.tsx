"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

/**
 * Formulario público de suscripción. Postea a `/api/suscribir` (sin recargar) y
 * muestra el estado vía `aria-live`. Incluye un honeypot oculto (`website`) que
 * los humanos dejan vacío; si un bot lo completa, el endpoint lo descarta.
 *
 * Estilado para vivir sobre la franja CTA (fondo glaciar, texto claro).
 */
export function SubscribeForm({ buttonLabel = "Suscribite" }: { buttonLabel?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/suscribir", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (res.ok && data.ok) {
        setStatus("success");
        setMessage("¡Gracias! Te suscribiste.");
        form.reset();
      } else {
        setStatus("error");
        setMessage(data.error || "No pudimos completar la suscripción. Probá de nuevo.");
      }
    } catch {
      setStatus("error");
      setMessage("Hubo un problema de conexión. Probá de nuevo.");
    }
  }

  const inputClasses =
    "w-full rounded-full border border-on-glaciar/30 bg-white/95 px-5 py-3 text-sm text-austral outline-none transition-colors placeholder:text-piedra focus:border-on-glaciar focus:ring-2 focus:ring-on-glaciar/40";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-3" noValidate>
      <div className="space-y-2">
        <label htmlFor="subscribe-name" className="sr-only">
          Nombre (opcional)
        </label>
        <input
          id="subscribe-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Tu nombre (opcional)"
          className={inputClasses}
        />

        <label htmlFor="subscribe-email" className="sr-only">
          Email
        </label>
        <input
          id="subscribe-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Tu email"
          className={inputClasses}
        />

        {/* Honeypot anti-spam: oculto a humanos y lectores de pantalla. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="subscribe-website">No completar este campo</label>
          <input
            id="subscribe-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-glaciar transition-all duration-200 hover:bg-austral hover:text-on-austral disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Enviando…" : buttonLabel}
      </button>

      <p
        aria-live="polite"
        role="status"
        className={`min-h-[1.25rem] text-sm ${
          status === "error" ? "text-red-100" : "text-on-glaciar"
        }`}
      >
        {message}
      </p>
    </form>
  );
}

export default SubscribeForm;
