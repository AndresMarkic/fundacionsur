import type { Metadata } from "next";
import { getInformes } from "@/lib/content";
import { ReportCard } from "@/components/site/ReportCard";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/blocks/Section";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Informes",
  description:
    "Documentos, relevamientos y publicaciones de Fundación Sur Santa Cruz: informes de impacto y diagnósticos del desarrollo social en la Patagonia austral.",
  alternates: { canonical: "/informes" },
  openGraph: {
    title: "Informes · Fundación Sur",
    description:
      "Documentos y publicaciones descargables de Fundación Sur Santa Cruz.",
    url: "/informes",
    type: "website",
  },
};

export default async function InformesPage() {
  const informes = await getInformes();

  return (
    <>
      <PageHero
        eyebrow="Publicaciones"
        title="Informes y documentos"
        intro="Relevamientos, informes de impacto y publicaciones que dan cuenta del trabajo de Fundación Sur en el territorio austral."
      />

      <Section tone="light">
        {informes.length === 0 ? (
          <p className="max-w-xl text-lg leading-relaxed text-austral/70">
            Todavía no hay informes publicados. Estamos preparando nuestras
            próximas publicaciones.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        )}
      </Section>
    </>
  );
}
