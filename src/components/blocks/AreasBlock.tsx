import { getAreas } from "@/lib/content";
import { AreaCard } from "@/components/site/AreaCard";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { str, type BlockProps } from "@/components/blocks/types";

/**
 * Sección "Nuestras áreas". Usa flex-wrap centrado para que, con 5 áreas,
 * la última fila (2 tarjetas) quede prolija y centrada bajo las 3 de arriba.
 */
export async function AreasBlock({ data }: BlockProps) {
  const title = str(data, "title", "Nuestras áreas");
  const intro = str(data, "intro");
  const areas = await getAreas();

  if (areas.length === 0) return null;

  return (
    <Section tone="light">
      <SectionHeading
        eyebrow="Lo que hacemos"
        title={title}
        intro={intro}
        align="center"
      />

      <div className="mt-14 flex flex-wrap justify-center gap-6">
        {areas.map((a) => (
          <div
            key={a.id}
            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <AreaCard
              area={{
                slug: a.slug,
                name: a.name,
                icon: a.icon,
                shortDescription: a.shortDescription,
              }}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}

export default AreasBlock;
