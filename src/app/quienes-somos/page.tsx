import type { Metadata } from "next";
import Image from "next/image";
import {
  getAutoridades,
  getHomeBlocks,
  getSedes,
} from "@/lib/content";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { str } from "@/components/blocks/types";

export const dynamic = "force-dynamic";

const MISION_FALLBACK =
  "Fundación Sur Santa Cruz es una organización sin fines de lucro con sede en la Patagonia argentina, comprometida con el desarrollo social, la identidad del territorio austral y el trabajo junto a las comunidades del sur.";

/** Valores de marca (§4 del spec). Constantes: se renderizan siempre. */
const VALORES: Array<{ name: string; description: string; mark: string }> = [
  {
    name: "Compromiso",
    description: "Con el desarrollo social de Santa Cruz",
    mark: "✦",
  },
  {
    name: "Territorio",
    description: "Identidad patagónica auténtica",
    mark: "✦",
  },
  {
    name: "Transparencia",
    description: "Gestión honesta y abierta",
    mark: "✦",
  },
  {
    name: "Comunidad",
    description: "Trabajo colectivo y participativo",
    mark: "✦",
  },
];

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Conocé a Fundación Sur Santa Cruz: nuestra misión, nuestros valores, las autoridades de la fundación y nuestras sedes en la Patagonia austral.",
  alternates: { canonical: "/quienes-somos" },
  openGraph: {
    title: "Quiénes somos · Fundación Sur",
    description:
      "Misión, valores, autoridades y sedes de Fundación Sur Santa Cruz.",
    url: "/quienes-somos",
    type: "website",
  },
};

export default async function QuienesSomosPage() {
  const [blocks, autoridades, sedes] = await Promise.all([
    getHomeBlocks(),
    getAutoridades(),
    getSedes(),
  ]);

  // La misión es editable desde el bloque "mision" de la home; si no hay
  // texto cargado usamos el copy institucional por defecto.
  const misionBlock = blocks.find((b) => b.type === "mision");
  const mision =
    (misionBlock ? str(misionBlock.data, "text").trim() : "") ||
    MISION_FALLBACK;

  return (
    <>
      <PageHero
        eyebrow="Patagonia austral · Santa Cruz"
        title="Quiénes somos"
        intro="Una organización sin fines de lucro que trabaja desde el sur, junto a las comunidades de Santa Cruz."
      />

      {/* --- Misión --- */}
      <Section tone="light" id="mision">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading eyebrow="Nuestra esencia" title="Misión" />
          <p className="font-display text-2xl leading-[1.5] text-austral/85 sm:text-[1.75rem]">
            {mision}
          </p>
        </div>
      </Section>

      {/* --- Valores --- */}
      <Section tone="fondo" id="valores">
        <SectionHeading
          eyebrow="Lo que nos guía"
          title="Nuestros valores"
          align="center"
        />
        <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALORES.map((v) => (
            <li
              key={v.name}
              className="group/value relative flex h-full flex-col rounded-2xl border border-piedra/20 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-celeste/40 hover:shadow-[0_24px_50px_-30px_rgba(26,43,60,0.45)]"
            >
              <span
                aria-hidden="true"
                className="text-2xl text-celeste transition-colors duration-300 group-hover/value:text-glaciar"
              >
                {v.mark}
              </span>
              <h3 className="mt-4 font-display text-2xl leading-tight text-austral">
                {v.name}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-austral/65">
                {v.description}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* --- Autoridades --- */}
      {autoridades.length > 0 && (
        <Section tone="light" id="autoridades">
          <SectionHeading eyebrow="Equipo" title="Autoridades" />
          <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {autoridades.map((a) => {
              const photo = a.photo?.trim();
              const initial = a.name.trim().charAt(0).toUpperCase();
              return (
                <li key={a.id} className="flex flex-col">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-fondo">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={a.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="relative flex h-full w-full items-center justify-center bg-austral"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_-10%,rgba(74,171,184,0.3),transparent_55%)]" />
                        <span className="absolute right-[18%] top-[16%] text-celeste/50">
                          ✦
                        </span>
                        <span className="font-display text-6xl font-semibold text-on-austral/85">
                          {initial}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-xl leading-snug text-austral">
                    {a.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-glaciar">
                    {a.role}
                  </p>
                  {a.bio?.trim() && (
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-austral/65">
                      {a.bio}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {/* --- Sedes --- */}
      {sedes.length > 0 && (
        <Section tone="dark" id="sedes">
          <SectionHeading eyebrow="Dónde estamos" title="Sedes" onDark />
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sedes.map((s) => (
              <li
                key={s.id}
                className="rounded-2xl border border-on-austral/12 bg-on-austral/[0.04] p-7"
              >
                <h3 className="font-display text-2xl leading-tight text-on-austral">
                  {s.name}
                </h3>
                <dl className="mt-4 space-y-2 text-sm leading-relaxed text-on-austral/70">
                  {s.address?.trim() && (
                    <div className="flex gap-2.5">
                      <dt className="shrink-0 text-celeste">Dirección</dt>
                      <dd>{s.address}</dd>
                    </div>
                  )}
                  {s.phone?.trim() && (
                    <div className="flex gap-2.5">
                      <dt className="shrink-0 text-celeste">Teléfono</dt>
                      <dd>
                        <a
                          href={`tel:${s.phone.replace(/\s+/g, "")}`}
                          className="transition-colors hover:text-celeste"
                        >
                          {s.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {s.email?.trim() && (
                    <div className="flex gap-2.5">
                      <dt className="shrink-0 text-celeste">Email</dt>
                      <dd>
                        <a
                          href={`mailto:${s.email}`}
                          className="break-all transition-colors hover:text-celeste"
                        >
                          {s.email}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
                {s.mapUrl?.trim() && (
                  <a
                    href={s.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-celeste transition-colors hover:text-on-austral"
                  >
                    Ver en el mapa
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
