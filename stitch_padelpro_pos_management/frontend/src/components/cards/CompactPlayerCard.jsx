import { ChevronRight } from "lucide-react";
import { formatCurrency } from "../../lib/format";

function getPlayerName(player, index) {
  return player.name?.trim() ? player.name : `Jugador ${index + 1}`;
}

function getConsumptionCount(player) {
  return player.consumptions.reduce((acc, item) => acc + item.quantity, 0);
}

function getConsumptionDebt(player) {
  return player.consumptions.reduce((acc, item) => {
    if (item.status === "debt") {
      return acc + item.price * item.quantity;
    }

    return acc;
  }, 0);
}

function getPlayerDebt(player) {
  return player.courtDebt + getConsumptionDebt(player);
}

function getCourtStatusLabel(player) {
  const consumptionDebt = getConsumptionDebt(player);

  if (player.courtDebt > 0 && consumptionDebt > 0) {
    return "Cancha + consumo";
  }

  if (player.courtDebt > 0) {
    return "Cancha pendiente";
  }

  if (consumptionDebt > 0) {
    return "Consumo pendiente";
  }

  if (player.courtStatus === "paid") {
    return "Pagado";
  }

  if (player.courtStatus === "partial") {
    return "Parcial";
  }

  return "Pendiente";
}

export function CompactPlayerCard({ player, index, onOpen }) {
  const playerName = getPlayerName(player, index);
  const debt = getPlayerDebt(player);
  const consumptionCount = getConsumptionCount(player);
  const debtLabel = debt > 0 ? `Debe ${formatCurrency(debt)}` : "OK";
  const statusLabel = getCourtStatusLabel(player);

  return (
    <button
      type="button"
      onClick={() => onOpen(player, index)}
      className="surface-card pressable-card group flex w-full items-center gap-3 px-3.5 py-3 text-left"
    >
      <div
        className={`h-10 w-1 shrink-0 rounded-full ${
          debt > 0
            ? "bg-danger debt-pulse shadow-[0_0_18px_rgba(255,107,107,0.35)]"
            : "bg-primary shadow-glow"
        }`}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-[15px] font-extrabold text-content">{playerName}</h3>
          <p className={`text-sm font-extrabold ${debt > 0 ? "text-danger" : "text-primaryStrong"}`}>
            {debtLabel}
          </p>
        </div>

        <div className="mt-1.5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-[13px] text-muted">
            <span className="truncate">{statusLabel}</span>
            <span className="h-1 w-1 rounded-full bg-white/25" />
            <span className="truncate">{consumptionCount} consumos</span>
          </div>

          <div className="flex h-7 w-7 items-center justify-center rounded-2xl border border-line bg-white/5 text-muted transition-transform duration-200 group-active:translate-x-0.5">
            <ChevronRight size={15} />
          </div>
        </div>
      </div>
    </button>
  );
}
