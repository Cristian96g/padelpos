import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CircleAlert,
  CreditCard,
  Plus,
  Receipt,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DesktopContextHeader } from "../components/desktop/DesktopContextHeader";
import { DesktopDetailPanel } from "../components/desktop/DesktopDetailPanel";
import { DesktopMetricTile } from "../components/desktop/DesktopMetricTile";
import { DesktopPanelCard } from "../components/desktop/DesktopPanelCard";
import { dashboardStats, homeAlerts, nextBookings } from "../mocks/data";
import { formatCurrency } from "../lib/format";
import { StatusBadge } from "../components/ui/StatusBadge";

const quickActions = [
  { label: "Nuevo turno", to: "/turnos", icon: Plus, tone: "primary" },
  { label: "Cobrar", to: "/turnos", icon: Wallet, tone: "default" },
  { label: "Consumo", to: "/consumos", icon: Receipt, tone: "default" },
];

const activeBooking = nextBookings[0] ?? null;

function MobileDashboardView() {
  return (
    <div className="space-y-3 pb-4 lg:hidden">
      <section className="surface-card px-4 py-4">
        <p className="section-title">Hoy</p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-extrabold text-content">{formatCurrency(dashboardStats.totalDay)}</h2>
            <div className="mt-1.5 flex items-center gap-2 text-sm">
              <span className="font-extrabold text-danger">{`Debe ${formatCurrency(dashboardStats.pending)}`}</span>
              <span className="h-1 w-1 rounded-full bg-white/25" />
              <span className="text-muted">{`${formatCurrency(dashboardStats.cash)} efectivo`}</span>
            </div>
          </div>
          <button className="button-secondary flex h-11 w-11 items-center justify-center border-0">
            <CircleAlert size={18} />
          </button>
        </div>
      </section>

      <section className="surface-card px-4 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-danger" />
            <p className="section-title text-danger">Alertas y deudas</p>
          </div>
          <Link to="/turnos" className="text-sm font-bold text-muted underline underline-offset-4">
            Ver turnos
          </Link>
        </div>

        <div className="mt-3 space-y-2">
          {homeAlerts.map((alert) => (
            <Link
              key={alert.id}
              to="/turnos"
              className={`pressable-card flex items-center justify-between rounded-3xl px-3.5 py-3 ${
                alert.tone === "debt" ? "bg-danger/10" : "bg-white/5"
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-content">{alert.title}</p>
                <p className="mt-0.5 truncate text-[13px] text-muted">{alert.subtitle}</p>
              </div>
              <div className="ml-3 shrink-0 text-right">
                <p className={`text-sm font-extrabold ${alert.tone === "debt" ? "text-danger" : "text-warning"}`}>
                  {alert.detail}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2.5">
        {quickActions.map(({ label, to, icon: Icon, tone }) => (
          <Link
            key={label}
            to={to}
            className={`surface-card pressable-card flex min-h-[88px] flex-col items-start justify-between px-3.5 py-3 ${
              tone === "primary" ? "bg-primary/12" : ""
            }`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
                tone === "primary" ? "bg-primary text-[#13210c]" : "bg-white/5 text-content"
              }`}
            >
              <Icon size={17} />
            </div>
            <p className={`text-sm font-extrabold ${tone === "primary" ? "text-primaryStrong" : "text-content"}`}>
              {label}
            </p>
          </Link>
        ))}
      </section>

      <section className="surface-card px-4 py-3.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-title">Caja de hoy</p>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-muted">
              <span>{`Cancha ${formatCurrency(dashboardStats.courtIncome)}`}</span>
              <span className="h-1 w-1 rounded-full bg-white/25" />
              <span>{`Consumos ${formatCurrency(dashboardStats.consumptionIncome)}`}</span>
            </div>
          </div>
          <Link to="/caja" className="text-sm font-bold text-muted underline underline-offset-4">
            Ver caja
          </Link>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="section-title">Proximos turnos</p>
          <Link to="/turnos" className="text-sm font-bold text-muted underline underline-offset-4">
            Ver todos
          </Link>
        </div>

        {nextBookings.map((booking) => (
          <Link
            key={booking.id}
            to="/turnos"
            className="surface-card pressable-card flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-[15px] font-extrabold text-content">{`${booking.time} - ${booking.court}`}</p>
              <div className="mt-1 flex items-center gap-2 text-[13px] text-muted">
                <span className="truncate">{booking.customerName}</span>
                <span className="h-1 w-1 rounded-full bg-white/25" />
                <span>{booking.players > 0 ? `${booking.players} jugadores` : "Libre"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={booking.status}>
                {booking.status === "paid"
                  ? "Pagado"
                  : booking.status === "debt"
                    ? "Deuda"
                    : "Pendiente"}
              </StatusBadge>
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl border border-line bg-white/5 text-muted">
                <ArrowRight size={15} />
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

function DesktopFinancialSummary() {
  const paymentBase = dashboardStats.cash + dashboardStats.transfer;
  const cashShare = paymentBase > 0 ? Math.round((dashboardStats.cash / paymentBase) * 100) : 0;
  const transferShare = paymentBase > 0 ? 100 - cashShare : 0;

  return (
    <section className="grid grid-cols-4 gap-3">
      <DesktopMetricTile
        title="Total ingresado hoy"
        value={formatCurrency(dashboardStats.totalDay)}
        tone="neutral"
        detail="Dinero registrado hoy"
      />
      <DesktopMetricTile
        title="Efectivo"
        value={formatCurrency(dashboardStats.cash)}
        tone="cash"
        detail={`${cashShare}% del dinero ingresado`}
      />
      <DesktopMetricTile
        title="Transferencias"
        value={formatCurrency(dashboardStats.transfer)}
        tone="transfer"
        detail={`${transferShare}% del dinero ingresado`}
      />
      <DesktopMetricTile
        title="Por cobrar"
        value={formatCurrency(dashboardStats.pending)}
        tone="pending"
        detail="Pendientes por cobrar"
      />
    </section>
  );
}

function DesktopQuickActions() {
  return (
    <DesktopPanelCard title="Acciones rapidas" subtitle="Atajos operativos del dia">
      <div className="grid grid-cols-3 gap-2.5">
        {quickActions.map(({ label, to, icon: Icon, tone }) => (
          <Link
            key={label}
            to={to}
            className={`pressable-card flex items-center gap-3 rounded-[20px] border border-line px-3.5 py-3 transition-all ${
              tone === "primary" ? "bg-primary/10" : "bg-white/5 hover:bg-white/[0.06]"
            }`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
                tone === "primary" ? "bg-primary text-[#13210c]" : "bg-white/5 text-content"
              }`}
            >
              <Icon size={16} />
            </div>
            <span className={`text-sm font-extrabold ${tone === "primary" ? "text-primaryStrong" : "text-content"}`}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </DesktopPanelCard>
  );
}

function DesktopActiveTurn() {
  if (!activeBooking) {
    return null;
  }

  return (
    <DesktopDetailPanel
      title="Turno activo"
      subtitle="Acceso principal para seguir operando"
      action={
        <StatusBadge status={activeBooking.status}>
          {activeBooking.status === "paid"
            ? "Pagado"
            : activeBooking.status === "debt"
              ? "Deuda"
              : "Pendiente"}
        </StatusBadge>
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-content">{`${activeBooking.time} - ${activeBooking.court}`}</h2>
          <p className="mt-1 truncate text-sm text-muted">{activeBooking.customerName}</p>
          <div className="mt-3 flex items-center gap-2 text-[12px] text-muted">
            <span>{activeBooking.players > 0 ? `${activeBooking.players} jugadores` : "Libre"}</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>{activeBooking.status === "debt" ? "Requiere cobro" : "Listo para abrir"}</span>
          </div>
        </div>

        <div className="text-right">
          <p className="metric-label">Estado</p>
          <p className={`mt-1 text-lg font-extrabold ${activeBooking.status === "debt" ? "text-danger" : "text-primaryStrong"}`}>
            {activeBooking.status === "debt" ? formatCurrency(dashboardStats.pending / 3) : "OK"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2.5">
        <Link
          to="/turnos"
          className="button-primary flex items-center justify-center gap-2 px-4 py-3 text-sm font-extrabold"
        >
          <Wallet size={16} />
          Abrir turno
        </Link>
        <Link
          to="/turnos"
          className="button-secondary flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold"
        >
          <CreditCard size={16} />
          Cobrar
        </Link>
      </div>
    </DesktopDetailPanel>
  );
}

function DesktopUpcomingTurns() {
  return (
    <DesktopPanelCard
      title="Turnos siguientes"
      subtitle="Agenda operativa despues del turno en foco"
      action={
        <Link to="/turnos" className="text-sm font-bold text-muted underline underline-offset-4">
          Ver todos
        </Link>
      }
    >
      <div className="space-y-2.5">
        {nextBookings.slice(1).map((booking) => (
          <Link
            key={booking.id}
            to="/turnos"
            className="pressable-card flex items-center justify-between gap-4 rounded-[20px] border border-line bg-white/5 px-4 py-3 transition-all hover:bg-white/[0.06]"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-extrabold text-content">{`${booking.time} - ${booking.court}`}</p>
                <StatusBadge status={booking.status}>
                  {booking.status === "paid"
                    ? "Pagado"
                    : booking.status === "debt"
                      ? "Deuda"
                      : "Pendiente"}
                </StatusBadge>
              </div>
              <p className="mt-0.5 truncate text-sm text-muted">{booking.customerName}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                  {booking.players > 0 ? `${booking.players} jug.` : "Libre"}
                </p>
                <p
                  className={`mt-0.5 text-sm font-extrabold ${
                    booking.status === "debt" ? "text-danger" : "text-primaryStrong"
                  }`}
                >
                  {booking.status === "debt" ? formatCurrency(dashboardStats.pending / 3) : "OK"}
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-line bg-white/5 text-muted">
                <ArrowRight size={15} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DesktopPanelCard>
  );
}

function DesktopRecentActivity() {
  const activityItems = [
    {
      id: "activity-1",
      title: "Cancha 1 cobrada por transferencia",
      meta: "20:12 · Turno Román",
      amount: formatCurrency(24000),
      tone: "text-primaryStrong",
    },
    {
      id: "activity-2",
      title: "Consumo registrado en mostrador",
      meta: "20:18 · Efectivo",
      amount: formatCurrency(3000),
      tone: "text-content",
    },
    {
      id: "activity-3",
      title: "Pendiente generado para Juan",
      meta: "20:25 · Cancha 1",
      amount: formatCurrency(6000),
      tone: "text-warning",
    },
  ];

  return (
    <DesktopPanelCard title="Actividad reciente" subtitle="Movimiento operativo del dia">
      <div className="space-y-2.5">
        {activityItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-[18px] border border-line bg-white/5 px-3.5 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-content">{item.title}</p>
              <p className="mt-0.5 text-[12px] text-muted">{item.meta}</p>
            </div>
            <p className={`shrink-0 text-sm font-extrabold ${item.tone}`}>{item.amount}</p>
          </div>
        ))}
      </div>
    </DesktopPanelCard>
  );
}

function DesktopAttentionRail() {
  return (
    <div className="space-y-4">
      <DesktopDetailPanel
        title="Atencion inmediata"
        subtitle="Alertas y deuda que requieren intervencion"
        action={<CircleAlert size={16} className="text-warning" />}
      >
        <div className="space-y-2.5">
          {homeAlerts.slice(0, 3).map((alert) => (
            <Link
              key={alert.id}
              to="/turnos"
              className={`pressable-card flex items-start justify-between gap-3 rounded-[18px] border border-line px-3.5 py-3 ${
                alert.tone === "debt" ? "bg-danger/10" : "bg-white/5"
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-content">{alert.title}</p>
                <p className="mt-0.5 text-[12px] text-muted">{alert.subtitle}</p>
              </div>
              <p className={`shrink-0 text-sm font-extrabold ${alert.tone === "debt" ? "text-danger" : "text-warning"}`}>
                {alert.detail}
              </p>
            </Link>
          ))}
        </div>
      </DesktopDetailPanel>

      <DesktopPanelCard
        title="Pendientes cobrables"
        subtitle="Deuda lista para resolver"
        action={
          <Link to="/caja" className="text-sm font-bold text-muted underline underline-offset-4">
            Ir a caja
          </Link>
        }
      >
        <div className="space-y-2.5">
          {homeAlerts
            .filter((alert) => alert.tone === "debt")
            .slice(0, 2)
            .map((alert) => (
              <div key={alert.id} className="rounded-[18px] border border-line bg-white/5 px-3.5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-content">{alert.title}</p>
                    <p className="mt-0.5 text-[12px] text-muted">{alert.subtitle}</p>
                  </div>
                  <p className="shrink-0 text-sm font-extrabold text-danger">{alert.detail}</p>
                </div>
                <Link
                  to="/caja"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-primaryStrong"
                >
                  Cobrar ahora
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}
        </div>
      </DesktopPanelCard>

      <DesktopPanelCard title="Caja de hoy" subtitle="Lectura corta del cierre parcial">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 rounded-[18px] border border-line bg-white/5 px-3.5 py-2.5">
            <span className="text-sm font-bold text-muted">Cancha</span>
            <span className="text-sm font-extrabold text-content">{formatCurrency(dashboardStats.courtIncome)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-[18px] border border-line bg-white/5 px-3.5 py-2.5">
            <span className="text-sm font-bold text-muted">Consumos</span>
            <span className="text-sm font-extrabold text-content">{formatCurrency(dashboardStats.consumptionIncome)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-[18px] border border-line bg-primary/10 px-3.5 py-2.5">
            <span className="text-sm font-bold text-muted">Efectivo real</span>
            <span className="text-sm font-extrabold text-primaryStrong">{formatCurrency(dashboardStats.cash)}</span>
          </div>
        </div>
      </DesktopPanelCard>
    </div>
  );
}

function DesktopDashboardView() {
  return (
    <div className="hidden min-h-[calc(100vh-180px)] flex-col gap-4 lg:flex">
      <DesktopContextHeader
        eyebrow="Inicio"
        title="Centro operativo"
        description="Entiende el dia en segundos, detecta deuda y abre rapido el flujo que necesita atencion."
      />

      <DesktopFinancialSummary />

      <section className="grid min-h-0 grid-cols-[minmax(0,1fr)_320px] gap-4">
        <div className="space-y-4">
          <DesktopActiveTurn />
          <DesktopQuickActions />
          <DesktopUpcomingTurns />
          <DesktopRecentActivity />
        </div>

        <DesktopAttentionRail />
      </section>
    </div>
  );
}

export function DashboardPage() {
  return (
    <>
      <MobileDashboardView />
      <DesktopDashboardView />
    </>
  );
}
