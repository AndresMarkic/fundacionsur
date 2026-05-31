import ReactMarkdown, { type Components } from "react-markdown";

/**
 * Mapeo de elementos markdown a una tipografía editorial on-brand
 * (paleta austral/glaciar/celeste). No depende de @tailwindcss/typography:
 * cada elemento lleva sus clases, así el cuerpo de noticias y áreas comparte
 * el mismo ritmo y los enlaces el acento glaciar (con contraste AA) y subrayado.
 */
const components: Components = {
  h1: ({ children }) => (
    <h2 className="mt-12 font-display text-3xl leading-tight text-austral first:mt-0 sm:text-4xl">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-12 font-display text-3xl leading-tight text-austral first:mt-0 sm:text-[2rem]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-9 font-display text-2xl leading-snug text-austral first:mt-0">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-8 font-display text-xl leading-snug text-austral first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="mt-5 text-[1.075rem] leading-[1.75] text-austral/80 first:mt-0">
      {children}
    </p>
  ),
  a: ({ href, children }) => {
    const isExternal = !!href && !href.startsWith("/") && !href.startsWith("#");
    return (
      <a
        href={href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="font-medium text-glaciar underline decoration-glaciar/40 underline-offset-[3px] transition-colors hover:text-celeste hover:decoration-celeste"
      >
        {children}
      </a>
    );
  },
  strong: ({ children }) => (
    <strong className="font-semibold text-austral">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="mt-5 list-disc space-y-2.5 pl-5 marker:text-celeste first:mt-0">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 list-decimal space-y-2.5 pl-5 marker:font-medium marker:text-piedra first:mt-0">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1.5 text-[1.05rem] leading-[1.7] text-austral/80">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-7 border-l-2 border-celeste bg-fondo/70 py-1 pl-6 pr-4 font-display text-xl italic leading-relaxed text-austral/85 first:mt-0">
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr className="my-10 border-0 border-t border-piedra/25" />
  ),
  code: ({ children }) => (
    <code className="rounded bg-fondo px-1.5 py-0.5 font-mono text-[0.9em] text-glaciar">
      {children}
    </code>
  ),
};

/**
 * Renderiza contenido markdown con estilos de marca. Devuelve `null` si el
 * contenido viene vacío para que el llamador no muestre un contenedor hueco.
 */
export function Markdown({ children }: { children?: string | null }) {
  const content = children?.trim();
  if (!content) return null;
  return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
}

export default Markdown;
