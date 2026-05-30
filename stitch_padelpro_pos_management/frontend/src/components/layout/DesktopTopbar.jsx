import { Bell, CalendarDays, Search, Sparkles } from "lucide-react";
import { routeTitles } from "../navigation/navItems";

function getDesktopTitle(pathname) {
  if (pathname.startsWith("/turnos/")) {
    return "Turno";
  }

  return routeTitles[pathname] ?? "PadelPro POS";
}

function getDesktopSubtitle(pathname) {
  if (pathname.startsWith("/turnos/")) {
    return "Cobros, jugadores y detalle del turno en una sola vista.";
  }

  if (pathname === "/consumos") {
    return "Punto de venta rapido con contexto, carrito y cobro inmediato.";
  }

  if (pathname === "/caja") {
    return "Control operativo del dinero ingresado, transferencias y pendientes.";
  }

  if (pathname === "/turnos") {
    return "Agenda operativa para abrir turnos y resolver deuda mas rapido.";
  }

  if (pathname === "/mas") {
    return "Configuracion, administracion y utilidades del sistema.";
  }

  return "Resumen operativo del negocio para arrancar el dia con claridad.";
}

export function DesktopTopbar({ pathname }) {
  const title = getDesktopTitle(pathname);
  const subtitle = getDesktopSubtitle(pathname);
  const todayLabel = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <header className="hidden border-b border-line bg-app/70 backdrop-blur-xl lg:block">
      <div className="flex items-center justify-between gap-6 px-6 py-5">
        <div className="min-w-0">
          <p className="section-title">Workspace</p>
          <h1 className="mt-1 text-[28px] font-extrabold tracking-[-0.03em] text-content">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex min-w-[280px] items-center gap-3 rounded-[22px] border border-line bg-white/5 px-4 py-3 text-sm text-muted">
            <Search size={16} />
            <span>Buscar jugador, turno, producto o movimiento...</span>
          </div>

          <div className="flex items-center gap-2 rounded-[22px] border border-line bg-white/5 px-4 py-3">
            <CalendarDays size={16} className="text-primaryStrong" />
            <div>
              <p className="metric-label">Hoy</p>
              <p className="text-sm font-bold capitalize text-content">{todayLabel}</p>
            </div>
          </div>

          <button
            type="button"
            className="button-secondary flex h-12 w-12 items-center justify-center border-white/10 text-primaryStrong"
            aria-label="Ver notificaciones"
          >
            <Bell size={18} />
          </button>

          <div className="flex items-center gap-3 rounded-[22px] border border-line bg-white/5 px-3 py-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/16 text-primaryStrong">
              <Sparkles size={17} />
            </div>
            <div>
              <p className="metric-label">Sesion</p>
              <p className="text-sm font-extrabold text-content">Mostrador</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
