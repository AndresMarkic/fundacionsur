import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/blocks/Section";
import { str, type BlockProps } from "@/components/blocks/types";

type Cta = { label?: string; href?: string };

/** Panel ilustrado de marca cuando no hay imagen de misión. */
function BrandPanel() {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-austral"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_0%,rgba(74,171,184,0.3),transparent_55%),radial-gradient(80%_60%_at_100%_100%,rgba(196,149,106,0.18),transparent_60%)]" />
      {/* Cruz del Sur estilizada */}
      <span className="absolute left-[28%] top-[22%] text-2xl text-celeste/80">✦</span>
      <span className="absolute left-[52%] top-[34%] text-base text-on-austral/40">✦</span>
      <span className="absolute left-[38%] top-[50%] text-lg text-celeste/50">✦</span>
      <span className="absolute left-[60%] top-[58%] text-sm text-on-austral/30">✦</span>
      <span className="absolute left-[44%] top-[70%] text-xl text-celeste/40">✦</span>
      {/* Horizonte inferior */}
      <svg
        viewBox="0 0 400 80"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 block h-20 w-full text-on-austral/10"
      >
        <path
          d="M0 80 L0 40 C 100 16, 240 16, 320 34 C 360 42, 384 42, 400 32 L400 80 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

/** Bloque "Quiénes somos / Misión": texto + imagen + CTA "Conocé más". */
export function MisionBlock({ data }: BlockProps) {
  const title = str(data, "title", "Quiénes somos");
  const text = str(data, "text");
  const image = str(data, "image").trim();
  const cta = (data.cta ?? {}) as Cta;
  const ctaLabel = cta.label?.trim() || "Conocé más";
  const ctaHref = cta.href?.trim() || "/quienes-somos";

  return (
    <Section tone="light" id="mision">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-glaciar">
            <span aria-hidden="true" className="h-px w-8 bg-glaciar/50" />
            Nuestra esencia
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] text-austral sm:text-5xl">
            {title}
          </h2>
          {text && (
            <p className="mt-6 text-lg leading-relaxed text-austral/75">{text}</p>
          )}
          <div className="mt-9">
            <Button href={ctaHref} variant="outline">
              {ctaLabel}
            </Button>
          </div>
        </div>

        <div className="relative">
          {image ? (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-fondo">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          ) : (
            <BrandPanel />
          )}
        </div>
      </div>
    </Section>
  );
}

export default MisionBlock;
