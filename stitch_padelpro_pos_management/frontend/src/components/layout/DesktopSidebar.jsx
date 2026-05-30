import { ArrowUpRight, CalendarClock, Receipt, Wallet } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { formatCurrency } from "../../lib/format";
import { appNavItems } from "../navigation/navItems";
import { useTurnStore } from "../../store/TurnStoreProvider";

function SidebarMetric({ label, value, tone = "default" }) {
  const toneClass =
    tone === "warning"
      ? "text-warning"
      : tone === "success"
        ? "text-primaryStrong"
        : "text-content";

  return (
    <div className="rounded-[22px] border border-line bg-white/5 px-3 py-3">
      <p className="metric-label">{label}</p>
      <p className={`mt-1 text-sm font-extrabold ${toneClass}`}>{value}</p>
    </div>
  );
}

export function DesktopSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cashSummary, pendingRecords, turnsById } = useTurnStore();

  const turnList = Object.values(turnsById);
  const activeTurn = turnList[0] ?? null;

  return (
    <aside className="hidden h-screen flex-col border-r border-line bg-[#0d150f]/95 px-4 py-5 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primaryDark text-sm font-extrabold text-primaryStrong shadow-glow">
          PP
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primaryStrong">
            PadelPro POS
          </p>
          <p className="truncate text-sm font-bold text-content">Operacion diaria</p>
        </div>
      </div>

      <nav className="mt-6 space-y-1.5">
        {appNavItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex items-center justify-between rounded-[20px] px-3 py-3 transition-all duration-200 ${
                isActive
                  ? "border border-primary/20 bg-primary/12 text-primaryStrong shadow-[0_8px_30px_rgba(102,169,57,0.12)]"
                  : "border border-transparent text-muted hover:border-line hover:bg-white/5 hover:text-content"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                      isActive ? "bg-primary/16 text-primaryStrong" : "bg-white/5 text-muted"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">{label}</p>
                    <p className="text-[11px] font-bold text-muted">
                      {label === "Turnos"
                        ? "Cobros y jugadores"
                        : label === "Consumos"
                          ? "Venta rapida"
                          : label === "Caja"
                            ? "Control financiero"
                            : label === "Inicio"
                              ? "Resumen operativo"
                              : "Configuracion y mas"}
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  size={15}
                  className={`transition-transform duration-200 ${isActive ? "translate-x-0" : "translate-x-[-2px] opacity-60 group-hover:translate-x-0 group-hover:opacity-100"}`}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <section className="mt-6 space-y-3">
        <div className="flex items-center justify-between px-2">
          <p className="section-title">Senales rapidas</p>
          <span className="text-[11px] font-bold text-muted">{pendingRecords.length} abiertas</span>
        </div>

        <SidebarMetric label="Pendientes" value={formatCurrency(cashSummary.pending)} tone="warning" />
        <SidebarMetric
          label="Ingresado hoy"
          value={formatCurrency(cashSummary.total - cashSummary.pending)}
          tone="success"
        />
        <SidebarMetric label="Efectivo real" value={formatCurrency(cashSummary.court.cash + cashSummary.consumptions.cash)} />
      </section>

      <section className="mt-6 rounded-[24px] border border-line bg-white/5 p-3">
        <div className="flex items-center gap-2">
          <CalendarClock size={16} className="text-primaryStrong" />
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-muted">Turno activo</p>
        </div>

        {activeTurn ? (
          <>
            <p className="mt-3 text-sm font-extrabold text-content">{activeTurn.title}</p>
            <p className="mt-1 text-xs text-muted">{activeTurn.customerName}</p>
            <button
              type="button"
              onClick={() => navigate(`/turnos/${activeTurn.id}`)}
              className="button-secondary mt-3 flex w-full items-center justify-center gap-2 px-3 py-2 text-sm font-bold"
            >
              Abrir turno
            </button>
          </>
        ) : (
          <p className="mt-3 text-xs text-muted">Todavia no hay turnos cargados para mostrar aca.</p>
        )}
      </section>

      <section className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => navigate("/consumos")}
          className="button-secondary flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold"
        >
          <Receipt size={15} />
          Consumos
        </button>
        <button
          type="button"
          onClick={() => navigate("/caja")}
          className="button-primary flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-extrabold"
        >
          <Wallet size={15} />
          Caja
        </button>
      </section>

      <div className="mt-auto rounded-[22px] border border-line bg-white/5 px-3 py-3">
        <p className="metric-label">Vista actual</p>
        <p className="mt-1 text-sm font-extrabold text-content">{location.pathname}</p>
      </div>
    </aside>
  );
}
