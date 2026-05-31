import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { str, type BlockProps } from "@/components/blocks/types";

/**
 * Banner promocional con art direction desktop/mobile (`<picture>`).
 * Si no hay imagen, no renderiza nada (no rompe la home).
 */
export function BannerBlock({ data }: BlockProps) {
  const image = str(data, "image").trim();
  const imageMobile = str(data, "imageMobile").trim() || image;
  const link = str(data, "link").trim();
  const alt = str(data, "alt", "Banner Fundación Sur");
  const buttonLabel = str(data, "buttonLabel");

  // Sin imagen: ocultar el bloque (sobrio, no placeholder ruidoso).
  if (!image) return null;

  const media = (
    <picture>
      <source media="(min-width: 768px)" srcSet={image} />
      {/* Imagen base (mobile). next/image no soporta art direction por
          breakpoint, por eso usamos <picture> con <img> nativo. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageMobile}
        alt={alt}
        loading="lazy"
        className="h-auto w-full object-cover"
      />
    </picture>
  );

  return (
    <section className="px-5 py-10 sm:px-8 lg:py-14">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl">
        {link ? (
          <Link href={link} aria-label={alt} className="group/banner block">
            {media}
          </Link>
        ) : (
          media
        )}

        {buttonLabel && link && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center p-6 sm:justify-start sm:p-8">
            <Button href={link} variant="solid">
              {buttonLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default BannerBlock;
