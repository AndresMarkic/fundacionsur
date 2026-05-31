# Fundación Sur — Web institucional + CMS · Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Aplicar las skills de la sección 16 del spec: **frontend-design** (UI), **news-site** (componentes de portal), **test-driven-development**, **diagnose**/**systematic-debugging** (bugs), **verification-before-completion** y **code-review** al cerrar cada milestone.

**Goal:** Construir el sitio institucional de Fundación Sur (réplica estructural de fundacionpensar.org.ar con marca propia) más un panel `/admin` que administra el 100% del contenido, funcionando en `localhost:3000` y luego desplegable.

**Architecture:** App única **Next.js 15 (App Router)**. Rutas públicas renderizan contenido leído de la base vía Prisma. `/admin/*` protegido con Auth.js (credenciales, sesión JWT) expone CRUDs + gestor de home por bloques + gestor de menú + suscriptores. Datos en **SQLite (dev)** vía Prisma; migrable a Postgres. Uploads a filesystem local (dev).

**Tech Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · Prisma + SQLite · Auth.js v5 (next-auth) · bcryptjs · Framer Motion · react-markdown · Vitest + Testing Library.

**Spec de referencia:** `docs/superpowers/specs/2026-05-31-fundacion-sur-web-design.md`

---

## Convenciones del plan

- **Cada tarea**: archivos a tocar + código real + cómo probar + commit.
- **TDD** para lógica pura y handlers (`lib/`, API): test que falla → mínima implementación → test pasa → commit.
- **UI/visual**: se verifica con `npm run dev` + skill **verify**/**run** (no todo es testeable por unidad).
- **Commits frecuentes**: uno por tarea. Mensajes en español, imperativos.
- **Patrón CRUD** (definido una vez en M5, reутilizado): los recursos comparten la misma estructura; se detalla **Noticias** completo y el resto se implementa "igual que Noticias con estos campos".
- Paths relativos a la raíz del proyecto `fundacionsur/`.

---

## M0 — Bootstrap del proyecto

### Tarea 0.1 — Inicializar git
- **Acción**: en la raíz `fundacionsur/` (no es repo git todavía).
```bash
git init
printf "node_modules/\n.next/\ndev.db\ndev.db-journal\n.env\n.env*.local\npublic/uploads/*\n!public/uploads/.gitkeep\n" > .gitignore
mkdir -p public/uploads && type nul > public/uploads/.gitkeep   # Windows; en bash: touch public/uploads/.gitkeep
```
- **Commit**: `chore: init repo y gitignore`

### Tarea 0.2 — Scaffold Next.js
- **Acción**: scaffold en el directorio actual (ya contiene PDFs/PNGs y docs/).
```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint --import-alias "@/*" --no-turbopack --use-npm
```
- Responder "Yes" a sobrescribir si pregunta (los PDFs/imágenes y `docs/` se conservan; mover los PDFs/PNG a `assets-marca/` antes si molestan).
- **Verificar**: `npm run dev` levanta en `http://localhost:3000` y muestra la página default.
- **Commit**: `chore: scaffold Next.js 15 + Tailwind + TS`

### Tarea 0.3 — Dependencias del proyecto
```bash
npm i prisma @prisma/client next-auth@beta bcryptjs framer-motion react-markdown
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react @types/bcryptjs
```
- **Commit**: `chore: dependencias (prisma, next-auth, framer-motion, vitest)`

### Tarea 0.4 — Configurar Vitest
- **Archivo** `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: ["./vitest.setup.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```
- **Archivo** `vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```
- **`package.json`** scripts: agregar `"test": "vitest run"`, `"test:watch": "vitest"`.
- **Test de humo** `src/lib/__tests__/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";
describe("smoke", () => { it("suma", () => expect(1 + 1).toBe(2)); });
```
- **Verificar**: `npm test` → 1 passed.
- **Commit**: `chore: configurar vitest`

---

## M1 — Marca, tokens y layout base

### Tarea 1.1 — Mover assets de marca
- Crear `public/brand/` y copiar los logos PNG (claro, oscuro, isotipo) renombrados:
  - `logo-claro.png` (sobre fondo claro), `logo-oscuro.png` (negativo), `isotipo.png`.
- Mover los PDFs originales y PNGs sueltos de la raíz a `assets-marca/` (referencia, fuera del build).
- **Commit**: `chore: assets de marca en public/brand`

### Tarea 1.2 — Tokens de color y tipografía (Tailwind v4)
- **Archivo** `src/app/globals.css` — definir tokens de marca con `@theme`:
```css
@import "tailwindcss";

@theme {
  --color-austral: #1A2B3C;   /* primario */
  --color-glaciar: #2A7F8A;   /* secundario */
  --color-celeste: #4AABB8;   /* acento */
  --color-piedra:  #8A9CAD;   /* neutro */
  --color-estepa:  #C4956A;   /* complementario */
  --color-fondo:   #F2F4F6;   /* gris claro */
  --font-display: "Cormorant Garamond", serif;
  --font-body: "Inter", system-ui, sans-serif;
}

:root { color-scheme: light; }
body { @apply bg-white text-[--color-austral] font-body; }
h1,h2,h3 { @apply font-display; }
```
- **Fuentes** en `src/app/layout.tsx` con `next/font/google`:
```tsx
import { Inter, Cormorant_Garamond } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500","600","700"], variable: "--font-cormorant", display: "swap" });
```
  - Aplicar `className={`${inter.variable} ${cormorant.variable}`}` en `<html>` y mapear las variables en `@theme` (`--font-body: var(--font-inter)` etc.).
- **Verificar**: una página de prueba muestra serif en `<h1>` y los colores `bg-austral`/`text-glaciar` funcionan.
- **Commit**: `feat: tokens de marca Fundación Sur + fuentes`

### Tarea 1.3 — Componente Button (variantes)
- **TDD** `src/components/ui/__tests__/Button.test.tsx`: renderiza variante `solid` con clase de fondo glaciar, variante `link` con flecha "→", variante `outline`.
- **Impl** `src/components/ui/Button.tsx` con props `variant: "solid" | "link" | "outline"`, `href?`, `as`.
- **Commit**: `feat: componente Button con variantes de marca`

### Tarea 1.4 — Navbar (datos estáticos primero)
- **Impl** `src/components/layout/Navbar.tsx`: header sticky, logo (link a `/`), ítems del menú (recibe `items: MenuItemView[]` por props; estático en esta etapa con los 6 ítems), buscador (icono, abre `/buscar?q=`), CTA "Suscribite". Mobile: hamburguesa + overlay.
- **Tipos** `src/lib/types.ts`: `MenuItemView = { label: string; href: string; isCTA?: boolean; children?: MenuItemView[] }`.
- **Verificar** en `dev`: sticky al scrollear, overlay mobile abre/cierra, foco por teclado.
- **Commit**: `feat: Navbar sticky + overlay mobile`

### Tarea 1.5 — Footer (datos estáticos primero)
- **Impl** `src/components/layout/Footer.tsx`: fondo austral, logo negativo, 4 columnas de sitemap, bloque contacto, íconos sociales (X, YouTube, Facebook, Instagram, LinkedIn), copyright.
- **Commit**: `feat: Footer institucional`

### Tarea 1.6 — Layout raíz con skip-link
- `src/app/layout.tsx`: `<a href="#contenido" class="sr-only focus:not-sr-only">Saltar al contenido</a>`, `<Navbar/>`, `<main id="contenido">`, `<Footer/>`. Metadatos base (title template, description, OpenGraph defaults).
- **Commit**: `feat: layout raíz + skip-link + metadatos base`

---

## M2 — Base de datos y seed

### Tarea 2.1 — Prisma init + datasource SQLite
```bash
npx prisma init --datasource-provider sqlite
```
- `.env`: `DATABASE_URL="file:./dev.db"`, `AUTH_SECRET="<generar con: npx auth secret>"`, `NEXTAUTH_URL="http://localhost:3000"`.
- **Commit**: `chore: prisma init (sqlite)`

### Tarea 2.2 — Esquema Prisma completo
- **Archivo** `prisma/schema.prisma` — modelos del spec §7:
```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "sqlite"; url = env("DATABASE_URL") }

model Noticia {
  id String @id @default(cuid())
  title String
  slug String @unique
  date DateTime @default(now())
  coverImage String?
  excerpt String?
  body String                 // markdown
  status String @default("draft") // draft | published
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PrensaItem {
  id String @id @default(cuid())
  title String
  mediaOutlet String
  date DateTime @default(now())
  externalUrl String
  thumbnail String?
  createdAt DateTime @default(now())
}

model Informe {
  id String @id @default(cuid())
  title String
  description String?
  coverImage String?
  fileUrl String
  date DateTime @default(now())
  createdAt DateTime @default(now())
}

model Area {
  id String @id @default(cuid())
  name String
  slug String @unique
  icon String?
  shortDescription String
  pageContent String?         // markdown
  order Int @default(0)
}

model Autoridad {
  id String @id @default(cuid())
  name String
  role String
  photo String?
  bio String?
  order Int @default(0)
}

model Sede {
  id String @id @default(cuid())
  name String
  address String?
  phone String?
  email String?
  mapUrl String?
  order Int @default(0)
}

model HomeBlock {
  id String @id @default(cuid())
  type String                 // hero | noticias | informes | areas | banner | mision | prensa | contadores | cta
  order Int @default(0)
  visible Boolean @default(true)
  dataJson String @default("{}")
}

model MenuItem {
  id String @id @default(cuid())
  label String
  href String
  parentId String?
  parent MenuItem? @relation("MenuChildren", fields: [parentId], references: [id], onDelete: SetNull)
  children MenuItem[] @relation("MenuChildren")
  order Int @default(0)
  visible Boolean @default(true)
  isCTA Boolean @default(false)
}

model Suscriptor {
  id String @id @default(cuid())
  name String?
  email String @unique
  createdAt DateTime @default(now())
}

model SiteSettings {
  id String @id @default("singleton")
  address String?
  email String?
  phone String?
  social String @default("{}")   // JSON {x,youtube,facebook,instagram,linkedin}
  footerText String?
  countersJson String @default("[]") // [{label,value,suffix}]
}

model AdminUser {
  id String @id @default(cuid())
  email String @unique
  passwordHash String
  name String?
}
```
- **Migración**: `npx prisma migrate dev --name init`.
- **Commit**: `feat: esquema Prisma inicial`

### Tarea 2.3 — Cliente Prisma singleton
- **Archivo** `src/lib/prisma.ts`:
```ts
import { PrismaClient } from "@prisma/client";
const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
```
- **Commit**: `feat: cliente prisma singleton`

### Tarea 2.4 — Helper de slug (TDD)
- **Test** `src/lib/__tests__/slug.test.ts`: `slugify("Áreas del Sur!")` → `"areas-del-sur"`; quita acentos, baja a minúsculas, reemplaza no-alfanum por `-`, recorta `-` extremos.
- **Impl** `src/lib/slug.ts`.
- **Commit**: `feat: slugify (tested)`

### Tarea 2.5 — Seed con contenido real
- **Archivo** `prisma/seed.ts`: insertar
  - **AdminUser**: email `prensamasgestion@gmail.com`, password hasheado (bcrypt) tomado de `process.env.SEED_ADMIN_PASSWORD` (default `cambiar123` con aviso).
  - **Area** ×5 (textos del spec §6: Puertas Abiertas, Territorio, Comunidad, Prensa, Campus Sur).
  - **MenuItem** ×7 (5 áreas + "Quiénes somos" + CTA "Suscribite" `isCTA`).
  - **HomeBlock** ×10 en orden (hero, noticias, informes, areas, banner, mision, prensa, contadores, cta) con `dataJson` por defecto (mision con texto del spec, contadores placeholder: años/comunidades/voluntarios/proyectos).
  - **SiteSettings** singleton (misión, redes vacías, contadores).
  - 2-3 **Noticia** de ejemplo (`status: published`), 2 **PrensaItem**, 2 **Informe**, 2 **Autoridad**, 1 **Sede**.
- `package.json`: `"prisma": { "seed": "tsx prisma/seed.ts" }` (instalar `tsx` dev) y script `"db:seed": "prisma db seed"`.
- **Verificar**: `npm run db:seed` y `npx prisma studio` muestra los datos.
- **Commit**: `feat: seed con contenido real de Fundación Sur`

---

## M3 — Home pública por bloques

### Tarea 3.1 — Funciones de lectura (lib/content) — TDD
- **Test** `src/lib/__tests__/content.test.ts` (usa una BD de test o mocks de prisma): `getHomeBlocks()` devuelve solo `visible:true` ordenados por `order`; `getLatestNoticias(n)` devuelve publicadas ordenadas por fecha desc.
- **Impl** `src/lib/content.ts` con esas funciones + `getMenu()` (arma árbol padre/hijos), `getAreas()`, `getSettings()`.
- **Commit**: `feat: capa de lectura de contenido (tested)`

### Tarea 3.2 — Navbar/Footer con datos reales
- Reemplazar props estáticas: el layout llama `getMenu()` y `getSettings()` (Server Components) y pasa a Navbar/Footer.
- **Verificar**: cambiar un MenuItem en Prisma Studio se refleja en el header.
- **Commit**: `feat: Navbar y Footer leen de la base`

### Tarea 3.3 — Componentes de tarjeta/feed (frontend-design)
- `src/components/site/NewsItem.tsx` (título link, fecha, "Leer más →").
- `src/components/site/ReportCard.tsx` (portada, título, botón).
- `src/components/site/AreaCard.tsx` (ícono, título, descripción).
- `src/components/site/Counter.tsx` (número animado 0→valor con Framer Motion + IntersectionObserver).
- **Test** `Counter.test.tsx`: renderiza el valor final; **Verificar** animación en `dev`.
- **Commit**: `feat: componentes de tarjeta/contador (marca Sur)`

### Tarea 3.4 — Bloques de home (un componente por tipo)
- `src/components/blocks/` : `HeroBlock`, `NoticiasBlock`, `InformesBlock`, `AreasBlock`, `BannerBlock`, `MisionBlock`, `PrensaBlock`, `ContadoresBlock`, `CtaBlock`. Cada uno recibe `data` (parseado de `dataJson`) + datos de la base según corresponda.
- **Registry** `src/components/blocks/index.ts`: `blockMap: Record<string, Component>` para render dinámico.
- **Commit**: `feat: bloques de home`

### Tarea 3.5 — Página home
- `src/app/(public)/page.tsx`: `getHomeBlocks()` → mapear por `type` al `blockMap`, render en orden. `revalidate` o `dynamic` según necesidad.
- **Verificar**: la home muestra los 10 bloques con el contenido del seed; responsive en 3 breakpoints (skill **verify**).
- **Commit**: `feat: home pública por bloques`

---

## M4 — Páginas internas públicas

### Tarea 4.1 — Noticias: listado + detalle
- `src/app/(public)/noticias/page.tsx`: lista paginada de publicadas (feed).
- `src/app/(public)/noticias/[slug]/page.tsx`: detalle, render del `body` con `react-markdown`; `generateMetadata` (title, description=excerpt, OpenGraph image=coverImage).
- **Test**: `getNoticiaBySlug` devuelve null si draft. **Verificar** SEO tags en el HTML.
- **Commit**: `feat: noticias listado + detalle + SEO`

### Tarea 4.2 — Prensa (recortes)
- `src/app/(public)/prensa/page.tsx`: grilla de `PrensaItem` (miniatura, medio, fecha, título → enlace externo `target="_blank" rel="noopener"`).
- **Commit**: `feat: página de prensa (recortes externos)`

### Tarea 4.3 — Informes
- `src/app/(public)/informes/page.tsx`: grilla de tarjetas; botón "Descargar" → `fileUrl`.
- **Commit**: `feat: página de informes descargables`

### Tarea 4.4 — Áreas
- `src/app/(public)/areas/[slug]/page.tsx`: hero del área + `pageContent` (markdown). Links desde AreasBlock y menú.
- **Commit**: `feat: páginas de áreas`

### Tarea 4.5 — Quiénes somos
- `src/app/(public)/quienes-somos/page.tsx`: misión + valores (Compromiso/Territorio/Transparencia/Comunidad) + grilla de Autoridades + Sedes.
- **Commit**: `feat: quiénes somos (misión, valores, autoridades, sedes)`

### Tarea 4.6 — Buscador
- `src/app/(public)/buscar/page.tsx`: query `q`, busca en Noticias (title/excerpt) y muestra resultados.
- **Test**: `searchNoticias("patagonia")` filtra por término.
- **Commit**: `feat: búsqueda de noticias`

---

## M5 — Auth + Panel /admin

### Tarea 5.1 — Auth.js (credenciales)
- **Archivo** `src/auth.ts` (Auth.js v5): Credentials provider que valida email+password contra `AdminUser` con `bcrypt.compare`; `session.strategy = "jwt"`; callbacks que adjuntan `user.id`.
- `src/app/api/auth/[...nextauth]/route.ts`: `export { GET, POST } from "@/auth"`.
- **Middleware** `src/middleware.ts`: proteger `/admin/:path*` (redirige a `/admin/login` si no hay sesión).
- **Test** `src/lib/__tests__/auth.test.ts`: `verifyCredentials` retorna user con hash válido, null con inválido.
- **Verificar**: login con las credenciales del seed entra a `/admin`; sin sesión redirige.
- **Commit**: `feat: auth admin (credenciales + middleware)`

### Tarea 5.2 — Login page + layout admin
- `src/app/admin/login/page.tsx`: form email/password → `signIn("credentials")`.
- `src/app/admin/layout.tsx`: sidebar con navegación (Dashboard, Noticias, Prensa, Informes, Áreas, Autoridades, Sedes, Home, Menú, Suscriptores, Ajustes) + botón logout.
- **Commit**: `feat: login y layout del panel admin`

### Tarea 5.3 — Lib de uploads
- `src/lib/upload.ts`: recibe `File`, valida tipo (image/* o application/pdf) y tamaño (≤ 8MB), genera nombre único, escribe en `public/uploads/`, devuelve `/uploads/<archivo>`.
- `src/app/api/upload/route.ts` (POST, protegido): `request.formData()` → `saveUpload`.
- **Test**: validación de tipo/tamaño rechaza ejecutables/grandes.
- **Commit**: `feat: subida de imágenes y PDF`

### Tarea 5.4 — Patrón CRUD genérico (definición)
**Plantilla** que se repite para cada recurso `R` con campos `F`:
1. **Server actions** `src/app/admin/<r>/actions.ts`: `create<R>`, `update<R>`, `delete<R>` (validan sesión, escriben con prisma, `revalidatePath`).
2. **Lista** `src/app/admin/<r>/page.tsx`: tabla con editar/borrar + botón "Nuevo".
3. **Form** `src/app/admin/<r>/[id]/page.tsx` y `.../nuevo/page.tsx`: formulario controlado; campos imagen/PDF usan `/api/upload`.
4. **Test** de las actions (validación de campos requeridos, slug único en Noticias/Área).
- Documentar aquí; no es tarea ejecutable por sí sola.

### Tarea 5.5 — CRUD Noticias (referencia completa)
- Implementar el patrón 5.4 para **Noticia**. Campos: title, slug (auto desde title, editable), date, coverImage (upload), excerpt, body (textarea markdown + preview con react-markdown), status (draft/published).
- **TDD** `actions.test.ts`: `createNoticia` exige title y body; genera slug único (sufijo `-2` si choca).
- **Verificar**: crear/editar/publicar una noticia y verla en `/noticias`.
- **Commit**: `feat: CRUD de noticias en admin`

### Tarea 5.6 — CRUD Prensa
- Patrón 5.4 para **PrensaItem**. Campos: title, mediaOutlet, date, externalUrl (validar URL), thumbnail (upload opcional).
- **Commit**: `feat: CRUD de prensa`

### Tarea 5.7 — CRUD Informes
- Patrón 5.4 para **Informe**. Campos: title, description, coverImage (upload), fileUrl (upload PDF requerido), date.
- **Commit**: `feat: CRUD de informes`

### Tarea 5.8 — CRUD Áreas
- Patrón 5.4 para **Area**. Campos: name, slug, icon, shortDescription, pageContent (markdown), order.
- **Commit**: `feat: CRUD de áreas`

### Tarea 5.9 — CRUD Autoridades y Sedes
- Patrón 5.4 para **Autoridad** (name, role, photo, bio, order) y **Sede** (name, address, phone, email, mapUrl, order).
- **Commit**: `feat: CRUD de autoridades y sedes`

### Tarea 5.10 — Gestor de menú (requisito explícito)
- `src/app/admin/menu/page.tsx`: lista de MenuItem con **agregar / editar (label, href, isCTA, parent) / borrar / mostrar-ocultar / subir-bajar (order)**. Soporta anidar eligiendo `parentId`.
- **Server actions** correspondientes con `revalidatePath("/", "layout")`.
- **TDD**: `reorderMenu` intercambia `order`; `setVisible` togglea.
- **Verificar**: agregar un ítem nuevo aparece en el header; ocultarlo lo saca; anidarlo crea desplegable.
- **Commit**: `feat: gestor de menú editable`

### Tarea 5.11 — Gestor de home por bloques
- `src/app/admin/home/page.tsx`: lista de HomeBlock con **subir/bajar (order), mostrar/ocultar (visible), editar contenido (dataJson)**. Editor de `dataJson` por tipo de bloque (form específico: Hero→imagen+link; Mision→texto+imagen+CTA; Contadores→lista label/value/suffix; Banner→imagen desktop/mobile+link; etc.).
- **Server actions** con `revalidatePath("/")`.
- **TDD**: `updateBlockData` valida JSON; `reorderBlocks` reordena.
- **Verificar**: ocultar "Informes" lo saca de la home; reordenar mueve la sección.
- **Commit**: `feat: gestor de home por bloques`

### Tarea 5.12 — Suscriptores + export CSV
- Form público de suscripción (`src/components/site/SubscribeForm.tsx`) → `POST /api/suscribir` (valida email, upsert en Suscriptor).
- `src/app/admin/suscriptores/page.tsx`: tabla + botón "Exportar CSV" → `GET /api/suscriptores/export` (protegido, devuelve `text/csv` con `Content-Disposition: attachment`).
- **TDD**: `toCsv(rows)` arma encabezado + filas escapando comas/comillas.
- **Verificar**: suscribirse desde la home, ver el registro en admin, descargar CSV.
- **Commit**: `feat: suscriptores + export CSV`

### Tarea 5.13 — Ajustes del sitio
- `src/app/admin/ajustes/page.tsx`: editar SiteSettings (dirección, email, teléfono, redes sociales, footerText, contadores). Subida de logo opcional.
- **Commit**: `feat: ajustes del sitio`

---

## M6 — Pulido (responsive, SEO, accesibilidad, animación)

### Tarea 6.1 — SEO técnico
- `src/app/sitemap.ts` (rutas estáticas + noticias publicadas + áreas) y `src/app/robots.ts` (index/follow).
- `generateMetadata` en todas las páginas internas (canonical, OG, Twitter card `summary_large_image`).
- **Verificar**: `/sitemap.xml` y `/robots.txt` responden; tags OG presentes.
- **Commit**: `feat: sitemap, robots y metadatos SEO`

### Tarea 6.2 — Imágenes y performance
- Usar `next/image` en hero, tarjetas, banners (art direction desktop/mobile con `media`/`sizes`). `priority` en el hero (LCP).
- **Verificar**: Lighthouse local sin layout shift grosero en contadores/imágenes.
- **Commit**: `perf: next/image + LCP del hero`

### Tarea 6.3 — Accesibilidad
- Revisar: skip-link funcional, `alt` en todas las imágenes, foco visible, contraste del acento (glaciar/celeste) sobre fondo, navegación por teclado en menú/overlay y formularios.
- **Verificar**: recorrido por teclado completo.
- **Commit**: `a11y: foco, alt, contraste, teclado`

### Tarea 6.4 — Responsive QA
- Validar breakpoints (>1024 / 768–1024 / <768): grillas 4→2→1, menú→hamburguesa, banners mobile.
- **Commit**: `fix: ajustes responsive en 3 breakpoints`

### Tarea 6.5 — Revisión y limpieza
- Correr skill **code-review** sobre el diff acumulado y **simplify**; aplicar correcciones de correctitud y duplicación.
- `npm test` verde y `npm run build` sin errores (skill **verification-before-completion**).
- **Commit**: `chore: code-review + build limpio`

---

## M7 — Deploy a internet

### Tarea 7.1 — Migrar datasource a Postgres
- Crear Postgres gestionado (Neon/Supabase). Cambiar `provider = "postgresql"` y `DATABASE_URL` de producción; `npx prisma migrate deploy`.
- **Commit**: `chore: provider postgres para producción`

### Tarea 7.2 — Almacenamiento de archivos en prod
- Reemplazar `lib/upload.ts` por adapter de objetos (Vercel Blob o Cloudinary) detrás de la misma interfaz `saveUpload(file) → url`. (Filesystem en Vercel es efímero.)
- **Commit**: `feat: uploads a almacenamiento de objetos en prod`

### Tarea 7.3 — Deploy en Vercel
- Importar repo en Vercel; variables de entorno (`DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, claves de storage). Seed inicial en prod (admin + áreas + menú + bloques).
- **Verificar**: sitio en dominio público; login admin; alta de noticia; suscripción.
- **Commit**: `chore: configuración de deploy`

---

## Self-Review (cobertura del spec)

- **§4 navegación / menú editable** → 1.4, 3.2, 5.10 ✅
- **§5 home por bloques editable** → 3.4, 3.5, 5.11 ✅
- **§6 áreas/misión/valores** → 2.5 (seed), 4.4, 4.5 ✅
- **§7 modelo de datos** → 2.2 ✅
- **§8 panel admin (todos los CRUD + home + menú + suscriptores + ajustes + uploads)** → M5 ✅
- **§9 suscripción propia + CSV** → 5.12 ✅
- **§10 comportamiento (sticky, dropdowns, contadores, lazy, hover)** → 1.4, 3.3, 6.2 ✅
- **§11 responsive** → 6.4 ✅
- **§12 SEO/perf/a11y** → 6.1–6.3 ✅
- **§13 fases** → M0–M7 ✅
- **§16 skills** → header del plan + verificaciones por milestone ✅

Sin placeholders ejecutables: cada tarea tiene archivos, código/criterio y commit. Los CRUD repetidos referencian el patrón 5.4 (DRY).
