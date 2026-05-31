import type { Metadata } from "next";
import Image from "next/image";
import { getAllPrensa } from "@/lib/content";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/blocks/Section";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prensa",
  description:
    "Fundación Sur en los medios: recopilamos las coberturas y notas donde la fundación y sus representantes aparecen en la prensa de Santa Cruz y del país.",
  alternates: { canonical: "/prensa" },
  openGraph: {
    title: "Prensa · Fundación Sur",
    description:
      "Coberturas y notas sobre Fundación Sur en los medios de Santa Cruz y del país.",
    url: "/prensa",
    type: "website",
  },
};

export default async function PrensaPage() {
  const items = await getAllPrensa();

  return (
    <>
      <PageHero
        eyebrow="Repercusión"
        title="En los medios"
        intro="Coberturas y notas donde Fundación Sur y sus representantes aparecen en la prensa de Santa Cruz y del país."
      />

      <Section tone="light">
        {items.length === 0 ? (
          <p className="max-w-xl text-lg leading-relaxed text-austral/70">
            Todavía no cargamos recortes de prensa. Pronto vas a encontrar acá
            las repercusiones de nuestro trabajo.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <li key={p.id}>
                <PressCard
                  title={p.title}
                  mediaOutlet={p.mediaOutlet}
                  externalUrl={p.externalUrl}
                  thumbnail={p.thumbnail}
                  date={p.date}
                />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}

type PressCardProps = {
  title: string;
  mediaOutlet: string;
  externalUrl: string;
  thumbnail?: string | null;
  date: Date | string;
};

/** Tarjeta de recorte de prensa: miniatura (o sello de marca), medio, fecha y título → enlace externo. */
function PressCard({
  title,
  mediaOutlet,
  externalUrl,
  thumbnail,
  date,
}: PressCardProps) {
  const thumb = thumbnail?.trim();

  return (
    <a
      href={externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group/press flex h-full flex-col overflow-hidden rounded-2xl border border-piedra/20 bg-white shadow-[0_1px_2px_rgba(26,43,60,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-celeste/40 hover:shadow-[0_24px_50px_-28px_rgba(26,43,60,0.4)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-fondo">
        {thumb ? (
          <Image
            src={thumb}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover/press:scale-105"
          />
        ) : (
          <PressBrandThumb mediaOutlet={mediaOutlet} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.1em] text-glaciar">
          <span>{mediaOutlet}</span>
          <span aria-hidden="true" className="text-piedra/50">
            ·
          </span>
          <span className="text-piedra">{formatDate(date)}</span>
        </div>

        <h3 className="mt-3 flex-1 font-display text-xl leading-snug text-austral transition-colors group-hover/press:text-glaciar">
          {title}
        </h3>

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-glaciar">
          Leer la nota
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 group-hover/press:translate-x-1"
          >
            ↗
          </span>
        </span>
      </div>
    </a>
  );
}

/** Miniatura de marca cuando un recorte no trae imagen propia. */
function PressBrandThumb({ mediaOutlet }: { mediaOutlet: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-austral"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_-10%,rgba(74,171,184,0.28),transparent_55%)]" />
      <span className="absolute left-[16%] top-[24%] text-sm text-celeste/60">
        ✦
      </span>
      <span className="absolute right-[20%] bottom-[26%] text-on-austral/25">✦</span>
      <span className="relative font-display text-lg italic text-on-austral/85">
        {mediaOutlet}
      </span>
    </div>
  );
}
