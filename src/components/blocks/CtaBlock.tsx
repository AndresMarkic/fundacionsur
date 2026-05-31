import { Button } from "@/components/ui/Button";
import { str, type BlockProps } from "@/components/blocks/types";

/**
 * Franja CTA de suscripción. El formulario propio se construye en M5; por
 * ahora el botón apunta al ancla #suscribite (o al href configurado).
 */
export function CtaBlock({ data }: BlockProps) {
  const title = str(data, "title", "Sumate a Fundación Sur");
  const text = str(data, "text", "Suscribite y recibí nuestras novedades.");
  const buttonLabel = str(data, "buttonLabel", "Suscribite");
  const href = str(data, "href", "/#suscribite").trim() || "/#suscribite";

  return (
    <section id="suscribite" className="px-5 py-16 sm:px-8 lg:py-20">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-glaciar px-6 py-14 text-white sm:px-12 lg:py-20">
        {/* Atmósfera glaciar + estrellas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_80%_at_100%_0%,rgba(74,171,184,0.5),transparent_55%),radial-gradient(80%_70%_at_0%_100%,rgba(26,43,60,0.35),transparent_60%)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[12%] top-[24%] text-celeste/50"
        >
          ✦
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[8%] bottom-[28%] text-sm text-white/30"
        >
          ✦
        </span>

        <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
              {title}
            </h2>
            {text && (
              <p className="mt-4 text-lg leading-relaxed text-white/85">{text}</p>
            )}
          </div>
          <div className="shrink-0">
            <Button
              href={href}
              variant="solid"
              className="!bg-white !text-glaciar hover:!bg-austral hover:!text-white"
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBlock;
