import Image from "next/image";
import Link from "next/link";

type FooterLink = { label: string; href: string; external?: boolean };
type FooterColumn = { title: string; links: FooterLink[] };

const COLUMNS: FooterColumn[] = [
  {
    title: "Áreas",
    links: [
      { label: "Puertas Abiertas", href: "/areas/puertas-abiertas" },
      { label: "Territorio", href: "/areas/territorio" },
      { label: "Comunidad", href: "/areas/comunidad" },
      { label: "Prensa", href: "/prensa" },
      { label: "Campus Sur", href: "/areas/campus-sur" },
    ],
  },
  {
    title: "Quiénes somos",
    links: [
      { label: "Misión", href: "/quienes-somos#mision" },
      { label: "Valores", href: "/quienes-somos#valores" },
      { label: "Autoridades", href: "/quienes-somos#autoridades" },
      { label: "Nuestras sedes", href: "/quienes-somos#sedes" },
    ],
  },
];

const EMAIL = "prensamasgestion@gmail.com";

type Social = { label: string; href: string; path: string };

// Logos sociales como paths SVG (24x24 viewBox), trazados propios y simples.
const SOCIALS: Social[] = [
  {
    label: "X",
    href: "#",
    path: "M3 3h4.6l4.1 5.6L16.8 3H21l-6.8 8.3L21.4 21h-4.6l-4.5-6.1L7.1 21H3l7.1-8.7L3 3Z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M22 12c0-2 0-3.4-.4-4.3a2.7 2.7 0 0 0-1.9-1.9C18 5.4 12 5.4 12 5.4s-6 0-7.7.4a2.7 2.7 0 0 0-1.9 1.9C2 8.6 2 10 2 12s0 3.4.4 4.3a2.7 2.7 0 0 0 1.9 1.9c1.7.4 7.7.4 7.7.4s6 0 7.7-.4a2.7 2.7 0 0 0 1.9-1.9c.4-.9.4-2.3.4-4.3ZM10 15V9l5.2 3L10 15Z",
  },
  {
    label: "Facebook",
    href: "#",
    path: "M14 9V7c0-1 .3-1.5 1.5-1.5H17V2.2C16.6 2.1 15.5 2 14.3 2 11.8 2 10 3.5 10 6.4V9H7.5v3.5H10V22h4v-9.5h2.8l.4-3.5H14Z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12 2c2.7 0 3 0 4.1.1 1.1 0 1.8.2 2.4.5.7.2 1.2.6 1.7 1.1.5.5.9 1 1.1 1.7.3.6.5 1.3.5 2.4.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c0 1.1-.2 1.8-.5 2.4a4.7 4.7 0 0 1-1.1 1.7c-.5.5-1 .9-1.7 1.1-.6.3-1.3.5-2.4.5-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1.1 0-1.8-.2-2.4-.5a4.7 4.7 0 0 1-1.7-1.1c-.5-.5-.9-1-1.1-1.7-.3-.6-.5-1.3-.5-2.4C2 15 2 14.7 2 12s0-3 .1-4.1c0-1.1.2-1.8.5-2.4A4.7 4.7 0 0 1 3.7 3.8c.5-.5 1-.9 1.7-1.1.6-.3 1.3-.5 2.4-.5C9 2 9.3 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.4 5.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M6.5 8H3.7v12h2.8V8ZM5.1 3.5A1.7 1.7 0 1 0 5 6.9a1.7 1.7 0 0 0 .1-3.4ZM20.3 13.4c0-3-1.6-4.4-3.8-4.4-1.7 0-2.5.9-2.9 1.6V8h-2.8v12h2.8v-6.3c0-1.7.9-2.2 1.8-2.2.9 0 1.6.6 1.6 2.2V20h2.8l.5-6.6Z",
  },
];

function SocialIcon({ social }: { social: Social }) {
  return (
    <a
      href={social.href}
      aria-label={social.label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-celeste hover:bg-celeste hover:text-austral"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-[18px] w-[18px]"
        aria-hidden="true"
      >
        <path d={social.path} />
      </svg>
    </a>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-austral text-white">
      {/* Línea de horizonte austral, eco de la curva del isotipo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-celeste/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Marca + descripción */}
          <div className="max-w-xs">
            <Link href="/" aria-label="Fundación Sur — inicio">
              <Image
                src="/brand/logo-oscuro.png"
                alt="Fundación Sur"
                width={1960}
                height={960}
                className="h-14 w-auto object-contain object-left"
              />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              Organización sin fines de lucro de la Patagonia austral,
              comprometida con el desarrollo social y las comunidades del sur.
            </p>
            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map((s) => (
                <SocialIcon key={s.label} social={s} />
              ))}
            </div>
          </div>

          {/* Columnas de sitemap */}
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-celeste">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contacto */}
          <div>
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-celeste">
              Contacto
            </h3>
            <address className="mt-5 space-y-3 text-sm not-italic text-white/70">
              <p className="leading-relaxed">
                Av. Kirchner 123
                <br />
                Río Gallegos, Santa Cruz
                <br />
                Patagonia, Argentina
              </p>
              <p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="transition-colors hover:text-celeste"
                >
                  {EMAIL}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center">
          <p>© 2026 Fundación Sur · Santa Cruz</p>
          <p className="flex items-center gap-2">
            <span aria-hidden="true" className="text-celeste/70">
              ✶
            </span>
            Patagonia austral · Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
