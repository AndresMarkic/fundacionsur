"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

// Navegación del panel. Las páginas de recursos las construyen M5-B/C; acá
// dejamos los enlaces (con placeholders "Próximamente").
const NAV: NavItem[] = [
   { label: "Dashboard", href: "/admin" },
   { label: "Home", href: "/admin/home" },
   { label: "Menú", href: "/admin/menu" },
  { label: "Noticias", href: "/admin/noticias" },
  { label: "Prensa", href: "/admin/prensa" },
  { label: "Informes", href: "/admin/informes" },
  { label: "Áreas", href: "/admin/areas" },
  { label: "Autoridades", href: "/admin/autoridades" },
  { label: "Sedes", href: "/admin/sedes" },
  { label: "Suscriptores", href: "/admin/suscriptores" },
  { label: "Apariencia", href: "/admin/apariencia" },
  { label: "Ajustes", href: "/admin/ajustes" },
];

export function AdminSidebar({ onSignOut }: { onSignOut: () => Promise<void> }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-piedra/20 bg-austral text-on-austral">
      <div className="flex items-center gap-3 border-b border-on-austral/10 px-5 py-5">
        <Image
          src="/brand/isotipo.png"
          alt="Fundación Sur"
          width={36}
          height={36}
          className="rounded"
        />
        <div className="leading-tight">
          <div className="font-display text-base">Fundación Sur</div>
          <div className="text-xs text-on-austral/60">Panel</div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "block rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-glaciar text-on-glaciar"
                  : "text-on-austral/75 hover:bg-on-austral/10 hover:text-on-austral",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-on-austral/10 p-3">
        <form action={onSignOut}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-on-austral/75 transition-colors hover:bg-on-austral/10 hover:text-on-austral"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
