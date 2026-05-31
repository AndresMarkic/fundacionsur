import type { Metadata } from "next";
import { searchNoticias } from "@/lib/content";
import { NewsItem } from "@/components/site/NewsItem";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/blocks/Section";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Buscá noticias y novedades de Fundación Sur Santa Cruz.",
  // Las páginas de resultados no aportan valor al índice.
  robots: { index: false, follow: true },
};

/** Formulario de búsqueda (GET → /buscar). */
function SearchForm({ q }: { q: string }) {
  return (
    <form action="/buscar" method="get" role="search" className="w-full max-w-xl">
      <label htmlFor="q" className="sr-only">
        Buscar noticias
      </label>
      <div className="flex items-stretch gap-2 rounded-full border border-on-austral/20 bg-on-austral/[0.06] p-1.5 backdrop-blur-sm focus-within:border-celeste/70">
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Buscá una noticia…"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-4 text-base text-on-austral placeholder:text-on-austral/45 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-celeste px-6 py-2.5 text-sm font-semibold text-on-celeste transition-colors hover:bg-white"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = (rawQ ?? "").trim();
  const hasQuery = q.length > 0;
  const results = hasQuery ? await searchNoticias(q) : [];

  return (
    <>
      <PageHero
        eyebrow="Buscador"
        title="Buscar en Fundación Sur"
        intro="Encontrá noticias y novedades por palabra clave."
      >
        <SearchForm q={q} />
      </PageHero>

      <Section tone="light">
        {!hasQuery ? (
          <p className="max-w-xl text-lg leading-relaxed text-austral/70">
            Escribí un término en el buscador para encontrar noticias: por
            ejemplo, <em className="text-austral">voluntariado</em>,{" "}
            <em className="text-austral">Campus Sur</em> o{" "}
            <em className="text-austral">territorio</em>.
          </p>
        ) : results.length === 0 ? (
          <div className="max-w-xl">
            <p className="text-lg leading-relaxed text-austral/75">
              No encontramos noticias para{" "}
              <span className="font-semibold text-austral">“{q}”</span>.
            </p>
            <p className="mt-3 text-austral/60">
              Probá con otra palabra o revisá la ortografía.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-piedra">
              {results.length}{" "}
              {results.length === 1 ? "resultado" : "resultados"} para “{q}”
            </p>
            <div className="mt-10 grid gap-x-14 md:grid-cols-2">
              {results.map((n) => (
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
          </>
        )}
      </Section>
    </>
  );
}
