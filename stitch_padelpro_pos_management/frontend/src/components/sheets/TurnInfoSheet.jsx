import { Clock3, MessageSquareText, User2, X } from "lucide-react";
import { BottomSheet } from "./BottomSheet";
import { formatCurrency } from "../../lib/format";

export function TurnInfoSheet({ turn, onClose }) {
  if (!turn) {
    return null;
  }

  return (
    <BottomSheet onClose={onClose} height="68dvh" maxHeight="78dvh">
      <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-1">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-extrabold text-content">{turn.title}</h3>
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
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primaryStrong">
              <User2 size={18} />
            </div>
            <div>
              <p className="metric-label">Cliente principal</p>
              <p className="mt-1 text-lg font-extrabold text-content">{turn.customerName}</p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-content">
              <Clock3 size={18} />
            </div>
            <div>
              <p className="metric-label">Duracion</p>
              <p className="mt-1 text-base font-bold text-content">{turn.schedule}</p>
            </div>
          </div>
        </section>

        <section className="surface-card p-3">
          <div>
            <p className="section-title">Metricas del turno</p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl bg-primary/10 p-2.5">
                <p className="metric-label text-primaryStrong">Total cancha</p>
                <p className="mt-1 text-base font-extrabold text-content">{formatCurrency(turn.courtTotal)}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-2.5">
                <p className="metric-label">Total consumos</p>
                <p className="mt-1 text-base font-extrabold text-content">
                  {formatCurrency(turn.consumptionTotal)}
                </p>
              </div>
              <div className="rounded-2xl bg-danger/12 p-2.5">
                <p className="metric-label text-danger">Pendiente</p>
                <p className="mt-1 text-base font-extrabold text-danger">{formatCurrency(turn.pendingTotal)}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-2.5">
                <p className="metric-label">Jugadores</p>
                <p className="mt-1 text-base font-extrabold text-content">{turn.players.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="surface-card p-3">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-content">
              <MessageSquareText size={18} />
            </div>
            <div>
              <p className="metric-label">Observaciones</p>
              <p className="mt-1 text-sm text-muted">
                Llegar 10 minutos antes. Juan queda pendiente de confirmar pago. Revisar agua de Ariel antes de cerrar.
              </p>
            </div>
          </div>
        </section>
      </div>
    </BottomSheet>
  );
}
