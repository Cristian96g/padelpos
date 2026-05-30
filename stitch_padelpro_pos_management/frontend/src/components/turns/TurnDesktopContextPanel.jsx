import { DesktopDetailPanel } from "../desktop/DesktopDetailPanel";
import { formatCurrency } from "../../lib/format";
import { getPendingConsumptionTotal, getPlayerName } from "../../lib/turnStore";

function getPlayerDebt(player) {
  return player.courtDebt + getPendingConsumptionTotal(player);
}

export function TurnDesktopContextPanel({
  turn,
  selectedPlayer,
  selectedPlayerIndex,
  onOpenInfo,
  onOpenFinance,
  onOpenQuickPayment,
  onOpenAddConsumption,
}) {
  const selectedPlayerName =
    selectedPlayer && selectedPlayerIndex !== null ? getPlayerName(selectedPlayer, selectedPlayerIndex) : null;
  const selectedPlayerDebt = selectedPlayer ? getPlayerDebt(selectedPlayer) : 0;
  const playerPendingConsumptions = selectedPlayer ? getPendingConsumptionTotal(selectedPlayer) : 0;

  return (
    <DesktopDetailPanel
      title={selectedPlayerName ? selectedPlayerName : "Acciones del turno"}
      subtitle={selectedPlayerName ? "Herramientas del jugador enfocado" : turn.customerName}
      action={
        <button
          type="button"
          onClick={onOpenInfo}
          className="text-sm font-bold text-muted underline underline-offset-4"
        >
          Ver info
        </button>
      }
      className="h-full"
    >
      <div className="space-y-3">
        {selectedPlayer ? (
          <>
            <div className="rounded-[22px] border border-danger/20 bg-danger/10 px-4 py-3">
              <p className="metric-label text-danger">Debe ahora</p>
              <p className="mt-1 text-xl font-extrabold text-danger">
                {selectedPlayerDebt > 0 ? formatCurrency(selectedPlayerDebt) : "OK"}
              </p>
              <p className="mt-2 text-sm text-warning">
                {playerPendingConsumptions > 0
                  ? `Consumo pendiente ${formatCurrency(playerPendingConsumptions)}`
                  : "Sin consumo pendiente"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={onOpenQuickPayment}
                className="button-primary w-full px-4 py-3 text-sm font-extrabold"
              >
                Cobrar jugador
              </button>
              <button
                type="button"
                onClick={onOpenAddConsumption}
                className="button-secondary w-full px-4 py-3 text-sm font-bold"
              >
                Agregar consumo
              </button>
              <button
                type="button"
                onClick={onOpenFinance}
                className="button-secondary w-full px-4 py-3 text-sm font-bold"
              >
                Ver resumen financiero
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-[22px] border border-line bg-white/5 px-4 py-3">
              <p className="metric-label">Turno activo</p>
              <p className="mt-1 text-xl font-extrabold text-content">{turn.title}</p>
              <p className="mt-2 text-sm text-muted">
                {turn.players.length} jugadores - Debe {formatCurrency(turn.pendingTotal)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={onOpenQuickPayment}
                className="button-primary w-full px-4 py-3 text-sm font-extrabold"
              >
                Registrar pago
              </button>
              <button
                type="button"
                onClick={onOpenAddConsumption}
                className="button-secondary w-full px-4 py-3 text-sm font-bold"
              >
                Agregar consumo
              </button>
              <button
                type="button"
                onClick={onOpenFinance}
                className="button-secondary w-full px-4 py-3 text-sm font-bold"
              >
                Ver resumen financiero
              </button>
            </div>
          </>
        )}
      </div>
    </DesktopDetailPanel>
  );
}
