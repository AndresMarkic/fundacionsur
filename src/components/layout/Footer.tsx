import Image from "next/image";
import Link from "next/link";
import type { MenuItemView } from "@/lib/types";
import type { SiteSettingsView } from "@/lib/content";

type FooterProps = {
  settings: SiteSettingsView;
  menu?: MenuItemView[];
};

type SocialDef = { key: string; label: string; path: string };

// Logos sociales como paths SVG (24x24 viewBox), trazados propios y simples.
// `key` coincide con las claves del JSON `social` en SiteSettings.
const SOCIAL_DEFS: SocialDef[] = [
  {
    key: "x",
    label: "X",
    path: "M3 3h4.6l4.1 5.6L16.8 3H21l-6.8 8.3L21.4 21h-4.6l-4.5-6.1L7.1 21H3l7.1-8.7L3 3Z",
  },
  {
    key: "youtube",
    label: "YouTube",
    path: "M22 12c0-2 0-3.4-.4-4.3a2.7 2.7 0 0 0-1.9-1.9C18 5.4 12 5.4 12 5.4s-6 0-7.7.4a2.7 2.7 0 0 0-1.9 1.9C2 8.6 2 10 2 12s0 3.4.4 4.3a2.7 2.7 0 0 0 1.9 1.9c1.7.4 7.7.4 7.7.4s6 0 7.7-.4a2.7 2.7 0 0 0 1.9-1.9c.4-.9.4-2.3.4-4.3ZM10 15V9l5.2 3L10 15Z",
  },
  {
    key: "facebook",
    label: "Facebook",
    path: "M14 9V7c0-1 .3-1.5 1.5-1.5H17V2.2C16.6 2.1 15.5 2 14.3 2 11.8 2 10 3.5 10 6.4V9H7.5v3.5H10V22h4v-9.5h2.8l.4-3.5H14Z",
  },
  {
    key: "instagram",
    label: "Instagram",
    path: "M12 2c2.7 0 3 0 4.1.1 1.1 0 1.8.2 2.4.5.7.2 1.2.6 1.7 1.1.5.5.9 1 1.1 1.7.3.6.5 1.3.5 2.4.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c0 1.1-.2 1.8-.5 2.4a4.7 4.7 0 0 1-1.1 1.7c-.5.5-1 .9-1.7 1.1-.6.3-1.3.5-2.4.5-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1.1 0-1.8-.2-2.4-.5a4.7 4.7 0 0 1-1.7-1.1c-.5-.5-.9-1-1.1-1.7-.3-.6-.5-1.3-.5-2.4C2 15 2 14.7 2 12s0-3 .1-4.1c0-1.1.2-1.8.5-2.4A4.7 4.7 0 0 1 3.7 3.8c.5-.5 1-.9 1.7-1.1.6-.3 1.3-.5 2.4-.5C9 2 9.3 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.4 5.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    path: "M6.5 8H3.7v12h2.8V8ZM5.1 3.5A1.7 1.7 0 1 0 5 6.9a1.7 1.7 0 0 0 .1-3.4ZM20.3 13.4c0-3-1.6-4.4-3.8-4.4-1.7 0-2.5.9-2.9 1.6V8h-2.8v12h2.8v-6.3c0-1.7.9-2.2 1.8-2.2.9 0 1.6.6 1.6 2.2V20h2.8l.5-6.6Z",
  },
];

function SocialIcon({ href, label, path }: { href: string; label: string; path: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-on-austral/15 text-on-austral/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-celeste hover:bg-celeste hover:text-on-celeste"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-[18px] w-[18px]"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
    </a>
  );
}

const CURRENT_YEAR = new Date().getFullYear();

export function Footer({ settings, menu = [] }: FooterProps) {
  // Columnas de sitemap: derivadas del menú (raíces con hijos como columnas;
  // las raíces sin hijos se agrupan en una columna "Explorar").
  const columnsWithChildren = menu.filter((i) => i.children?.length && !i.isCTA);
  const flatRoots = menu.filter((i) => !i.children?.length && !i.isCTA);

  // Redes presentes (URL no vacía) en el orden canónico.
  const socials = SOCIAL_DEFS.map((def) => ({
    ...def,
    href: settings.social?.[def.key]?.trim() ?? "",
  })).filter((s) => s.href.length > 0);

  const email = settings.email?.trim();
  const phone = settings.phone?.trim();
  const address = settings.address?.trim();

  return (
    <footer className="relative mt-auto overflow-hidden bg-austral text-on-austral">
      {/* Línea de horizonte austral, eco de la curva del isotipo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-celeste/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* Marca + descripción */}
          <div className="max-w-xs">
            <Link href="/" aria-label="Fundación Sur — inicio">
              <Image
                src="/brand/logo-oscuro.png"
                alt="Fundación Sur"
                width={1960}
                height={960}
                sizes="120px"
                className="h-14 w-auto object-contain object-left"
              />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-on-austral/60">
              {settings.footerText ||
                "Organización sin fines de lucro de la Patagonia austral, comprometida con el desarrollo social y las comunidades del sur."}
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {socials.map((s) => (
                  <SocialIcon key={s.key} href={s.href} label={s.label} path={s.path} />
                ))}
              </div>
            )}
          </div>

          {/* Columnas con hijos (p. ej. Quiénes somos) */}
          {columnsWithChildren.map((col) => (
            <nav key={col.href} aria-label={col.label}>
              <h3 className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-celeste">
                {col.label}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.children!.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-on-austral/70 transition-colors hover:text-on-austral"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Secciones del sitio (raíces sin desplegable) */}
          {flatRoots.length > 0 && (
            <nav aria-label="Secciones">
              <h3 className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-celeste">
                Secciones
              </h3>
              <ul className="mt-5 space-y-3">
                {flatRoots.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-on-austral/70 transition-colors hover:text-on-austral"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Contacto */}
          <div>
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-celeste">
              Contacto
            </h3>
            <address className="mt-5 space-y-3 text-sm not-italic text-on-austral/70">
              {address && <p className="leading-relaxed">{address}</p>}
              {email && (
                <p>
                  <a
                    href={`mailto:${email}`}
                    className="transition-colors hover:text-celeste"
                  >
                    {email}
                  </a>
                </p>
              )}
              {phone && (
                <p>
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="transition-colors hover:text-celeste"
                  >
                    {phone}
                  </a>
                </p>
              )}
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-on-austral/10 pt-8 text-xs text-on-austral/45 sm:flex-row sm:items-center">
          <p>© {CURRENT_YEAR} Fundación Sur · Santa Cruz</p>
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
