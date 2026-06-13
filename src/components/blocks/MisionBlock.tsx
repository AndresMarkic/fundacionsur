import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/blocks/Section";
import { getAutoridades } from "@/lib/content";
import { str, type BlockProps } from "@/components/blocks/types";

type Cta = { label?: string; href?: string };

type Autoridad = {
  id: string;
  name: string;
  role: string;
  photo: string | null;
};

/** Tarjeta en miniatura de una autoridad: foto (o inicial) + nombre + cargo. */
function AutoridadCard({ a }: { a: Autoridad }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-piedra/15 bg-white p-3 shadow-[0_1px_2px_rgba(26,43,60,0.04)]">
      {a.photo ? (
        <Image
          src={a.photo}
          alt={a.name}
          width={52}
          height={52}
          sizes="52px"
          className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-austral font-display text-lg text-on-austral"
        >
          {a.name.charAt(0).toUpperCase()}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate font-display text-base leading-tight text-austral">
          {a.name}
        </p>
        <p className="truncate text-sm text-glaciar">{a.role}</p>
      </div>
    </div>
  );
}

/**
 * Bloque "Quiénes somos / Misión": texto + CTA a la izquierda; a la derecha,
 * la imagen de misión (si se cargó) o las autoridades en miniatura (nombre +
 * cargo). Si no hay imagen ni autoridades, no se muestra nada a la derecha
 * (sin panel vacío).
 */
export async function MisionBlock({ data }: BlockProps) {
  const title = str(data, "title", "Quiénes somos");
  const text = str(data, "text");
  const image = str(data, "image").trim();
  const cta = (data.cta ?? {}) as Cta;
  const ctaLabel = cta.label?.trim() || "Conocé más sobre nosotros";
  const ctaHref = cta.href?.trim() || "/quienes-somos";

  // Si no hay imagen, mostramos las autoridades en miniatura.
  const autoridades = image ? [] : await getAutoridades();
  const hasAside = Boolean(image) || autoridades.length > 0;

  return (
    <Section tone="light" id="mision">
      <div
        className={`grid items-center gap-12 lg:gap-16 ${
          hasAside ? "lg:grid-cols-[1.1fr_0.9fr]" : ""
        }`}
      >
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

        {hasAside ? (
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
              <div>
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-piedra">
                  Autoridades
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {autoridades.map((a) => (
                    <AutoridadCard key={a.id} a={a} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </Section>
  );
}

export default MisionBlock;
