import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <section className="relative overflow-hidden bg-austral text-white">
      {/* Atmósfera: cielo austral con degradado y resplandor glaciar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_-10%,rgba(74,171,184,0.22),transparent_55%),radial-gradient(90%_70%_at_0%_110%,rgba(42,127,138,0.18),transparent_60%)]"
      />
      {/* Cruz del Sur: cinco estrellas dispersas, eco del isotipo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute left-[14%] top-[22%] text-celeste/70">✦</span>
        <span className="absolute left-[24%] top-[58%] text-white/30 text-sm">
          ✦
        </span>
        <span className="absolute right-[28%] top-[18%] text-celeste/40">
          ✦
        </span>
        <span className="absolute right-[16%] top-[46%] text-white/25 text-lg">
          ✦
        </span>
        <span className="absolute right-[34%] bottom-[20%] text-celeste/30 text-sm">
          ✦
        </span>
      </div>

      <div className="relative mx-auto flex min-h-[clamp(34rem,72vh,46rem)] max-w-7xl flex-col justify-center px-5 py-24 sm:px-8">
        <p className="mb-6 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-celeste">
          <span className="h-px w-8 bg-celeste/60" />
          Patagonia austral · Santa Cruz
        </p>

        <h1 className="max-w-4xl text-balance font-display text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">
          Desde el sur, junto a las comunidades del{" "}
          <span className="text-celeste">territorio</span>.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
          Fundación Sur es una organización sin fines de lucro de la Patagonia
          argentina, comprometida con el desarrollo social, la identidad del
          territorio austral y el trabajo colectivo con las comunidades de
          Santa Cruz.
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

      {/* Curva de horizonte: eco de la línea del isotipo */}
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
    </section>
  );
}
