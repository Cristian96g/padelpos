import { ChevronRight, X } from "lucide-react";
import { BottomSheet } from "./BottomSheet";
import { formatCurrency } from "../../lib/format";

export function TurnFinanceSheet({ turn, onClose }) {
  if (!turn) {
    return null;
  }

  const cashTotal = turn.summary.courtCash + turn.summary.consumptionCash;
  const transferTotal = turn.summary.courtTransfer + turn.summary.consumptionTransfer;

  return (
    <BottomSheet onClose={onClose} height="70dvh" maxHeight="80dvh">
      <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-1">
        <div className="min-w-0">
          <h3 className="text-2xl font-extrabold text-content">{formatCurrency(turn.grandTotal)}</h3>
          <p className="mt-1 text-sm font-bold text-danger">{`Debe ${formatCurrency(turn.pendingTotal)}`}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="button-secondary flex h-9 w-9 items-center justify-center border-0 text-content"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-3 px-4">
        <section className="surface-card p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5">
              <p className="text-sm font-bold text-content">💵 Cancha</p>
              <p className="text-sm font-extrabold text-content">
                {formatCurrency(turn.summary.courtCash + turn.summary.courtTransfer)}
              </p>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5">
              <p className="text-sm font-bold text-content">🥤 Consumos</p>
              <p className="text-sm font-extrabold text-content">
                {formatCurrency(turn.summary.consumptionCash + turn.summary.consumptionTransfer)}
              </p>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5">
              <p className="text-sm font-bold text-content">🏦 Transferencia</p>
              <p className="text-sm font-extrabold text-content">{formatCurrency(transferTotal)}</p>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5">
              <p className="text-sm font-bold text-content">💵 Efectivo</p>
              <p className="text-sm font-extrabold text-content">{formatCurrency(cashTotal)}</p>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-danger/12 px-3 py-2.5">
              <p className="text-sm font-bold text-danger">⚠ Pendiente</p>
              <p className="text-sm font-extrabold text-danger">{formatCurrency(turn.pendingTotal)}</p>
            </div>
          </div>
        </section>

        <section className="surface-card p-3">
          <p className="section-title">Movimientos</p>
          <div className="mt-3 space-y-2">
            {turn.movements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between rounded-2xl bg-panelStrong px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-content">{movement.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{movement.meta}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-extrabold text-content">{formatCurrency(movement.amount)}</p>
                  <ChevronRight size={16} className="text-muted" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </BottomSheet>
  );
}
