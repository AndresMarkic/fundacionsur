"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MenuItemView } from "@/lib/types";
import { Button } from "@/components/ui/Button";

type NavbarProps = {
  items: MenuItemView[];
};

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** Ítem de menú de escritorio, con desplegable al hover/foco si tiene hijos. */
function DesktopItem({ item }: { item: MenuItemView }) {
  const hasChildren = !!item.children?.length;

  const linkClasses =
    "relative inline-flex items-center gap-1 py-2 text-[0.8125rem] font-medium uppercase tracking-[0.08em] text-austral/80 transition-colors hover:text-austral";

  if (!hasChildren) {
    return (
      <li className="group/nav relative">
        <Link href={item.href} className={linkClasses}>
          <span className="relative">
            {item.label}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-celeste transition-all duration-300 group-hover/nav:w-full" />
          </span>
        </Link>
      </li>
    );
  }

  return (
    <li className="group/nav relative">
      <button
        type="button"
        className={`${linkClasses} cursor-default`}
        aria-haspopup="true"
      >
        <span className="relative">
          {item.label}
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-celeste transition-all duration-300 group-hover/nav:w-full" />
        </span>
        <Chevron className="h-3.5 w-3.5 transition-transform duration-300 group-hover/nav:rotate-180" />
      </button>
      <div
        className="invisible absolute left-1/2 top-full z-50 min-w-56 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100"
        role="menu"
      >
        <ul className="overflow-hidden rounded-xl border border-piedra/20 bg-white py-2 shadow-[0_20px_50px_-24px_rgba(26,43,60,0.45)]">
          {item.children!.map((child) => (
            <li key={child.href} role="none">
              <Link
                href={child.href}
                role="menuitem"
                className="block px-5 py-2.5 text-sm text-austral/75 transition-colors hover:bg-glaciar-50 hover:text-glaciar"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function Navbar({ items }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const navItems = items.filter((i) => !i.isCTA);

  // Sombra/borde sutil al scrollear.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloqueo de scroll + foco + Esc en el overlay mobile.
  useEffect(() => {
    if (!open) return;
    const trigger = menuButtonRef.current;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      // Devuelve el foco al botón hamburguesa al cerrar.
      trigger?.focus();
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md transition-[box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-b border-piedra/25 shadow-[0_8px_30px_-18px_rgba(26,43,60,0.35)]"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Fundación Sur — inicio"
        >
          <Image
            src="/brand/logo-claro.png"
            alt="Fundación Sur"
            width={1960}
            height={960}
            sizes="120px"
            priority
            className="h-11 w-auto object-contain object-left sm:h-12"
          />
        </Link>

        {/* Navegación de escritorio */}
        <nav
          className="hidden lg:block"
          aria-label="Navegación principal"
        >
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <DesktopItem key={item.href} item={item} />
            ))}
          </ul>
        </nav>

        {/* Acciones de escritorio */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/buscar"
            aria-label="Buscar"
            className="flex h-10 w-10 items-center justify-center rounded-full text-austral/70 transition-colors hover:bg-fondo hover:text-glaciar"
          >
            <SearchIcon className="h-5 w-5" />
          </Link>
          <Button href="/#suscribite" variant="solid">
            Suscribite
          </Button>
        </div>

        {/* Acciones mobile */}
        <div className="flex items-center gap-1 lg:hidden">
          <Link
            href="/buscar"
            aria-label="Buscar"
            className="flex h-10 w-10 items-center justify-center rounded-full text-austral/70 transition-colors hover:bg-fondo hover:text-glaciar"
          >
            <SearchIcon className="h-5 w-5" />
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="flex h-10 w-10 items-center justify-center rounded-full text-austral transition-colors hover:bg-fondo"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Overlay mobile full-screen */}
      <div
        id="menu-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed inset-0 z-50 flex flex-col bg-white lg:hidden ${
          open ? "" : "pointer-events-none"
        }`}
        hidden={!open}
      >
        <div className="flex h-20 items-center justify-between border-b border-piedra/20 px-5 sm:px-8">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center"
            aria-label="Fundación Sur — inicio"
          >
            <Image
              src="/brand/logo-claro.png"
              alt="Fundación Sur"
              width={1960}
              height={960}
              sizes="120px"
              className="h-11 w-auto object-contain object-left"
            />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="flex h-10 w-10 items-center justify-center rounded-full text-austral transition-colors hover:bg-fondo"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <nav
          className="flex-1 overflow-y-auto px-5 py-8 sm:px-8"
          aria-label="Navegación principal"
        >
          <ul className="flex flex-col">
            {navItems.map((item, i) => (
              <li
                key={item.href}
                className="border-b border-piedra/15 last:border-0"
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-3 py-4 font-display text-2xl text-austral transition-colors hover:text-glaciar"
                >
                  <span className="font-body text-xs tabular-nums text-celeste">
                    0{i + 1}
                  </span>
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <ul className="-mt-1 mb-3 ml-8 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block py-1.5 text-sm text-austral/65 transition-colors hover:text-glaciar"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-piedra/20 px-5 py-6 sm:px-8">
          <Button
            href="/#suscribite"
            variant="solid"
            className="w-full justify-center"
            onClick={() => setOpen(false)}
          >
            Suscribite
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
