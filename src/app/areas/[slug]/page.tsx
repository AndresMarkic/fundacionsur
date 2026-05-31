import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAreaBySlug } from "@/lib/content";
import { Markdown } from "@/components/site/Markdown";
import { Section } from "@/components/blocks/Section";

// El menú/footer (root layout) leen de la base, por eso toda la app es
// dinámica. Las áreas se resuelven por slug en cada request; un slug
// inexistente cae en notFound().
export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = await getAreaBySlug(slug);

  if (!area) {
    return { title: "Área no encontrada", robots: { index: false } };
  }

  const url = `/areas/${area.slug}`;
  return {
    title: area.name,
    description: area.shortDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `${area.name} · Fundación Sur`,
      description: area.shortDescription,
      url,
    },
  };
}

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const area = await getAreaBySlug(slug);

  if (!area) notFound();

  const initial = area.name.trim().charAt(0).toUpperCase();
  const hasIcon = !!area.icon?.trim();

  return (
    <>
      <section className="relative overflow-hidden bg-austral text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_85%_-20%,rgba(74,171,184,0.22),transparent_55%),radial-gradient(80%_70%_at_-10%_120%,rgba(42,127,138,0.16),transparent_60%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute left-[14%] top-[30%] text-celeste/60">✦</span>
          <span className="absolute right-[20%] top-[26%] text-sm text-white/25">
            ✦
          </span>
          <span className="absolute right-[34%] bottom-[34%] text-xs text-celeste/30">
            ✦
          </span>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28">
          <Link
            href="/#areas"
            className="text-xs font-medium uppercase tracking-[0.22em] text-celeste transition-colors hover:text-white"
          >
            Nuestras áreas
          </Link>

          <div className="mt-7 flex items-start gap-5">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-sm">
              <span
                aria-hidden="true"
                className="absolute -right-1.5 -top-1.5 text-sm text-celeste"
              >
                ✦
              </span>
              {hasIcon ? (
                <span className="text-3xl leading-none">{area.icon}</span>
              ) : (
                <span className="font-display text-3xl font-semibold">
                  {initial}
                </span>
              )}
            </div>

            <h1 className="text-balance font-display text-4xl font-semibold leading-[1.06] sm:text-5xl lg:text-6xl">
              {area.name}
            </h1>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            {area.shortDescription}
          </p>
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

      <Section tone="light">
        {area.pageContent?.trim() ? (
          <div className="max-w-3xl">
            <Markdown>{area.pageContent}</Markdown>
          </div>
        ) : (
          <div className="max-w-2xl">
            <p className="text-lg leading-relaxed text-austral/70">
              Estamos preparando el contenido de esta área. Mientras tanto,
              escribinos para conocer cómo sumarte.
            </p>
            <Link
              href="/quienes-somos"
              className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-glaciar transition-colors hover:text-celeste"
            >
              Conocé la Fundación
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </Section>
    </>
  );
}
