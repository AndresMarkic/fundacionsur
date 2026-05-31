import type { Metadata } from "next";
import {
  Inter,
  Cormorant_Garamond,
  Poppins,
  Playfair_Display,
  Source_Sans_3,
  Libre_Franklin,
  Fraunces,
  Nunito_Sans,
} from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getMenu, getSettings } from "@/lib/content";
import { contrastColor, ensureReadableOnLight } from "@/lib/color";
import type { FontPair } from "@/lib/theme";

// --- Familias del par por defecto (editorial): se precargan ---------------
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});

// --- Familias de los demás pares: se descargan solo si se eligen ----------
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-source-sans",
  display: "swap",
  preload: false,
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-libre-franklin",
  display: "swap",
  preload: false,
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito-sans",
  display: "swap",
  preload: false,
});

// Todas las variables de fuente disponibles en <html> (cada una define
// `--font-*` sin descargarse hasta que el par elegido la use).
const FONT_VARIABLES = [
  inter.variable,
  cormorant.variable,
  poppins.variable,
  playfair.variable,
  sourceSans.variable,
  libreFranklin.variable,
  fraunces.variable,
  nunitoSans.variable,
].join(" ");

// Fallbacks por familia (igualan los del `@theme` por defecto para el par
// editorial, y mantienen un fallback sensato para los demás).
const SERIF_FB = "Georgia, serif";
const SANS_FB = "system-ui, sans-serif";

// Mapa par tipográfico → variables CSS de display/body (con fallback).
const FONT_PAIR_VARS: Record<FontPair, { display: string; body: string }> = {
  editorial: {
    display: `var(--font-cormorant), ${SERIF_FB}`,
    body: `var(--font-inter), ${SANS_FB}`,
  },
  moderna: {
    display: `var(--font-poppins), ${SANS_FB}`,
    body: `var(--font-inter), ${SANS_FB}`,
  },
  clasica: {
    display: `var(--font-playfair), ${SERIF_FB}`,
    body: `var(--font-source-sans), ${SANS_FB}`,
  },
  sobria: {
    display: `var(--font-libre-franklin), ${SANS_FB}`,
    body: `var(--font-libre-franklin), ${SANS_FB}`,
  },
  humanista: {
    display: `var(--font-fraunces), ${SERIF_FB}`,
    body: `var(--font-nunito-sans), ${SANS_FB}`,
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const DESCRIPTION =
  "Fundación Sur Santa Cruz: organización sin fines de lucro de la Patagonia austral, comprometida con el desarrollo social, la identidad del territorio y el trabajo junto a las comunidades del sur.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fundación Sur · Desarrollo social en la Patagonia austral",
    template: "%s · Fundación Sur",
  },
  description: DESCRIPTION,
  icons: {
    icon: [{ url: "/brand/isotipo.png", type: "image/png" }],
    shortcut: "/brand/isotipo.png",
    apple: "/brand/isotipo.png",
  },
  openGraph: {
    type: "website",
    siteName: "Fundación Sur",
    locale: "es_AR",
    title: "Fundación Sur · Desarrollo social en la Patagonia austral",
    description: DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Fundación Sur",
    description: DESCRIPTION,
  },
};

// El header y el footer se renderizan a partir de la base (menú y ajustes
// editables desde el admin), por eso forzamos render dinámico en toda la app.
// La optimización a revalidación on-demand queda para una etapa posterior.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // El panel admin (`/admin/*`) NO usa el chrome público (Navbar/Footer).
  // El middleware expone la ruta en `x-pathname`; si está bajo /admin, el
  // layout admin se encarga de su propia estructura.
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  // Tema activo: inyectamos variables CSS en <html> que sobrescriben los
  // tokens `@theme` por defecto. Con `themeJson` vacío estas variables igualan
  // los defaults, así la web se ve idéntica hasta que el admin personalice.
  const settings = await getSettings();
  const { colors, fontPair } = settings.theme;
  const piedra = ensureReadableOnLight(colors.piedra);
  const fonts = FONT_PAIR_VARS[fontPair];
  const styleVars = {
    "--color-austral": colors.austral,
    "--color-glaciar": colors.glaciar,
    "--color-celeste": colors.celeste,
    "--color-piedra": piedra,
    "--color-estepa": colors.estepa,
    "--color-on-austral": contrastColor(colors.austral),
    "--color-on-glaciar": contrastColor(colors.glaciar),
    "--color-on-celeste": contrastColor(colors.celeste),
    "--color-on-estepa": contrastColor(colors.estepa),
    "--font-display": fonts.display,
    "--font-body": fonts.body,
  } as React.CSSProperties;

  return (
    <html
      lang="es"
      className={`${FONT_VARIABLES} h-full antialiased`}
      style={styleVars}
    >
      <body className="flex min-h-full flex-col">
        {isAdmin ? (
          children
        ) : (
          <PublicChrome settings={settings}>{children}</PublicChrome>
        )}
      </body>
    </html>
  );
}

async function PublicChrome({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: Awaited<ReturnType<typeof getSettings>>;
}) {
  const menu = await getMenu();

  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-[100] rounded-full bg-austral px-5 py-2.5 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <Navbar items={menu} />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} menu={menu} />
    </>
  );
}
