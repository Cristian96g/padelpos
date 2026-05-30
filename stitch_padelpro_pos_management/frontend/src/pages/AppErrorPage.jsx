import { AlertTriangle, ArrowLeft, RefreshCcw, ShieldAlert } from "lucide-react";
import { isRouteErrorResponse, Link, useNavigate, useRouteError } from "react-router-dom";

function getErrorCopy(error) {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        eyebrow: "Ruta no encontrada",
        title: "No encontramos esa pantalla",
        description: "La app no pudo abrir esa vista. Volve al inicio o segui operando desde otra seccion.",
        detail: `${error.status} · ${error.statusText}`,
      };
    }

    return {
      eyebrow: "Error de navegacion",
      title: "No pudimos abrir esta seccion",
      description: "La pantalla fallo al cargar. Podes reintentar o volver a una vista estable.",
      detail: `${error.status} · ${error.statusText}`,
    };
  }

  return {
    eyebrow: "Error inesperado",
    title: "Algo se rompio, pero la caja sigue bajo control",
    description:
      "La app encontro un problema al renderizar esta pantalla. Reintenta o volve al inicio para seguir operando.",
    detail: error instanceof Error ? error.message : "Sin detalle tecnico disponible",
  };
}

export function AppErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const copy = getErrorCopy(error);

  return (
    <div className="min-h-screen bg-app-glow px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-lg items-center justify-center">
        <section className="surface-card w-full overflow-hidden">
          <div className="border-b border-line bg-white/5 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/14 text-danger shadow-card">
                {isRouteErrorResponse(error) ? <AlertTriangle size={22} /> : <ShieldAlert size={22} />}
              </div>
              <div>
                <p className="section-title text-danger">{copy.eyebrow}</p>
                <h1 className="mt-1 text-xl font-extrabold text-content">{copy.title}</h1>
              </div>
            </div>
          </div>

          <div className="space-y-4 px-5 py-5">
            <p className="text-sm leading-6 text-muted">{copy.description}</p>

            <div className="rounded-[24px] border border-danger/20 bg-danger/10 px-4 py-3">
              <p className="metric-label text-danger">Detalle</p>
              <p className="mt-1 text-sm font-bold text-content">{copy.detail}</p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="button-primary flex items-center justify-center gap-2 rounded-3xl px-4 py-3 text-sm font-extrabold"
              >
                <RefreshCcw size={16} />
                Reintentar
              </button>

              <Link
                to="/"
                className="button-secondary flex items-center justify-center gap-2 rounded-3xl px-4 py-3 text-sm font-bold"
              >
                <ArrowLeft size={16} />
                Ir al inicio
              </Link>
            </div>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full text-sm font-bold text-muted underline underline-offset-4"
            >
              Volver a la pantalla anterior
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
