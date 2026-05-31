import { getLatestPrensa } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { formatDate } from "@/lib/format";
import { num, str, type BlockProps } from "@/components/blocks/types";

/** Sección "En los medios": recortes de prensa externos (enlaces salientes). */
export async function PrensaBlock({ data }: BlockProps) {
  const title = str(data, "title", "En los medios");
  const limit = num(data, "limit", 4);
  const items = await getLatestPrensa(limit);

  if (items.length === 0) return null;

  return (
    <Section tone="dark">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow="Repercusión" title={title} onDark />
        <Button href="/prensa" variant="link" className="shrink-0 !text-celeste hover:!text-on-austral">
          Ver todo
        </Button>
      </div>

      <ul className="mt-12 divide-y divide-on-austral/10 border-y border-on-austral/10">
        {items.map((p) => (
          <li key={p.id}>
            <a
              href={p.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/press flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:gap-8"
            >
              <div className="flex shrink-0 items-center gap-3 text-xs font-medium uppercase tracking-[0.12em] text-celeste sm:w-64">
                <span>{p.mediaOutlet}</span>
                <span aria-hidden="true" className="text-on-austral/30">·</span>
                <span className="text-on-austral/45">{formatDate(p.date)}</span>
              </div>
              <p className="flex-1 font-display text-xl leading-snug text-on-austral/90 transition-colors group-hover/press:text-celeste">
                {p.title}
              </p>
              <span
                aria-hidden="true"
                className="hidden shrink-0 text-on-austral/40 transition-all duration-200 group-hover/press:translate-x-1 group-hover/press:text-celeste sm:inline"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export default PrensaBlock;
