# Diseño — Web institucional Fundación Sur + CMS

**Fecha:** 2026-05-31
**Estado:** Aprobado por el cliente (pendiente revisión del documento escrito)
**Cliente:** Fundación Sur — Santa Cruz, Patagonia argentina

---

## 1. Objetivo

Construir el sitio institucional de **Fundación Sur** replicando la **estructura, jerarquía visual y comportamiento** del sitio de referencia `fundacionpensar.org.ar`, pero con la **marca, paleta, tipografía y tono propios** de Fundación Sur (según su manual de marca 2026). Incluye un **panel de administración (`/admin`)** desde el cual el equipo administra el 100% del contenido del sitio sin tocar código.

Se desarrolla primero **100% funcional en local** (`http://localhost:3000`) y, una vez validado, se **despliega a internet**.

> Nota legal: la estructura/diseño se inspiran en el patrón del sitio de referencia. NO se copian logo, nombre, fotos ni textos institucionales de Fundación Pensar. Toda la marca, contenido y assets son de Fundación Sur.

---

## 2. Stack técnico

| Capa | Tecnología | Motivo |
|---|---|---|
| Framework | **Next.js 15 (App Router) + React 19 + TypeScript** | Frontend + backend en un proyecto; SSR/SSG para SEO de noticias |
| Estilos | **Tailwind CSS** | Tokens de marca, responsive rápido |
| Base de datos (dev) | **SQLite** vía **Prisma ORM** | Cero configuración en local |
| Base de datos (prod) | **PostgreSQL** (Neon/Supabase) | Cambio de provider en Prisma al deployar |
| Autenticación | **Auth.js (NextAuth) — credenciales** | Login admin único, contraseña con **bcrypt** |
| Animación | **Framer Motion** + IntersectionObserver | Contadores animados, fade-ins |
| Subida de archivos | Filesystem local (`/public/uploads`) en dev → **Vercel Blob / Cloudinary** en prod | Imágenes (WebP) y PDFs de informes |
| Deploy (previsto) | **Vercel** + Postgres gestionado + almacenamiento de objetos | Nativo para Next.js |

Idioma del sitio: **Español (es-AR)**. Sin multi-idioma (YAGNI).

---

## 3. Sistema de marca (manual Fundación Sur 2026)

### 3.1 Paleta de color (tokens)
| Rol | Nombre | Hex | Uso |
|---|---|---|---|
| Primario | Azul Austral | `#1A2B3C` | Header, footer, títulos, textos fuertes |
| Secundario | Verde Glaciar | `#2A7F8A` | Botones, acentos, links de acción |
| Acento | Agua Celeste | `#4AABB8` | Hovers, subrayados, detalles, "Leer más →" |
| Neutro | Piedra Gris | `#8A9CAD` | Metadatos, fechas, bordes suaves |
| Complementario | Estepa Cálida | `#C4956A` | Detalles cálidos puntuales |
| Base | Blanco / Gris claro | `#FFFFFF` / `#F2F4F6` | Fondos |

> Reemplaza el acento rojo/naranja de Pensar por **Verde Glaciar / Agua Celeste**.

### 3.2 Tipografía
- **Títulos / display:** serif elegante en línea con el logo → **Cormorant Garamond** (Google Fonts), pesos 600–700.
- **Cuerpo / UI:** sans humanista → **Inter** (Google Fonts), 400–600.
- Cargadas con `next/font` (equivalente a `font-display: swap`).
- (Ajustable si la Fundación tiene fuentes corporativas exactas.)

### 3.3 Logo
- Tres variantes provistas por el cliente (PNG): **principal (fondo claro)**, **negativo (fondo oscuro)**, **isotipo (Cruz del Sur)**.
- Header: variante sobre fondo claro. Footer: variante negativa sobre Azul Austral.
- Assets se guardan en `/public/brand/`.

---

## 4. Arquitectura de información y navegación

### 4.1 Menú principal (editable desde el admin)
Ítems iniciales:
`[LOGO]  Puertas Abiertas · Territorio · Comunidad · Prensa · Campus Sur · Quiénes somos   🔍 Buscador   [Suscribite]`

- **Header sticky**; en mobile colapsa a **hamburguesa + overlay** con la misma jerarquía. Logo y "Suscribite" siempre visibles.
- **Quiénes somos** agrupa: Misión · Valores (Compromiso / Territorio / Transparencia / Comunidad) · Autoridades · Nuestras sedes.

### 4.2 Menú gestionable (requisito explícito del cliente)
El menú es una **colección editable** en el admin. Cada ítem tiene:
- `label` (texto), `href` (URL interna o externa), `parentId` (para desplegables anidados),
- `order` (posición), `visible` (mostrar/ocultar), `isCTA` (estilo botón).

Desde el admin se puede: **agregar ítems nuevos, quitar los que no se usan, renombrarlos, reordenarlos, ocultarlos y anidarlos en desplegables**. El header se renderiza a partir de esta configuración.

---

## 5. Estructura de la home — bloques componibles

La home es una **lista ordenada de bloques** de tipos conocidos. Desde el admin se pueden **reordenar, mostrar/ocultar y editar** (no es un page-builder libre tipo Elementor — es un set de bloques predefinidos, robusto y editable).

Bloques (orden inicial, de arriba a abajo):
1. **Hero** — imagen ancha clickeable (evento/destacado) + link.
2. **Últimas Noticias** — feed de notas internas (título, fecha, "Leer más →") + botón al archivo.
3. **Informes** — texto intro + grilla de tarjetas descargables + "Ver más".
4. **Áreas** — grilla de las 5 áreas (ícono + título + descripción).
5. **Banner promocional** — imagen destacada (desktop + mobile) con botón.
6. **Quiénes somos / Misión** — texto de misión + imagen + CTA "Conocé más".
7. **En los medios (Prensa)** — últimos recortes de prensa destacados.
8. **Contadores** — números animados (0 → valor) con ícono; editables (p. ej. años de trabajo, comunidades, voluntarios, proyectos).
9. **CTA Suscripción** — bloque con formulario propio de suscripción.
10. **Footer** — logo, columnas de sitemap, contacto (dirección), redes (X, YouTube, Facebook, Instagram, LinkedIn), copyright.

---

## 6. Áreas / programas (contenido real aprobado)

| Área | Descripción |
|---|---|
| **Puertas Abiertas** | "Abrimos nuestras puertas para escucharte y construir juntos un impacto real en Santa Cruz. Te invitamos a sumarte, colaborar y ser parte activa de nuestra comunidad." |
| **Territorio** | "Recorremos cada rincón de la Patagonia austral. Trabajamos junto a las comunidades del sur para impulsar el desarrollo desde el territorio y para el territorio." |
| **Comunidad** | "Tejemos redes de trabajo colectivo y participativo. Creamos espacios donde vecinos, organizaciones e instituciones se encuentran para transformar su realidad." |
| **Prensa** | "Repercusión en los medios. Recopilamos las noticias y coberturas donde Fundación Sur y sus representantes aparecen en la prensa de Santa Cruz y del país." |
| **Campus Sur** | "Espacio de formación que impulsa el desarrollo de líderes y profesionales del sur, con herramientas de alto impacto junto a expertos." |

**Misión (base, del manual):** "Fundación Sur Santa Cruz es una organización sin fines de lucro con sede en la Patagonia argentina, comprometida con el desarrollo social, la identidad del territorio austral y el trabajo junto a las comunidades del sur."

**Valores:** Compromiso (con el desarrollo social de Santa Cruz) · Territorio (identidad patagónica auténtica) · Transparencia (gestión honesta y abierta) · Comunidad (trabajo colectivo y participativo).

> Distinción clave: **Noticias** = notas internas publicadas por la Fundación (feed de la home). **Prensa** = recortes/coberturas **externas** (enlaces a medios) donde aparece la Fundación o sus representantes.

---

## 7. Modelo de datos (Prisma)

- **Noticia**: `id, title, slug, date, coverImage, excerpt, body, status(draft|published), createdAt, updatedAt`
- **PrensaItem** (recorte): `id, title, mediaOutlet, date, externalUrl, thumbnail, createdAt`
- **Informe**: `id, title, description, coverImage, fileUrl(PDF), date, createdAt`
- **Area**: `id, name, slug, icon, shortDescription, pageContent, order`
- **Autoridad**: `id, name, role, photo, bio, order`
- **Sede**: `id, name, address, phone, email, mapUrl, order`
- **HomeBlock**: `id, type, order, visible, dataJson` (config/contenido del bloque)
- **MenuItem**: `id, label, href, parentId, order, visible, isCTA`
- **Suscriptor**: `id, name, email, createdAt`
- **SiteSettings** (singleton): contacto, dirección, redes sociales, textos footer, datos de contadores, logo
- **AdminUser**: `id, email, passwordHash, name`

---

## 8. Panel de administración (`/admin`)

- **Login** (Auth.js credenciales) → sesión protegida; todas las rutas `/admin/*` requieren autenticación.
- **Dashboard** con accesos a:
  - CRUD de **Noticias**, **Prensa**, **Informes**, **Áreas**, **Autoridades**, **Sedes**.
  - **Gestor de la home**: reordenar (drag o subir/bajar), mostrar/ocultar y editar cada bloque.
  - **Gestor del menú**: agregar/quitar/renombrar/reordenar/ocultar/anidar ítems.
  - **Suscriptores**: listado + **exportar a CSV**.
  - **Ajustes del sitio**: contacto, redes, textos footer, contadores, logo.
  - **Subida de imágenes/PDF** integrada en los formularios.
- Editor de cuerpo de noticias: editor de texto enriquecido simple (negrita, listas, links, imágenes).

---

## 9. Suscripción / contacto

Formulario propio en el sitio (nombre + email) → se guarda en **Suscriptor** → visible y exportable (CSV) desde el admin. Sin dependencia de terceros.

---

## 10. Comportamiento e interacciones

- Header sticky (puede reducir altura / cambiar fondo al scrollear).
- Desplegables del menú (hover en desktop / tap en mobile).
- Contadores animados con IntersectionObserver (0 → valor).
- Lazy loading de imágenes (`next/image`, WebP/AVIF, `srcset`).
- Art direction desktop/mobile en banners con `<picture>` / imágenes separadas.
- Hover states en tarjetas (elevación/sombra) y links (color acento).
- Popups/modal opcionales (suscripción / promociones).

---

## 11. Responsive

| Breakpoint | Comportamiento |
|---|---|
| Desktop (>1024px) | Menú horizontal completo, grillas 3–4 columnas |
| Tablet (768–1024px) | Grillas 2 columnas, espaciado reducido |
| Mobile (<768px) | Hamburguesa + overlay, 1 columna, imágenes mobile dedicadas |

---

## 12. SEO, performance y accesibilidad

- **SEO:** `title` y `meta description` por página, canonical, Open Graph + Twitter Cards, `robots index/follow`, `sitemap.xml`, slugs legibles para noticias.
- **Performance:** imágenes WebP/AVIF (`next/image`), lazy loading, fuentes con swap, apuntar a Core Web Vitals (LCP del hero, evitar layout shift en contadores/imágenes).
- **Accesibilidad:** skip-link "Saltar al contenido", `alt` en imágenes, foco visible, contraste suficiente del acento sobre fondo, navegación por teclado en menú y popups.

---

## 13. Fases de implementación

1. **Scaffold + marca:** proyecto Next.js + Tailwind + tokens de color/tipografía + logos; layout base (header sticky + footer) sobre datos estáticos.
2. **Datos:** esquema Prisma + SQLite + migraciones + **seed** con contenido real de Fundación Sur (áreas, misión, valores, menú, ajustes).
3. **Home pública:** render de bloques desde la base.
4. **Páginas internas:** listados y detalle de Noticias, Prensa, Informes, Áreas, Quiénes somos (misión/valores/autoridades/sedes).
5. **Auth + panel `/admin`:** login + CRUDs + gestor de home + gestor de menú + suscriptores + ajustes + uploads.
6. **Pulido:** responsive en 3 breakpoints, SEO, accesibilidad, animaciones, QA cross-browser.
7. **Deploy:** Postgres gestionado + almacenamiento de objetos + Vercel; variables de entorno; validación final.

---

## 14. Estructura de carpetas (propuesta)

```
fundacionsur/
  app/
    (public)/            # home y páginas públicas
    admin/               # panel protegido
    api/                 # rutas API (uploads, suscripción, etc.)
  components/            # Navbar, Footer, NewsItem, ReportCard, AreaCard, Counter, CTAStrip, Popup, Button...
  lib/                   # prisma client, auth, helpers
  prisma/                # schema.prisma, seed.ts, migrations
  public/
    brand/               # logos
    uploads/             # imágenes/PDF subidos (dev)
  styles/
  docs/superpowers/specs/
```

---

## 15. Fuera de alcance (YAGNI)

- Multi-idioma.
- Page-builder libre (drag&drop de elementos arbitrarios) — se usan bloques predefinidos.
- Multi-usuario con roles/permisos — un único admin (ampliable después).
- Comentarios, e-commerce, donaciones online — no solicitados.

---

## 16. Skills a utilizar durante la implementación

La construcción de la web debe apoyarse en las siguientes skills (instaladas en `.claude/skills/` y disponibles en el entorno):

### Construcción / diseño
- **frontend-design** — para que la home y los componentes (Navbar, Hero, ReportCard, AreaCard, Counter, CTAStrip, Footer) tengan calidad de producción y reflejen la marca austral de Fundación Sur, evitando el look genérico "hecho por IA".
- **news-site** — arranque de arquitectura y creación de componentes para la parte de portal de noticias/prensa.

### Proceso de desarrollo
- **writing-plans** — escribir el plan de implementación por etapas a partir de este spec (paso inmediato).
- **executing-plans** / **subagent-driven-development** — ejecutar el plan por tareas con checkpoints de revisión.
- **test-driven-development** — implementar features/bugfixes escribiendo el test antes que el código.

### Calidad, debugging y verificación
- **grill-me** (Matt Pocock) — estresar planes/diseños antes de construir, resolviendo cada rama de decisión.
- **diagnose** (Matt Pocock) — disciplina de diagnóstico para bugs difíciles y regresiones de performance (reproducir → hipótesis → instrumentar → fix → test de regresión).
- **systematic-debugging** — método ordenado para cualquier bug o comportamiento inesperado.
- **verification-before-completion** — verificar de verdad (correr comandos, observar salida) antes de declarar algo "listo".
- **requesting-code-review** / **code-review** / **simplify** — revisión y limpieza del código en hitos.
- **run** / **verify** — levantar la app y confirmar en el navegador que un cambio funciona.

### Comunicación (opcional)
- **caveman** (Matt Pocock) — modo de comunicación ultra-comprimido, si el usuario lo pide ("modo caveman" / `/caveman`).

> Regla de uso: ante creación de features nuevos, **brainstorming** (ya aplicado) → **writing-plans** → implementación con **TDD** → **verification-before-completion** y **code-review** antes de dar por terminada cada etapa.
