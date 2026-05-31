import { getInformes } from "@/lib/content";
import { ReportCard } from "@/components/site/ReportCard";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { str, type BlockProps } from "@/components/blocks/types";

/** Sección "Informes": intro + grilla de tarjetas descargables. */
export async function InformesBlock({ data }: BlockProps) {
  const title = str(data, "title", "Informes");
  const intro = str(data, "intro");
  const informes = await getInformes();

  if (informes.length === 0) return null;

  return (
    <Section tone="fondo">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow="Publicaciones" title={title} intro={intro} />
        <Button href="/informes" variant="link" className="shrink-0">
          Ver más
        </Button>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {informes.map((inf) => (
          <ReportCard
            key={inf.id}
            report={{
              title: inf.title,
              description: inf.description,
              coverImage: inf.coverImage,
              fileUrl: inf.fileUrl,
              date: inf.date,
            }}
          />
        ))}
      </div>
    </Section>
  );
}

export default InformesBlock;
