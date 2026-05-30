import { ChevronRight } from "lucide-react";
import { moreActions } from "../mocks/data";

export function MorePage() {
  return (
    <div className="space-y-4 pb-4">
      <section className="surface-card p-5">
        <p className="section-title">Panel interno</p>
        <h2 className="mt-2 text-2xl font-extrabold text-content">Configuracion operativa</h2>
        <p className="mt-1 text-sm text-muted">
          Accesos rapidos para administrar productos, precios y cierre diario.
        </p>
      </section>

      <section className="space-y-3">
        {moreActions.map((action) => (
          <button
            key={action.id}
            className="surface-card flex w-full items-center justify-between p-4 text-left"
          >
            <div>
              <p className="font-bold text-content">{action.title}</p>
              <p className="mt-1 text-sm text-muted">{action.description}</p>
            </div>
            <ChevronRight className="text-muted" size={18} />
          </button>
        ))}
      </section>
    </div>
  );
}
