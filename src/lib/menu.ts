import type { MenuItemView } from "@/lib/types";

/**
 * Menú principal (estático en M1). En M3 se reemplaza por `getMenu()`
 * leyendo de la base, manteniendo la misma forma `MenuItemView[]`.
 */
export const MAIN_MENU: MenuItemView[] = [
  { label: "Puertas Abiertas", href: "/areas/puertas-abiertas" },
  { label: "Territorio", href: "/areas/territorio" },
  { label: "Comunidad", href: "/areas/comunidad" },
  { label: "Prensa", href: "/prensa" },
  { label: "Campus Sur", href: "/areas/campus-sur" },
  {
    label: "Quiénes somos",
    href: "/quienes-somos",
    children: [
      { label: "Misión", href: "/quienes-somos#mision" },
      { label: "Valores", href: "/quienes-somos#valores" },
      { label: "Autoridades", href: "/quienes-somos#autoridades" },
      { label: "Nuestras sedes", href: "/quienes-somos#sedes" },
    ],
  },
];
