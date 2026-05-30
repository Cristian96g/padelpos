import { Pencil } from "lucide-react";
import { formatCurrency } from "../../lib/format";
import { StatusBadge } from "../ui/StatusBadge";

export function PlayerCard({ player }) {
  const hasConsumptions = player.consumptions.length > 0;

  return (
    <article className="surface-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold text-content">{player.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="pill-chip text-primaryStrong">{`Cancha ${formatCurrency(player.courtShare)}`}</span>
            {hasConsumptions ? (
              <span className="pill-chip text-danger">
                {`Consumos ${formatCurrency(
                  player.consumptions.reduce((acc, item) => acc + item.price * item.quantity, 0),
                )}`}
              </span>
            ) : (
              <span className="pill-chip text-muted">Sin consumos</span>
            )}
          </div>
        </div>
        <StatusBadge status={player.courtStatus}>
          {player.courtDebt > 0 ? `Debe ${formatCurrency(player.courtDebt)}` : "OK"}
        </StatusBadge>
      </div>

      <div className="mt-4 rounded-3xl bg-white/4 p-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="metric-label">Pago de cancha</p>
            <p className="mt-1 text-base font-extrabold text-content">
              {formatCurrency(player.courtShare)} por jugador
            </p>
          </div>
          <StatusBadge status={player.courtStatus}>{player.courtMethod}</StatusBadge>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button className="rounded-2xl border border-line bg-white/5 px-3 py-3 text-sm font-bold text-content">
            Efectivo
          </button>
          <button className="rounded-2xl bg-primary px-3 py-3 text-sm font-extrabold text-[#13210c]">
            Transfer.
          </button>
          <button className="rounded-2xl border border-warning/30 bg-warning/12 px-3 py-3 text-sm font-bold text-warning">
            Pendiente
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-3xl bg-white/4 p-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="metric-label">Consumos</p>
          <button className="pill-chip text-content">+ Agregar</button>
        </div>

        {hasConsumptions ? (
          <div className="space-y-2">
            {player.consumptions.map((consumption) => (
              <div
                key={consumption.id}
                className="flex items-center justify-between rounded-2xl bg-panelStrong px-3 py-3"
              >
                <div>
                  <p className="font-bold text-content">{consumption.name}</p>
                  <p className="text-sm text-muted">
                    {`${formatCurrency(consumption.price)} · ${consumption.quantity} un.`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={consumption.status}>{consumption.method}</StatusBadge>
                  <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-white/5 text-content">
                    <Pencil size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-panelStrong px-3 py-4 text-sm text-muted">
            Todavia no tiene consumos cargados.
          </div>
        )}
      </div>
    </article>
  );
}
