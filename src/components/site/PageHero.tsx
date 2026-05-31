import type { ReactNode } from "react";

/**
 * Encabezado de página interior: banda austral con motivos australes
 * (resplandor glaciar, Cruz del Sur, curva de horizonte), eco del hero de la
 * home. Da una entrada editorial coherente a noticias, prensa, áreas, etc.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Slot opcional para acciones (p. ej. un buscador o un botón). */
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-austral text-on-austral">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_85%_-20%,rgba(74,171,184,0.22),transparent_55%),radial-gradient(80%_70%_at_-10%_120%,rgba(42,127,138,0.16),transparent_60%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute left-[12%] top-[28%] text-celeste/60">✦</span>
        <span className="absolute right-[18%] top-[24%] text-sm text-on-austral/25">
          ✦
        </span>
        <span className="absolute right-[30%] bottom-[34%] text-celeste/30 text-xs">
          ✦
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28">
        {eyebrow && (
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-celeste">
            <span aria-hidden="true" className="h-px w-8 bg-celeste/60" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-5 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.06] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-austral/70">
            {intro}
          </p>
        )}
        {children && <div className="mt-9">{children}</div>}
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="relative block h-10 w-full text-white sm:h-14"
      >
        <path
          d="M0 80 L0 48 C 240 18, 520 18, 760 40 C 1000 62, 1220 62, 1440 36 L1440 80 Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}

export default PageHero;
