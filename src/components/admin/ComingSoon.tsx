export function ComingSoon({
  title,
  milestone = "M5-B",
}: {
  title: string;
  milestone?: string;
}) {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-austral">{title}</h1>
      <div className="rounded-2xl border border-dashed border-piedra/30 bg-white p-10 text-center">
        <p className="text-sm font-medium text-austral">
          Próximamente ({milestone})
        </p>
        <p className="mt-1 text-sm text-piedra">
          La gestión de este recurso se implementa en un milestone posterior.
        </p>
      </div>
    </div>
  );
}
