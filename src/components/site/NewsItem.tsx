import Link from "next/link";
import { formatDate } from "@/lib/format";

export type NewsItemData = {
  slug: string;
  title: string;
  date: Date | string;
  excerpt?: string | null;
};

/**
 * Ítem de noticia para feed vertical: fecha, título (link al detalle),
 * excerpt opcional y "Leer más →". Pensado como elemento de una lista.
 */
export function NewsItem({ item }: { item: NewsItemData }) {
  const href = `/noticias/${item.slug}`;
  return (
    <article className="group/news relative border-b border-piedra/20 py-7 first:pt-0 last:border-0">
      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.12em] text-piedra">
        <span aria-hidden="true" className="h-px w-6 bg-celeste/70" />
        <time dateTime={new Date(item.date).toISOString()}>
          {formatDate(item.date)}
        </time>
      </div>

      <h3 className="mt-3 font-display text-2xl leading-snug text-austral sm:text-[1.65rem]">
        <Link
          href={href}
          className="bg-[linear-gradient(var(--color-celeste),var(--color-celeste))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover/news:bg-[length:100%_2px]"
        >
          {item.title}
        </Link>
      </h3>

      {item.excerpt && (
        <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-austral/70">
          {item.excerpt}
        </p>
      )}

      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-glaciar transition-colors hover:text-celeste"
        aria-label={`Leer más sobre: ${item.title}`}
      >
        Leer más
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-200 group-hover/news:translate-x-1"
        >
          →
        </span>
      </Link>
    </article>
  );
}

export default NewsItem;
