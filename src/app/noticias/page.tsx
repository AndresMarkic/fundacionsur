import type { Metadata } from "next";
import Link from "next/link";
import { getAllNoticias } from "@/lib/content";
import { NewsItem } from "@/components/site/NewsItem";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/blocks/Section";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Novedades, actividades y anuncios de Fundación Sur Santa Cruz: el trabajo de la fundación junto a las comunidades de la Patagonia austral.",
  alternates: { canonical: "/noticias" },
  openGraph: {
    title: "Noticias · Fundación Sur",
    description:
      "Novedades y actividades de Fundación Sur Santa Cruz en la Patagonia austral.",
    url: "/noticias",
    type: "website",
  },
};

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const requested = Number.parseInt(page ?? "1", 10);
  const { items, page: current, totalPages, total } = await getAllNoticias(
    Number.isNaN(requested) ? 1 : requested,
    PAGE_SIZE,
  );

  return (
    <>
      <PageHero
        eyebrow="Novedades"
        title="Noticias del sur"
        intro="Lo que pasa en Fundación Sur: actividades, programas y anuncios del trabajo junto a las comunidades de Santa Cruz."
      />

      <Section tone="light">
        {items.length === 0 ? (
          <p className="max-w-xl text-lg leading-relaxed text-austral/70">
            Todavía no hay noticias publicadas. Volvé pronto: estamos
            trabajando en el territorio.
          </p>
        ) : (
          <>
            <div className="grid gap-x-14 md:grid-cols-2">
              {items.map((n) => (
                <NewsItem
                  key={n.id}
                  item={{
                    slug: n.slug,
                    title: n.title,
                    date: n.date,
                    excerpt: n.excerpt,
                  }}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination current={current} totalPages={totalPages} />
            )}

            <p className="mt-12 text-xs font-medium uppercase tracking-[0.12em] text-piedra">
              {total} {total === 1 ? "noticia" : "noticias"} publicadas
            </p>
          </>
        )}
      </Section>
    </>
  );
}

/** Navegación de páginas: Anterior / indicador / Siguiente (links GET). */
function Pagination({
  current,
  totalPages,
}: {
  current: number;
  totalPages: number;
}) {
  const linkBase =
    "inline-flex items-center gap-2 rounded-full border border-austral/20 px-5 py-2.5 text-sm font-semibold text-austral transition-all hover:border-austral hover:bg-austral hover:text-on-austral";
  const disabled =
    "pointer-events-none cursor-default border-piedra/20 text-piedra/50";

  return (
    <nav
      className="mt-14 flex items-center justify-between border-t border-piedra/20 pt-8"
      aria-label="Paginación de noticias"
    >
      {current > 1 ? (
        <Link href={`/noticias?page=${current - 1}`} className={linkBase}>
          <span aria-hidden="true">←</span> Anteriores
        </Link>
      ) : (
        <span className={`${linkBase} ${disabled}`}>
          <span aria-hidden="true">←</span> Anteriores
        </span>
      )}

      <span className="text-sm font-medium text-piedra">
        Página {current} de {totalPages}
      </span>

      {current < totalPages ? (
        <Link href={`/noticias?page=${current + 1}`} className={linkBase}>
          Siguientes <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span className={`${linkBase} ${disabled}`}>
          Siguientes <span aria-hidden="true">→</span>
        </span>
      )}
    </nav>
  );
}
