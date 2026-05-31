import { Counter } from "@/components/site/Counter";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { str, type BlockProps } from "@/components/blocks/types";

type CounterItem = { label: string; value: number; suffix?: string };

function toItems(raw: unknown): CounterItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (i): i is CounterItem =>
        !!i &&
        typeof i === "object" &&
        typeof (i as CounterItem).label === "string" &&
        typeof (i as CounterItem).value === "number",
    )
    .map((i) => ({
      label: i.label,
      value: i.value,
      suffix: typeof i.suffix === "string" ? i.suffix : "",
    }));
}

/** Sección de contadores animados (0 → valor) sobre fondo claro. */
export function ContadoresBlock({ data }: BlockProps) {
  const title = str(data, "title", "Nuestro recorrido");
  const items = toItems(data.items);

  if (items.length === 0) return null;

  return (
    <Section tone="fondo">
      <SectionHeading eyebrow="En números" title={title} align="center" />

      <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
        {items.map((item, i) => (
          <Counter
            key={`${item.label}-${i}`}
            value={item.value}
            label={item.label}
            suffix={item.suffix}
          />
        ))}
      </div>
    </Section>
  );
}

export default ContadoresBlock;
