import { getHomeBlocks } from "@/lib/content";
import { blockComponents } from "@/components/blocks";

// El contenido y el orden de los bloques se editan desde el admin, por eso la
// home se renderiza dinámicamente (heredado del root layout, explícito aquí).
export const dynamic = "force-dynamic";

export default async function Home() {
  const blocks = await getHomeBlocks();

  return (
    <>
      {blocks.map((block) => {
        const Block = blockComponents[block.type];
        // Tipos desconocidos se ignoran sin romper la página.
        if (!Block) return null;
        return <Block key={block.id} data={block.data} />;
      })}
    </>
  );
}
