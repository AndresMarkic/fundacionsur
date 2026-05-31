import type { ReactNode } from "react";

type Tone = "light" | "fondo" | "dark";

const toneClasses: Record<Tone, string> = {
  light: "bg-white text-austral",
  fondo: "bg-fondo text-austral",
  dark: "bg-austral text-white",
};

/**
 * Contenedor de sección con ritmo vertical y ancho de contenido consistentes
 * para todos los bloques de la home.
 */
export function Section({
  children,
  tone = "light",
  className = "",
  id,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`${toneClasses[tone]} px-5 py-20 sm:px-8 lg:py-28 ${className}`}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

/**
 * Encabezado editorial de sección: eyebrow con línea, título display y
 * texto introductorio opcional. Sobrio y on-brand.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  onDark = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  onDark?: boolean;
}) {
  const centered = align === "center";
  return (
    <header className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p
          className={`flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] ${
            centered ? "justify-center" : ""
          } ${onDark ? "text-celeste" : "text-glaciar"}`}
        >
          <span
            aria-hidden="true"
            className={`h-px w-8 ${onDark ? "bg-celeste/60" : "bg-glaciar/50"}`}
          />
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-4 font-display text-4xl leading-[1.08] sm:text-5xl ${
          onDark ? "text-white" : "text-austral"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-5 text-lg leading-relaxed ${
            onDark ? "text-white/70" : "text-austral/70"
          }`}
        >
          {intro}
        </p>
      )}
    </header>
  );
}
