import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileSpreadsheet,
  FileText,
  Flame,
  Landmark,
  Receipt,
  Search,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import { cashAlerts, cashBreakdownDetails, cashInsights, cashSession } from "../mocks/data";
import { DesktopDataTable } from "../components/desktop/DesktopDataTable";
import { DesktopContextHeader } from "../components/desktop/DesktopContextHeader";
import { DesktopDetailPanel } from "../components/desktop/DesktopDetailPanel";
import { DesktopEmptyState } from "../components/desktop/DesktopEmptyState";
import { DesktopFilterChips } from "../components/desktop/DesktopFilterChips";
import { DesktopMetricTile } from "../components/desktop/DesktopMetricTile";
import { DesktopPanelCard } from "../components/desktop/DesktopPanelCard";
import { DesktopRowActions } from "../components/desktop/DesktopRowActions";
import { DesktopSearchField } from "../components/desktop/DesktopSearchField";
import { formatCurrency } from "../lib/format";
import { BottomSheet } from "../components/sheets/BottomSheet";
import { useTurnStore } from "../store/TurnStoreProvider";

const quickFilters = ["Hoy", "Canchas", "Consumos", "Efectivo", "Transferencia", "Pendientes"];

function getMovementTone(tone) {
  if (tone === "negative") {
    return {
      icon: ArrowDownLeft,
      accent: "text-danger",
      bg: "bg-danger/12",
      line: "bg-danger/45",
    };
  }

  if (tone === "pending") {
    return {
      icon: Clock3,
      accent: "text-warning",
      bg: "bg-warning/12",
      line: "bg-warning/45",
    };
  }

  return {
    icon: ArrowUpRight,
    accent: "text-primaryStrong",
    bg: "bg-primary/12",
    line: "bg-primary/45",
  };
}

function BreakdownCard({ title, amount, detailKey, items, expandedKey, onToggle }) {
  return (
    <section className="surface-card overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(expandedKey === detailKey ? null : detailKey)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <div>
          <p className="section-title">{title}</p>
          <p className="mt-1 text-xl font-extrabold text-content">{formatCurrency(amount)}</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-muted">
          <span>Ver detalle</span>
          {expandedKey === detailKey ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </button>

      {expandedKey === detailKey && (
        <div className="border-t border-line px-4 pb-4 pt-3">
          <div className="space-y-2.5">
            {items.map((item) => (
              <div key={item.id} className="surface-soft flex items-center justify-between gap-3 px-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-content">{item.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{item.method}</p>
                </div>
                <p className="text-sm font-extrabold text-content">{formatCurrency(item.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ExportSheet({ onClose }) {
  return (
    <BottomSheet onClose={onClose} height="42dvh" maxHeight="52dvh">
      <div className="px-4 pb-3 pt-1">
        <p className="text-2xl font-extrabold text-content">Exportar caja</p>
        <p className="mt-1 text-sm text-muted">Llevate el resumen del dia en segundos.</p>
      </div>

      <div className="space-y-2.5 px-4">
        {[
          { label: "PDF", detail: "Resumen listo para socios o administracion" },
          { label: "Excel", detail: "Movimientos y pendientes para contabilidad" },
          { label: "Compartir", detail: "Enviar resumen rapido por WhatsApp o mail" },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            className="surface-soft flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
          >
            <div>
              <p className="text-sm font-extrabold text-content">{item.label}</p>
              <p className="mt-0.5 text-xs text-muted">{item.detail}</p>
            </div>
            <ChevronRight size={16} className="text-muted" />
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}

function MetricDetailSheet({ title, subtitle, total, items, onClose, actionLabel = "Ver detalle" }) {
  return (
    <BottomSheet onClose={onClose} height="56dvh" maxHeight="68dvh">
      <div className="px-4 pb-3 pt-1">
        <p className="text-2xl font-extrabold text-content">{title}</p>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
        <p className="mt-3 text-3xl font-extrabold text-primaryStrong">{formatCurrency(total)}</p>
      </div>

      <div className="space-y-2.5 px-4">
        {items.map((item) => (
          <div key={item.id} className="surface-soft flex items-center justify-between gap-3 px-3.5 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-content">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted">{item.detail}</p>
            </div>
            <button type="button" className="button-secondary px-3 py-2 text-xs font-bold">
              {actionLabel}
            </button>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
}

function DesktopMovementTable({ movements, expandedMovementId, onToggle, currentActor }) {
  const columns = [
    {
      key: "time",
      label: "Hora",
      width: "92px",
      render: (movement) => {
        const tone = getMovementTone(movement.tone);
        const Icon = tone.icon;

        return (
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
            <div className={`flex h-8 w-8 items-center justify-center rounded-2xl ${tone.bg} ${tone.accent}`}>
              <Icon size={15} />
            </div>
            <span>{movement.time}</span>
          </div>
        );
      },
    },
    {
      key: "movement",
      label: "Movimiento",
      width: "minmax(0,1.2fr)",
      render: (movement) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-content">{movement.title}</p>
          <p className="mt-1 truncate text-xs text-muted">{movement.origin}</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            {movement.actor ?? currentActor}
          </p>
        </div>
      ),
    },
    {
      key: "method",
      label: "Metodo",
      width: "140px",
      render: (movement) => (
        <div className="flex items-center">
          <span className="rounded-full bg-white/6 px-2.5 py-1 text-xs font-bold text-content">
            {movement.method}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Categoria",
      width: "140px",
      render: (movement) => <div className="flex items-center text-sm font-bold text-muted">{movement.category}</div>,
    },
    {
      key: "amount",
      label: "Monto",
      width: "120px",
      render: (movement) => {
        const tone = getMovementTone(movement.tone);

        return (
          <div className={`flex items-center text-sm font-extrabold ${tone.accent}`}>
            {movement.amount > 0 ? "+" : ""}
            {formatCurrency(movement.amount)}
          </div>
        );
      },
    },
    {
      key: "action",
      label: "Accion",
      width: "110px",
      render: (_, { isExpanded }) => (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-muted">Ver</span>
          {isExpanded ? <ChevronDown size={15} className="text-muted" /> : <ChevronRight size={15} className="text-muted" />}
        </div>
      ),
    },
  ];

  return (
    <DesktopPanelCard
      title="Movimientos recientes"
      subtitle="Actividad operativa de caja, cobros y pendientes."
      action={
        <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primaryStrong">
          +$3.000 agregado
        </span>
      }
      bodyClassName="mt-5"
    >
      <DesktopDataTable
        columns={columns}
        rows={movements}
        getRowKey={(movement) => movement.id}
        expandedRowId={expandedMovementId}
        onToggleRow={onToggle}
        renderExpandedRow={(movement) => (
          <div className="ml-[92px] rounded-[20px] border border-line bg-app/70 px-4 py-4">
            <p className="text-sm text-muted">{movement.detail}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Registrado por {movement.actor ?? currentActor}
            </p>
            <DesktopRowActions
              className="mt-4"
              actions={[
                { label: "Ver detalle", onClick: () => {} },
                { label: "Editar", onClick: () => {} },
                { label: "Revertir", onClick: () => {} },
              ]}
            />
          </div>
        )}
      />
    </DesktopPanelCard>
  );
}

function DesktopPendingPanel({ pendingItems, totalPending, onCollect }) {
  return (
    <DesktopDetailPanel
      title="Pendientes"
      subtitle="Quien debe y que conviene cobrar ahora."
      action={<p className="text-sm font-extrabold text-danger">{formatCurrency(totalPending)}</p>}
    >

      <div className="space-y-2.5">
        {pendingItems.map((item) => (
          <div key={item.id} className="rounded-[22px] border border-line bg-white/5 px-3.5 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-extrabold text-content">{item.name}</p>
                  <span className="rounded-full bg-warning/12 px-2 py-0.5 text-[11px] font-bold text-warning">
                    {item.type}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">{item.context}</p>
              </div>
              <p className="text-sm font-extrabold text-danger">{formatCurrency(item.amount)}</p>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => onCollect(item, "Efectivo")}
                className="button-primary flex-1 px-3 py-2.5 text-xs font-extrabold"
              >
                Cobrar efectivo
              </button>
              <button
                type="button"
                onClick={() => onCollect(item, "Transferencia")}
                className="button-secondary flex-1 px-3 py-2.5 text-xs font-bold"
              >
                Transferencia
              </button>
            </div>
          </div>
        ))}

        {pendingItems.length === 0 && (
          <DesktopEmptyState
            className="min-h-[180px]"
            title="Sin pendientes visibles"
            description="No hay deudas que coincidan con el filtro actual."
          />
        )}
      </div>
    </DesktopDetailPanel>
  );
}

function DesktopAuditPanel({ recentAuditItems }) {
  return (
    <section className="surface-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-title">Auditoria reciente</p>
          <p className="mt-1 text-sm text-muted">Cambios sensibles y acciones operativas del dia.</p>
        </div>
        <span className="rounded-full bg-white/6 px-3 py-1.5 text-xs font-extrabold text-content">
          {recentAuditItems.length}
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {recentAuditItems.map((event) => (
          <div key={event.id} className="rounded-[22px] border border-line bg-white/5 px-3.5 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-content">{event.title}</p>
                <p className="mt-1 text-xs text-muted">{event.detail}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted">{event.time}</p>
                <p className="mt-1 text-xs font-bold text-content">{event.actor}</p>
              </div>
            </div>
          </div>
        ))}

        {recentAuditItems.length === 0 && (
          <DesktopEmptyState
            className="min-h-[180px]"
            title="Sin auditoria reciente"
            description="Todavia no hay acciones auditables registradas."
          />
        )}
      </div>
    </section>
  );
}

function DesktopAlertsPanel() {
  return (
    <section className="space-y-2.5">
      {cashAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`surface-card flex items-start gap-3 px-4 py-3 ${
            alert.tone === "danger"
              ? "border-danger/25"
              : alert.tone === "warning"
                ? "border-warning/25"
                : "border-info/25"
          }`}
        >
          <div
            className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${
              alert.tone === "danger"
                ? "bg-danger/12 text-danger"
                : alert.tone === "warning"
                  ? "bg-warning/12 text-warning"
                  : "bg-info/12 text-info"
            }`}
          >
            {alert.tone === "danger" ? (
              <ShieldAlert size={18} />
            ) : alert.tone === "warning" ? (
              <AlertTriangle size={18} />
            ) : (
              <Flame size={18} />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-content">{alert.title}</p>
            <p className="mt-1 text-sm text-muted">{alert.detail}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function DesktopCashControlPanel() {
  return (
    <section className="surface-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-title">Control de caja</p>
          <p className="mt-1 text-sm text-muted">Apertura, sistema esperado y caja fisica.</p>
        </div>
        <div
          className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
            cashSession.difference >= 0 ? "bg-primary/12 text-primaryStrong" : "bg-danger/12 text-danger"
          }`}
        >
          {cashSession.difference >= 0 ? "Correcto" : "Revisar"}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-[22px] border border-line bg-white/5 px-4 py-3">
          <p className="metric-label">Caja inicial</p>
          <p className="mt-1 text-base font-extrabold text-content">{formatCurrency(cashSession.opening)}</p>
        </div>
        <div className="rounded-[22px] border border-line bg-white/5 px-4 py-3">
          <p className="metric-label">Sistema</p>
          <p className="mt-1 text-base font-extrabold text-content">{formatCurrency(cashSession.systemTotal)}</p>
        </div>
        <div className="rounded-[22px] border border-line bg-white/5 px-4 py-3">
          <p className="metric-label">Caja fisica</p>
          <p className="mt-1 text-base font-extrabold text-content">{formatCurrency(cashSession.physicalTotal)}</p>
        </div>
        <div className={`rounded-[22px] px-4 py-3 ${cashSession.difference >= 0 ? "bg-primary/12" : "bg-danger/12"}`}>
          <p className={`metric-label ${cashSession.difference >= 0 ? "text-primaryStrong" : "text-danger"}`}>
            Diferencia
          </p>
          <p className={`mt-1 text-base font-extrabold ${cashSession.difference >= 0 ? "text-primaryStrong" : "text-danger"}`}>
            {cashSession.difference >= 0 ? "+" : ""}
            {formatCurrency(cashSession.difference)}
          </p>
        </div>
      </div>

      <button type="button" className="button-secondary mt-4 w-full px-4 py-3 text-sm font-bold">
        Registrar cierre
      </button>
    </section>
  );
}

function DesktopAnalytics({
  cashSummary,
  effectiveCash,
  effectiveTransfer,
  courtWidth,
  consumptionsWidth,
  expandedBreakdown,
  onToggleBreakdown,
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-title">Analisis</p>
          <p className="mt-1 text-sm text-muted">Origen, metodo y lectura secundaria del dia.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="button-secondary flex items-center gap-2 px-4 py-3 text-sm font-bold">
            <FileText size={16} />
            PDF
          </button>
          <button type="button" className="button-secondary flex items-center gap-2 px-4 py-3 text-sm font-bold">
            <FileSpreadsheet size={16} />
            Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <BreakdownCard
          title="Ingresos por cancha"
          amount={cashSummary.court.total}
          detailKey="court"
          items={cashBreakdownDetails.court}
          expandedKey={expandedBreakdown}
          onToggle={onToggleBreakdown}
        />
        <BreakdownCard
          title="Ingresos por consumos"
          amount={cashSummary.consumptions.total}
          detailKey="consumptions"
          items={cashBreakdownDetails.consumptions}
          expandedKey={expandedBreakdown}
          onToggle={onToggleBreakdown}
        />
      </div>

      <section className="surface-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="section-title">Distribucion</p>
            <p className="mt-1 text-sm text-muted">Lectura visual de cancha, consumos y metodo.</p>
          </div>
          <button type="button" className="text-sm font-bold text-muted underline underline-offset-4">
            Ver detalle
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-bold text-content">Cancha vs consumos</span>
              <span className="text-muted">{formatCurrency(cashSummary.total)}</span>
            </div>
            <div className="flex h-4 overflow-hidden rounded-full bg-white/5">
              <div className="h-full bg-primary" style={{ width: `${courtWidth}%` }} />
              <div className="h-full bg-info" style={{ width: `${consumptionsWidth}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[24px] bg-white/5 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-bold text-content">
                <Wallet size={16} className="text-primaryStrong" />
                Efectivo
              </div>
              <p className="mt-1 text-lg font-extrabold text-content">{formatCurrency(effectiveCash)}</p>
            </div>
            <div className="rounded-[24px] bg-white/5 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-bold text-content">
                <Landmark size={16} className="text-info" />
                Transferencia
              </div>
              <p className="mt-1 text-lg font-extrabold text-content">{formatCurrency(effectiveTransfer)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="section-title">Insights rapidos</p>
            <p className="mt-1 text-sm text-muted">Lectura resumida del negocio hoy.</p>
          </div>
          <Receipt size={18} className="text-primaryStrong" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {cashInsights.map((insight) => (
            <div key={insight.id} className="rounded-[24px] bg-white/5 px-4 py-3">
              <p className="metric-label">{insight.label}</p>
              <p className="mt-1 text-sm font-extrabold text-content">{insight.value}</p>
              <p className="mt-1 text-xs text-muted">{insight.meta}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

export function CashPage() {
  const { cashSummary, cashMovements, pendingRecords, collectPending, auditEvents, currentActor } =
    useTurnStore();
  const [activeFilter, setActiveFilter] = useState("Hoy");
  const [search, setSearch] = useState("");
  const [expandedMovementId, setExpandedMovementId] = useState(null);
  const [expandedBreakdown, setExpandedBreakdown] = useState(null);
  const [activeMetric, setActiveMetric] = useState(null);
  const [showExportSheet, setShowExportSheet] = useState(false);

  const filteredMovements = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return cashMovements.filter((movement) => {
      const matchesFilter =
        activeFilter === "Hoy" ||
        movement.category === activeFilter ||
        movement.method === activeFilter ||
        (activeFilter === "Pendientes" && movement.tone === "pending");

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [movement.title, movement.origin, movement.method, movement.category, movement.detail]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [activeFilter, cashMovements, search]);

  const filteredPendingItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return pendingRecords.filter((item) => {
      if (!normalizedSearch) {
        return true;
      }

      return [item.name, item.context, item.type].join(" ").toLowerCase().includes(normalizedSearch);
    });
  }, [pendingRecords, search]);

  const collectedTotal = cashSummary.total - cashSummary.pending;
  const courtWidth = cashSummary.total > 0 ? (cashSummary.court.total / cashSummary.total) * 100 : 0;
  const consumptionsWidth =
    cashSummary.total > 0 ? (cashSummary.consumptions.total / cashSummary.total) * 100 : 0;
  const effectiveCash = cashSummary.court.cash + cashSummary.consumptions.cash;
  const effectiveTransfer = cashSummary.court.transfer + cashSummary.consumptions.transfer;
  const realMoneyTotal = effectiveCash + effectiveTransfer;
  const cashPercentage = realMoneyTotal > 0 ? Math.round((effectiveCash / realMoneyTotal) * 100) : 0;
  const transferPercentage = realMoneyTotal > 0 ? Math.round((effectiveTransfer / realMoneyTotal) * 100) : 0;

  const totalDetailItems = cashMovements
    .filter((movement) => movement.amount > 0)
    .map((movement) => ({
      id: movement.id,
      title: movement.title,
      detail: `${movement.time} · ${movement.origin} · ${movement.method}`,
    }));

  const pendingDetailItems = filteredPendingItems.map((item) => ({
    id: item.id,
    title: `${item.name} · ${formatCurrency(item.amount)}`,
    detail: item.context,
  }));

  const cashDetailItems = cashMovements
    .filter((movement) => movement.method === "Efectivo")
    .map((movement) => ({
      id: movement.id,
      title: movement.title,
      detail: `${movement.time} · ${movement.origin}`,
    }));

  const transferDetailItems = cashMovements
    .filter((movement) => movement.method === "Transferencia")
    .map((movement) => ({
      id: movement.id,
      title: movement.title,
      detail: `${movement.time} · ${movement.origin}`,
    }));

  const recentAuditItems = auditEvents.slice(0, 4);

  return (
    <div className="pb-6">
      <div className="space-y-4 lg:hidden">
        <section className="surface-card overflow-hidden">
          <div className="px-4 pb-4 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-title">Total del dia</p>
                <h1 className="mt-2 text-[34px] font-extrabold leading-none text-primaryStrong">
                  {formatCurrency(cashSummary.total)}
                </h1>
                <p className="mt-2 text-sm text-muted">Ingresos totales del dia entre efectivo y transferencia.</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowExportSheet(true)}
                  className="button-secondary px-3 py-2.5 text-xs font-extrabold"
                >
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowExportSheet(true)}
                  className="button-secondary px-3 py-2.5 text-xs font-extrabold"
                >
                  Excel
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-[28px] border border-line bg-white/5 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="metric-label">Ingresado</p>
                    <p className="mt-1 text-lg font-extrabold text-content">{formatCurrency(realMoneyTotal)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveMetric("collected")}
                    className="text-sm font-bold text-muted underline underline-offset-4"
                  >
                    Ver detalle
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveMetric("cash")}
                    className="rounded-[24px] border border-primary/20 bg-primary/12 px-3.5 py-3 text-left"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-extrabold text-primaryStrong">Efectivo</p>
                      <span className="text-xs font-extrabold text-primaryStrong">{cashPercentage}%</span>
                    </div>
                    <p className="mt-1.5 text-2xl font-extrabold text-content">{formatCurrency(effectiveCash)}</p>
                    <p className="mt-1 text-xs font-bold text-muted">{`${cashPercentage}% del dinero ingresado`}</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary/12">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${cashPercentage}%` }} />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMetric("transfer")}
                    className="rounded-[24px] border border-info/20 bg-info/12 px-3.5 py-3 text-left"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-extrabold text-info">Transferencia</p>
                      <span className="text-xs font-extrabold text-info">{transferPercentage}%</span>
                    </div>
                    <p className="mt-1.5 text-2xl font-extrabold text-content">{formatCurrency(effectiveTransfer)}</p>
                    <p className="mt-1 text-xs font-bold text-muted">{`${transferPercentage}% del dinero ingresado`}</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-info/12">
                      <div className="h-full rounded-full bg-info" style={{ width: `${transferPercentage}%` }} />
                    </div>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveMetric("pending")}
                className="flex w-full items-center justify-between gap-3 rounded-[28px] border border-warning/28 bg-warning/12 px-3.5 py-3.5 text-left"
              >
                <div>
                  <p className="metric-label text-warning">Por cobrar</p>
                  <p className="mt-1 text-2xl font-extrabold text-warning">{formatCurrency(cashSummary.pending)}</p>
                  <p className="mt-1 text-xs font-bold text-warning/80">
                    Pendientes activos que todavia no entraron en caja
                  </p>
                </div>
                <span className="text-sm font-bold text-warning underline underline-offset-4">Ver pendientes</span>
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveMetric("collected")}
                className="surface-soft pressable-card px-3.5 py-3 text-left"
              >
                <p className="metric-label">Total cobrado</p>
                <p className="mt-1 text-xl font-extrabold text-content">{`+${formatCurrency(collectedTotal)}`}</p>
                <p className="mt-2 text-xs font-bold text-muted">Movimientos confirmados</p>
              </button>
              <button
                type="button"
                onClick={() => setExpandedBreakdown(expandedBreakdown ? null : "summary")}
                className="surface-soft pressable-card px-3.5 py-3 text-left"
              >
                <p className="metric-label">Resumen corto</p>
                <p className="mt-1 text-xl font-extrabold text-content">
                  {formatCurrency(cashSummary.court.total + cashSummary.consumptions.total)}
                </p>
                <p className="mt-2 text-xs font-bold text-muted">Cancha + consumos</p>
              </button>
            </div>
          </div>
        </section>

        <section className="surface-card px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-primaryStrong">
              <Search size={18} />
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar jugador, producto o turno..."
              className="w-full bg-transparent text-base font-bold text-content outline-none placeholder:text-muted"
            />
          </div>
        </section>

        <section className="surface-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="section-title">Ultimos movimientos</p>
              <p className="mt-1 text-sm text-muted">Lo ultimo que paso en caja.</p>
            </div>
            <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primaryStrong">
              +$3.000 agregado
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-3.5 py-2 text-sm font-bold ${
                  activeFilter === filter
                    ? "button-secondary rounded-full border-primary/20 bg-primary/10 text-primaryStrong"
                    : "pill-chip text-content"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {filteredMovements.map((movement, index) => {
              const tone = getMovementTone(movement.tone);
              const Icon = tone.icon;
              const isExpanded = expandedMovementId === movement.id;

              return (
                <div key={movement.id} className="relative pl-11">
                  {index < filteredMovements.length - 1 && (
                    <div className={`absolute left-[19px] top-10 h-[calc(100%-20px)] w-px ${tone.line}`} />
                  )}

                  <div
                    className={`absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-2xl ${tone.bg} ${tone.accent}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="surface-soft overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedMovementId(isExpanded ? null : movement.id)}
                      className="flex w-full items-start justify-between gap-3 px-3.5 py-3 text-left"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted">
                            {movement.time}
                          </span>
                          <span className="rounded-full bg-white/6 px-2 py-0.5 text-[11px] font-bold text-content">
                            {movement.method}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-extrabold text-content">{movement.title}</p>
                        <p className="mt-0.5 text-xs text-muted">{movement.origin}</p>
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                          {movement.actor ?? currentActor}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className={`text-base font-extrabold ${tone.accent}`}>
                          {movement.amount > 0 ? "+" : ""}
                          {formatCurrency(movement.amount)}
                        </p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-xs font-bold text-muted">
                          <span>{movement.category}</span>
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-line px-3.5 pb-3 pt-3">
                        <p className="text-sm text-muted">{movement.detail}</p>
                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                          Registrado por {movement.actor ?? currentActor}
                        </p>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <button type="button" className="button-secondary px-3 py-2 text-xs font-bold">
                            Ver detalle
                          </button>
                          <button type="button" className="button-secondary px-3 py-2 text-xs font-bold">
                            Editar
                          </button>
                          <button type="button" className="button-secondary px-3 py-2 text-xs font-bold">
                            Revertir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="surface-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="section-title">Pendientes</p>
              <p className="mt-1 text-sm text-muted">Quien debe y que conviene cobrar ahora.</p>
            </div>
            <p className="text-sm font-extrabold text-danger">{formatCurrency(cashSummary.pending)}</p>
          </div>

          <div className="mt-4 space-y-2.5">
            {filteredPendingItems.map((item) => (
              <div key={item.id} className="surface-soft flex items-center justify-between gap-3 px-3 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-extrabold text-content">{item.name}</p>
                    <span className="rounded-full bg-warning/12 px-2 py-0.5 text-[11px] font-bold text-warning">
                      {item.type}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{item.context}</p>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-sm font-extrabold text-danger">{formatCurrency(item.amount)}</p>
                  <button
                    type="button"
                    onClick={() => collectPending(item, "Efectivo")}
                    className="button-secondary px-3 py-2 text-xs font-bold"
                  >
                    Cobrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="section-title">Auditoria reciente</p>
              <p className="mt-1 text-sm text-muted">Cambios sensibles y acciones operativas del dia.</p>
            </div>
            <span className="rounded-full bg-white/6 px-3 py-1.5 text-xs font-extrabold text-content">
              {auditEvents.length}
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {recentAuditItems.map((event) => (
              <div key={event.id} className="surface-soft px-3.5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-content">{event.title}</p>
                    <p className="mt-1 text-xs text-muted">{event.detail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted">{event.time}</p>
                    <p className="mt-1 text-xs font-bold text-content">{event.actor}</p>
                  </div>
                </div>
              </div>
            ))}

            {recentAuditItems.length === 0 && (
              <div className="rounded-[24px] bg-white/5 px-3.5 py-4 text-sm text-muted">
                Todavia no hay acciones auditables registradas.
              </div>
            )}
          </div>
        </section>

        <DesktopAlertsPanel />
        <DesktopCashControlPanel />
        <DesktopAnalytics
          cashSummary={cashSummary}
          effectiveCash={effectiveCash}
          effectiveTransfer={effectiveTransfer}
          courtWidth={courtWidth}
          consumptionsWidth={consumptionsWidth}
          expandedBreakdown={expandedBreakdown}
          onToggleBreakdown={setExpandedBreakdown}
        />
      </div>

      <div className="hidden space-y-5 lg:block">
        <section className="surface-card p-5">
          <DesktopContextHeader
            eyebrow="Caja"
            title={formatCurrency(cashSummary.total)}
            description="Ingresos del dia con separacion clara entre dinero real ingresado y lo que todavia falta cobrar."
            className=""
            actions={
              <DesktopSearchField
                value={search}
                onChange={setSearch}
                placeholder="Buscar jugador, producto o turno..."
                className="min-w-[340px]"
              />
            }
          />

          <div className="mt-5 grid grid-cols-[1.1fr_1fr_1fr_0.85fr] gap-3">
            <DesktopMetricTile
              title="Ingresado"
              value={formatCurrency(realMoneyTotal)}
              detail="Cobros confirmados entre efectivo y transferencia."
              onClick={() => setActiveMetric("collected")}
            />
            <DesktopMetricTile
              title="Efectivo"
              value={formatCurrency(effectiveCash)}
              detail={`${cashPercentage}% del dinero ingresado`}
              tone="cash"
              percentage={cashPercentage}
              onClick={() => setActiveMetric("cash")}
            />
            <DesktopMetricTile
              title="Transferencia"
              value={formatCurrency(effectiveTransfer)}
              detail={`${transferPercentage}% del dinero ingresado`}
              tone="transfer"
              percentage={transferPercentage}
              onClick={() => setActiveMetric("transfer")}
            />
            <DesktopMetricTile
              title="Por cobrar"
              value={formatCurrency(cashSummary.pending)}
              detail="Deuda pendiente, aun no ingresada."
              tone="pending"
              onClick={() => setActiveMetric("pending")}
            />
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <DesktopFilterChips items={quickFilters} activeItem={activeFilter} onChange={setActiveFilter} />

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowExportSheet(true)}
                className="button-secondary flex items-center gap-2 px-4 py-3 text-sm font-bold"
              >
                <FileText size={16} />
                PDF
              </button>
              <button
                type="button"
                onClick={() => setShowExportSheet(true)}
                className="button-secondary flex items-center gap-2 px-4 py-3 text-sm font-bold"
              >
                <FileSpreadsheet size={16} />
                Excel
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-[minmax(0,1fr)_360px] gap-5">
          <div className="space-y-5">
            <DesktopMovementTable
              movements={filteredMovements}
              expandedMovementId={expandedMovementId}
              onToggle={setExpandedMovementId}
              currentActor={currentActor}
            />

            <DesktopAnalytics
              cashSummary={cashSummary}
              effectiveCash={effectiveCash}
              effectiveTransfer={effectiveTransfer}
              courtWidth={courtWidth}
              consumptionsWidth={consumptionsWidth}
              expandedBreakdown={expandedBreakdown}
              onToggleBreakdown={setExpandedBreakdown}
            />
          </div>

          <div className="space-y-5">
            <DesktopPendingPanel
              pendingItems={filteredPendingItems}
              totalPending={cashSummary.pending}
              onCollect={collectPending}
            />
            <DesktopAuditPanel recentAuditItems={recentAuditItems} />
            <DesktopAlertsPanel />
            <DesktopCashControlPanel />
          </div>
        </section>
      </div>

      {showExportSheet && <ExportSheet onClose={() => setShowExportSheet(false)} />}

      {activeMetric === "collected" && (
        <MetricDetailSheet
          title="Ingresado"
          subtitle="Cobros confirmados del dia"
          total={collectedTotal}
          items={totalDetailItems}
          onClose={() => setActiveMetric(null)}
        />
      )}

      {activeMetric === "pending" && (
        <MetricDetailSheet
          title="Pendientes"
          subtitle="Deudas activas para cobrar"
          total={cashSummary.pending}
          items={pendingDetailItems}
          onClose={() => setActiveMetric(null)}
          actionLabel="Cobrar"
        />
      )}

      {activeMetric === "cash" && (
        <MetricDetailSheet
          title="Efectivo"
          subtitle="Ingresos que impactan caja fisica"
          total={effectiveCash}
          items={cashDetailItems}
          onClose={() => setActiveMetric(null)}
        />
      )}

      {activeMetric === "transfer" && (
        <MetricDetailSheet
          title="Transferencia"
          subtitle="Ingresos cobrados por medios digitales"
          total={effectiveTransfer}
          items={transferDetailItems}
          onClose={() => setActiveMetric(null)}
        />
      )}
    </div>
  );
}
