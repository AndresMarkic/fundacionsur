import type { ReactNode } from "react";
import type { BlockProps } from "@/components/blocks/types";
import { HeroBlock } from "@/components/blocks/HeroBlock";
import { NoticiasBlock } from "@/components/blocks/NoticiasBlock";
import { InformesBlock } from "@/components/blocks/InformesBlock";
import { AreasBlock } from "@/components/blocks/AreasBlock";
import { BannerBlock } from "@/components/blocks/BannerBlock";
import { MisionBlock } from "@/components/blocks/MisionBlock";
import { PrensaBlock } from "@/components/blocks/PrensaBlock";
import { ContadoresBlock } from "@/components/blocks/ContadoresBlock";
import { CtaBlock } from "@/components/blocks/CtaBlock";

/** Un bloque puede ser sync o async (Server Component). */
type BlockComponent = (props: BlockProps) => ReactNode | Promise<ReactNode>;

/**
 * Registro de bloques de la home: mapea `type` (string en BD) → componente.
 * Tipos desconocidos se ignoran (ver `renderBlock`), así un bloque nuevo
 * o inválido nunca rompe la página.
 */
export const blockComponents: Record<string, BlockComponent> = {
  hero: HeroBlock,
  noticias: NoticiasBlock,
  informes: InformesBlock,
  areas: AreasBlock,
  banner: BannerBlock,
  mision: MisionBlock,
  prensa: PrensaBlock,
  contadores: ContadoresBlock,
  cta: CtaBlock,
};

export type { BlockProps };
