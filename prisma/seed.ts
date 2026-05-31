import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

// ---------------------------------------------------------------------------
// Datos
// ---------------------------------------------------------------------------

const AREAS: Array<{ name: string; shortDescription: string }> = [
  {
    name: "Puertas Abiertas",
    shortDescription:
      "Abrimos nuestras puertas para escucharte y construir juntos un impacto real en Santa Cruz. Te invitamos a sumarte, colaborar y ser parte activa de nuestra comunidad.",
  },
  {
    name: "Territorio",
    shortDescription:
      "Recorremos cada rincón de la Patagonia austral. Trabajamos junto a las comunidades del sur para impulsar el desarrollo desde el territorio y para el territorio.",
  },
  {
    name: "Comunidad",
    shortDescription:
      "Tejemos redes de trabajo colectivo y participativo. Creamos espacios donde vecinos, organizaciones e instituciones se encuentran para transformar su realidad.",
  },
  {
    name: "Prensa",
    shortDescription:
      "Repercusión en los medios. Recopilamos las noticias y coberturas donde Fundación Sur y sus representantes aparecen en la prensa de Santa Cruz y del país.",
  },
  {
    name: "Campus Sur",
    shortDescription:
      "Espacio de formación que impulsa el desarrollo de líderes y profesionales del sur, con herramientas de alto impacto junto a expertos.",
  },
];

const MENU_ITEMS: Array<{ label: string; href: string; isCTA?: boolean }> = [
  { label: "Puertas Abiertas", href: "/areas/puertas-abiertas" },
  { label: "Territorio", href: "/areas/territorio" },
  { label: "Comunidad", href: "/areas/comunidad" },
  { label: "Prensa", href: "/prensa" },
  { label: "Campus Sur", href: "/areas/campus-sur" },
  { label: "Quiénes somos", href: "/quienes-somos" },
  { label: "Suscribite", href: "/#suscribite", isCTA: true },
];

const COUNTERS = [
  { label: "Años de trabajo", value: 10, suffix: "+" },
  { label: "Comunidades alcanzadas", value: 25, suffix: "+" },
  { label: "Voluntarios", value: 120, suffix: "+" },
  { label: "Proyectos realizados", value: 40, suffix: "+" },
];

const HOME_BLOCKS: Array<{ type: string; data: unknown }> = [
  {
    type: "hero",
    data: {
      image: "",
      link: "/",
      title: "Fundación Sur",
      subtitle: "Desde el sur, junto a las comunidades de Santa Cruz",
    },
  },
  { type: "noticias", data: { title: "Últimas noticias", limit: 6 } },
  {
    type: "informes",
    data: {
      title: "Informes",
      intro: "Documentos y publicaciones de Fundación Sur.",
    },
  },
  { type: "areas", data: { title: "Nuestras áreas" } },
  { type: "banner", data: { image: "", imageMobile: "", link: "", alt: "" } },
  {
    type: "mision",
    data: {
      title: "Quiénes somos",
      text: "Fundación Sur Santa Cruz es una organización sin fines de lucro con sede en la Patagonia argentina, comprometida con el desarrollo social, la identidad del territorio austral y el trabajo junto a las comunidades del sur.",
      image: "",
      cta: { label: "Conocé más", href: "/quienes-somos" },
    },
  },
  { type: "prensa", data: { title: "En los medios", limit: 4 } },
  { type: "contadores", data: { title: "Nuestro recorrido", items: COUNTERS } },
  {
    type: "cta",
    data: {
      title: "Sumate a Fundación Sur",
      text: "Suscribite y recibí nuestras novedades.",
      buttonLabel: "Suscribite",
    },
  },
];

const NOTICIAS: Array<{
  title: string;
  date: Date;
  excerpt: string;
  body: string;
}> = [
  {
    title: "Fundación Sur lanza su programa de voluntariado 2026",
    date: new Date("2026-05-20T12:00:00"),
    excerpt:
      "Convocamos a vecinos y vecinas de Santa Cruz a sumarse a los equipos de trabajo territorial en toda la provincia.",
    body: "Fundación Sur abre la inscripción a su **programa de voluntariado 2026**, una iniciativa que busca fortalecer el trabajo comunitario en Río Gallegos y otras localidades de la Patagonia austral.\n\nDurante el año, los voluntarios participarán de actividades de acompañamiento social, talleres formativos y proyectos de desarrollo local junto a las comunidades del sur.",
  },
  {
    title: "Nuevo informe sobre desarrollo social en la Patagonia austral",
    date: new Date("2026-05-08T12:00:00"),
    excerpt:
      "Presentamos un relevamiento sobre las necesidades y oportunidades de las comunidades de Santa Cruz.",
    body: "Junto a equipos técnicos y referentes locales, elaboramos un **informe de diagnóstico** sobre el estado del desarrollo social en la región.\n\nEl documento reúne datos sobre acceso a servicios, participación comunitaria y proyectos en marcha, y propone líneas de acción para los próximos años.",
  },
  {
    title: "Campus Sur abre la inscripción a sus talleres de formación",
    date: new Date("2026-04-22T12:00:00"),
    excerpt:
      "El espacio de formación de Fundación Sur ofrece capacitaciones para líderes y profesionales del territorio.",
    body: "**Campus Sur**, el espacio de formación de la fundación, lanza un nuevo ciclo de talleres orientados al desarrollo de líderes y profesionales del sur.\n\nLas capacitaciones, dictadas junto a expertos, abordan herramientas de gestión, comunicación e impacto social, con foco en las particularidades del territorio patagónico.",
  },
];

const PRENSA_ITEMS: Array<{
  title: string;
  mediaOutlet: string;
  externalUrl: string;
  date: Date;
}> = [
  {
    title: "Fundación Sur impulsa el trabajo comunitario en Santa Cruz",
    mediaOutlet: "La Opinión Austral",
    externalUrl: "https://example.com/la-opinion-austral/fundacion-sur",
    date: new Date("2026-05-18T12:00:00"),
  },
  {
    title: "Voluntarios del sur: la red que crece en la Patagonia",
    mediaOutlet: "Tiempo Sur",
    externalUrl: "https://example.com/tiempo-sur/voluntarios-del-sur",
    date: new Date("2026-05-05T12:00:00"),
  },
];

const INFORMES: Array<{ title: string; description: string; date: Date }> = [
  {
    title: "Informe de impacto 2025",
    description:
      "Resumen de las actividades, proyectos y resultados de Fundación Sur durante el año 2025.",
    date: new Date("2026-03-15T12:00:00"),
  },
  {
    title: "Diagnóstico social de la Patagonia austral",
    description:
      "Relevamiento de necesidades y oportunidades de desarrollo en las comunidades de Santa Cruz.",
    date: new Date("2026-05-08T12:00:00"),
  },
];

const AUTORIDADES: Array<{ name: string; role: string; order: number }> = [
  { name: "Juan Pérez", role: "Presidente", order: 0 },
  { name: "María González", role: "Directora Ejecutiva", order: 1 },
];

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function main() {
  // --- AdminUser ---
  const defaultPassword = "cambiar123";
  const seedPassword = process.env.SEED_ADMIN_PASSWORD ?? defaultPassword;
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.warn(
      `[seed] SEED_ADMIN_PASSWORD no definido: usando contraseña por defecto "${defaultPassword}". CAMBIALA en producción.`,
    );
  }
  const passwordHash = await bcrypt.hash(seedPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: "prensamasgestion@gmail.com" },
    update: { passwordHash, name: "Administración" },
    create: {
      email: "prensamasgestion@gmail.com",
      passwordHash,
      name: "Administración",
    },
  });

  // --- Area x5 (slug por slugify, order 0..4) ---
  for (let i = 0; i < AREAS.length; i++) {
    const a = AREAS[i];
    const slug = slugify(a.name);
    await prisma.area.upsert({
      where: { slug },
      update: { name: a.name, shortDescription: a.shortDescription, order: i },
      create: {
        name: a.name,
        slug,
        shortDescription: a.shortDescription,
        order: i,
      },
    });
  }

  // --- MenuItem (sin unique key natural -> limpiar y recrear) ---
  await prisma.menuItem.deleteMany({});
  for (let i = 0; i < MENU_ITEMS.length; i++) {
    const m = MENU_ITEMS[i];
    await prisma.menuItem.create({
      data: {
        label: m.label,
        href: m.href,
        order: i,
        visible: true,
        isCTA: m.isCTA ?? false,
      },
    });
  }

  // --- HomeBlock x9 (sin unique key natural -> limpiar y recrear) ---
  await prisma.homeBlock.deleteMany({});
  for (let i = 0; i < HOME_BLOCKS.length; i++) {
    const b = HOME_BLOCKS[i];
    await prisma.homeBlock.create({
      data: {
        type: b.type,
        order: i,
        visible: true,
        dataJson: JSON.stringify(b.data),
      },
    });
  }

  // --- SiteSettings (singleton) ---
  const social = {
    x: "",
    youtube: "",
    facebook: "",
    instagram: "",
    linkedin: "",
  };
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      address: "Río Gallegos, Santa Cruz, Argentina",
      email: "prensamasgestion@gmail.com",
      phone: "",
      social: JSON.stringify(social),
      footerText: "Organización sin fines de lucro de la Patagonia austral.",
      countersJson: JSON.stringify(COUNTERS),
    },
    create: {
      id: "singleton",
      address: "Río Gallegos, Santa Cruz, Argentina",
      email: "prensamasgestion@gmail.com",
      phone: "",
      social: JSON.stringify(social),
      footerText: "Organización sin fines de lucro de la Patagonia austral.",
      countersJson: JSON.stringify(COUNTERS),
    },
  });

  // --- Noticia x3 (status published, slug por slugify) ---
  for (const n of NOTICIAS) {
    const slug = slugify(n.title);
    await prisma.noticia.upsert({
      where: { slug },
      update: {
        title: n.title,
        date: n.date,
        excerpt: n.excerpt,
        body: n.body,
        coverImage: "",
        status: "published",
      },
      create: {
        title: n.title,
        slug,
        date: n.date,
        excerpt: n.excerpt,
        body: n.body,
        coverImage: "",
        status: "published",
      },
    });
  }

  // --- PrensaItem x2 (sin unique key natural -> limpiar y recrear) ---
  await prisma.prensaItem.deleteMany({});
  for (const p of PRENSA_ITEMS) {
    await prisma.prensaItem.create({
      data: {
        title: p.title,
        mediaOutlet: p.mediaOutlet,
        externalUrl: p.externalUrl,
        date: p.date,
      },
    });
  }

  // --- Informe x2 (sin unique key natural -> limpiar y recrear) ---
  await prisma.informe.deleteMany({});
  for (const inf of INFORMES) {
    await prisma.informe.create({
      data: {
        title: inf.title,
        description: inf.description,
        fileUrl: "",
        date: inf.date,
      },
    });
  }

  // --- Autoridad x2 (sin unique key natural -> limpiar y recrear) ---
  await prisma.autoridad.deleteMany({});
  for (const au of AUTORIDADES) {
    await prisma.autoridad.create({
      data: { name: au.name, role: au.role, order: au.order },
    });
  }

  // --- Sede x1 (sin unique key natural -> limpiar y recrear) ---
  await prisma.sede.deleteMany({});
  await prisma.sede.create({
    data: {
      name: "Sede Central",
      address: "Río Gallegos, Santa Cruz",
      order: 0,
    },
  });

  // --- Conteos ---
  const counts = {
    AdminUser: await prisma.adminUser.count(),
    Area: await prisma.area.count(),
    MenuItem: await prisma.menuItem.count(),
    HomeBlock: await prisma.homeBlock.count(),
    SiteSettings: await prisma.siteSettings.count(),
    Noticia: await prisma.noticia.count(),
    PrensaItem: await prisma.prensaItem.count(),
    Informe: await prisma.informe.count(),
    Autoridad: await prisma.autoridad.count(),
    Sede: await prisma.sede.count(),
    Suscriptor: await prisma.suscriptor.count(),
  };
  console.log("[seed] Conteos por tabla:");
  console.table(counts);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("[seed] OK");
  })
  .catch(async (e) => {
    console.error("[seed] ERROR", e);
    await prisma.$disconnect();
    process.exit(1);
  });
