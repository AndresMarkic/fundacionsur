import Image from "next/image";
import { formatDate } from "@/lib/format";

export type ReportData = {
  title: string;
  description?: string | null;
  coverImage?: string | null;
  fileUrl?: string | null;
  date?: Date | string | null;
};

/** Portada de marca cuando un informe no tiene imagen propia. */
function BrandCover() {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-end overflow-hidden bg-austral"
    >
      {/* Resplandor glaciar + estrellas, eco del hero */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_-10%,rgba(74,171,184,0.28),transparent_55%)]" />
      <span className="absolute left-[18%] top-[26%] text-celeste/60 text-sm">✦</span>
      <span className="absolute right-[22%] top-[20%] text-on-austral/25">✦</span>
      <span className="absolute right-[34%] top-[52%] text-celeste/30 text-xs">✦</span>
      {/* Curva de horizonte */}
      <svg
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
        className="relative block h-10 w-full text-on-austral/10"
      >
        <path
          d="M0 60 L0 34 C 90 12, 200 12, 280 28 C 340 40, 380 40, 400 26 L400 60 Z"
          fill="currentColor"
        />
      </svg>
      <span className="absolute left-5 top-5 font-display text-lg text-on-austral/80">
        Informe
      </span>
    </div>
  );
}

/**
 * Tarjeta de informe descargable. Portada (imagen o fallback de marca),
 * título, descripción y acción "Descargar". Pensada para grilla.
 */
export function ReportCard({ report }: { report: ReportData }) {
  const hasFile = !!report.fileUrl?.trim();
  const fileUrl = report.fileUrl?.trim() ?? "";

  return (
    <article className="group/report flex h-full flex-col overflow-hidden rounded-2xl border border-piedra/20 bg-white shadow-[0_1px_2px_rgba(26,43,60,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-celeste/40 hover:shadow-[0_24px_50px_-28px_rgba(26,43,60,0.4)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-fondo">
        {report.coverImage?.trim() ? (
          <Image
            src={report.coverImage.trim()}
            alt={report.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover/report:scale-105"
          />
        ) : (
          <BrandCover />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {report.date && (
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-piedra">
            {formatDate(report.date)}
          </p>
        )}
        <h3 className="mt-2 font-display text-xl leading-snug text-austral">
          {report.title}
        </h3>
        {report.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-austral/65">
            {report.description}
          </p>
        )}

        <div className="mt-5 pt-1">
          {hasFile ? (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-glaciar transition-colors hover:text-celeste"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                <path d="M5 21h14" />
              </svg>
              Descargar
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-piedra/70">
              Próximamente
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ReportCard;
