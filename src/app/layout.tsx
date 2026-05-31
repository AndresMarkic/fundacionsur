import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getMenu, getSettings } from "@/lib/content";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

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
  const [menu, settings] = await Promise.all([getMenu(), getSettings()]);

  return (
    <html
      lang="es"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
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
      </body>
    </html>
  );
}
