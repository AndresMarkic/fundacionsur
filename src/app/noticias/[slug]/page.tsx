import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNoticiaBySlug } from "@/lib/content";
import { Markdown } from "@/components/site/Markdown";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type Params = { slug: string };

/** Una noticia es servible públicamente solo si existe y está publicada. */
function isPublished(
  noticia: Awaited<ReturnType<typeof getNoticiaBySlug>>,
): noticia is NonNullable<typeof noticia> {
  return !!noticia && noticia.status === "published";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);

  if (!isPublished(noticia)) {
    return { title: "Noticia no encontrada", robots: { index: false } };
  }

  const description = noticia.excerpt?.trim() || undefined;
  const cover = noticia.coverImage?.trim();
  const url = `/noticias/${noticia.slug}`;

  return {
    title: noticia.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: noticia.title,
      description,
      url,
      publishedTime: new Date(noticia.date).toISOString(),
      ...(cover ? { images: [{ url: cover }] } : {}),
    },
    twitter: {
      card: cover ? "summary_large_image" : "summary",
      title: noticia.title,
      description,
    },
  };
}

export default async function NoticiaDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);

  if (!isPublished(noticia)) notFound();

  const cover = noticia.coverImage?.trim();

  return (
    <article className="bg-white pb-24">
      <header className="mx-auto max-w-3xl px-5 pt-16 sm:px-8 sm:pt-24">
        <Link
          href="/noticias"
          className="group/back inline-flex items-center gap-1.5 text-sm font-semibold text-glaciar transition-colors hover:text-celeste"
        >
          <span
            aria-hidden="true"
            className="inline-block transition-transform group-hover/back:-translate-x-1"
          >
            ←
          </span>
          Volver a noticias
        </Link>

        <div className="mt-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-piedra">
          <span aria-hidden="true" className="h-px w-8 bg-celeste/70" />
          <time dateTime={new Date(noticia.date).toISOString()}>
            {formatDate(noticia.date)}
          </time>
        </div>

        <h1 className="mt-4 text-balance font-display text-4xl leading-[1.08] text-austral sm:text-5xl">
          {noticia.title}
        </h1>

        {noticia.excerpt && (
          <p className="mt-6 text-xl leading-relaxed text-austral/65">
            {noticia.excerpt}
          </p>
        )}
      </header>

      {cover && (
        <div className="mx-auto mt-12 max-w-5xl px-5 sm:px-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-fondo">
            <Image
              src={cover}
              alt={noticia.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 64rem"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="mx-auto mt-12 max-w-3xl px-5 sm:px-8">
        <Markdown>{noticia.body}</Markdown>
      </div>
    </article>
  );
}
