import Link from "next/link";

export type AreaData = {
  slug: string;
  name: string;
  icon?: string | null;
  shortDescription: string;
};

/**
 * Tarjeta de área/programa. Marca con la inicial sobre un sello austral
 * (o el ícono si existe), título enlazado al detalle y descripción corta.
 */
/** Áreas con página propia dedicada (en vez de la genérica /areas/[slug]). */
const SPECIAL_AREA_HREFS: Record<string, string> = { prensa: "/prensa" };

export function AreaCard({ area }: { area: AreaData }) {
  const href = SPECIAL_AREA_HREFS[area.slug] ?? `/areas/${area.slug}`;
  const initial = area.name.trim().charAt(0).toUpperCase();
  const hasIcon = !!area.icon?.trim();

  return (
    <article className="group/area relative flex h-full flex-col overflow-hidden rounded-2xl border border-piedra/20 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-celeste/40 hover:shadow-[0_24px_50px_-30px_rgba(26,43,60,0.45)]">
      {/* Sello: ícono o inicial con eco de la Cruz del Sur */}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-austral text-on-austral transition-colors duration-300 group-hover/area:bg-glaciar">
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 text-xs text-celeste"
        >
          ✦
        </span>
        {hasIcon ? (
          <span className="text-2xl leading-none">{area.icon}</span>
        ) : (
          <span className="font-display text-2xl font-semibold">{initial}</span>
        )}
      </div>

      <h3 className="mt-6 font-display text-2xl leading-tight text-austral">
        <Link
          href={href}
          className="transition-colors after:absolute after:inset-0 hover:text-glaciar"
        >
          {area.name}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-austral/65">
        {area.shortDescription}
      </p>

      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-glaciar">
        Conocer más
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-200 group-hover/area:translate-x-1"
        >
          →
        </span>
      </span>
    </article>
  );
}

export default AreaCard;
