import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard" };

const QUICK_LINKS: Array<{ label: string; href: string; desc: string }> = [
  { label: "Noticias", href: "/admin/noticias", desc: "Crear y editar notas" },
  { label: "Prensa", href: "/admin/prensa", desc: "Repercusión en medios" },
  { label: "Informes", href: "/admin/informes", desc: "Documentos y PDF" },
  { label: "Home", href: "/admin/home", desc: "Bloques de la portada" },
];

export default async function AdminDashboardPage() {
  const [noticias, prensa, informes, suscriptores] = await Promise.all([
    prisma.noticia.count(),
    prisma.prensaItem.count(),
    prisma.informe.count(),
    prisma.suscriptor.count(),
  ]);

  const stats: Array<{ label: string; value: number; href: string }> = [
    { label: "Noticias", value: noticias, href: "/admin/noticias" },
    { label: "Prensa", value: prensa, href: "/admin/prensa" },
    { label: "Informes", value: informes, href: "/admin/informes" },
    { label: "Suscriptores", value: suscriptores, href: "/admin/suscriptores" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-austral">Dashboard</h1>
        <p className="mt-1 text-sm text-piedra">
          Resumen del contenido publicado en el sitio.
        </p>
      </div>

      <section
        aria-label="Resumen"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-2xl border border-piedra/15 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="text-3xl font-semibold text-austral">{s.value}</div>
            <div className="mt-1 text-sm text-piedra group-hover:text-glaciar">
              {s.label}
            </div>
          </Link>
        ))}
      </section>

      <section aria-label="Accesos rápidos" className="space-y-3">
        <h2 className="font-display text-lg text-austral">Accesos rápidos</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="rounded-xl border border-piedra/15 bg-white px-4 py-4 transition-colors hover:border-glaciar/40"
            >
              <div className="text-sm font-medium text-austral">{q.label}</div>
              <div className="mt-0.5 text-xs text-piedra">{q.desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
