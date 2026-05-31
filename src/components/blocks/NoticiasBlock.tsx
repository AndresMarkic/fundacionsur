import { getLatestNoticias } from "@/lib/content";
import { NewsItem } from "@/components/site/NewsItem";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { num, str, type BlockProps } from "@/components/blocks/types";

/** Sección "Últimas noticias": feed de notas internas publicadas. */
export async function NoticiasBlock({ data }: BlockProps) {
  const limit = num(data, "limit", 6);
  const title = str(data, "title", "Últimas noticias");
  const noticias = await getLatestNoticias(limit);

  if (noticias.length === 0) return null;

  return (
    <Section tone="light">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow="Novedades" title={title} />
        <Button href="/noticias" variant="link" className="shrink-0">
          Ver todas
        </Button>
      </div>

      <div className="mt-12 grid gap-x-12 md:grid-cols-2">
        {noticias.map((n) => (
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
    </Section>
  );
}

export default NoticiasBlock;
