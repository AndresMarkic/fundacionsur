import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { str, type BlockProps } from "@/components/blocks/types";

/** Estrellas dispersas — eco de la Cruz del Sur del isotipo. */
function SouthernCross() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="absolute left-[14%] top-[22%] text-celeste/70">✦</span>
      <span className="absolute left-[24%] top-[58%] text-sm text-white/30">✦</span>
      <span className="absolute right-[28%] top-[18%] text-celeste/40">✦</span>
      <span className="absolute right-[16%] top-[46%] text-lg text-white/25">✦</span>
      <span className="absolute bottom-[20%] right-[34%] text-sm text-celeste/30">✦</span>
    </div>
  );
}

/** Curva de horizonte — eco de la línea del isotipo. */
function HorizonCurve() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className="relative block h-12 w-full text-white sm:h-16"
    >
      <path
        d="M0 80 L0 48 C 240 18, 520 18, 760 40 C 1000 62, 1220 62, 1440 36 L1440 80 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Hero de portada — composición única (eyebrow, título, subtítulo y dos CTAs).
 * El fondo es la imagen cargada desde el admin (a pantalla completa, con velo
 * oscuro para legibilidad) o, si no hay imagen, el degradado de marca con cielo
 * austral. La curva de horizonte cierra la sección hacia el contenido siguiente.
 */
export function HeroBlock({ data }: BlockProps) {
  const image = str(data, "image").trim();
  const title = str(data, "title", "Fundación Sur");
  const subtitle = str(
    data,
    "subtitle",
    "Desde el sur, junto a las comunidades de Santa Cruz",
  );

  return (
    <section className="relative overflow-hidden bg-austral text-white">
      {/* Fondo */}
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Velos oscuros para que el texto se lea sobre cualquier imagen.
              Fuerte del lado izquierdo (donde va el texto) y suave a la derecha
              para que la imagen siga visible. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-austral via-austral/85 to-austral/25"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-austral/60 via-transparent to-transparent"
          />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_-10%,rgba(74,171,184,0.22),transparent_55%),radial-gradient(90%_70%_at_0%_110%,rgba(42,127,138,0.18),transparent_60%)]"
        />
      )}
      <SouthernCross />

      <div className="relative z-10 mx-auto flex min-h-[clamp(34rem,72vh,46rem)] max-w-7xl flex-col justify-center px-5 py-24 sm:px-8">
        <p className="mb-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-celeste">
          <span className="h-px w-8 bg-celeste/60" />
          Patagonia austral · Santa Cruz
        </p>

        <h1 className="max-w-4xl text-balance font-display text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">
          {title === "Fundación Sur" ? (
            <>
              Desde el sur, junto a las comunidades del{" "}
              <span className="text-celeste">territorio</span>.
            </>
          ) : (
            title
          )}
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/80">
          {subtitle}
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button href="/quienes-somos" variant="solid">
            Conocé la Fundación
          </Button>
          <Button href="/#suscribite" variant="link">
            Sumate a nuestra comunidad
          </Button>
        </div>
      </div>

      <HorizonCurve />
    </section>
  );
}

export default HeroBlock;
