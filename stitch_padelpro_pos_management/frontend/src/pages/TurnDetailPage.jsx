import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Receipt,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CompactPlayerCard } from "../components/cards/CompactPlayerCard";
import { DesktopActionBar } from "../components/desktop/DesktopActionBar";
import { DesktopContextHeader } from "../components/desktop/DesktopContextHeader";
import { DesktopDetailPanel } from "../components/desktop/DesktopDetailPanel";
import { DesktopPanelCard } from "../components/desktop/DesktopPanelCard";
import { PlayerDetailSheet } from "../components/sheets/PlayerDetailSheet";
import { TurnFinanceSheet } from "../components/sheets/TurnFinanceSheet";
import { TurnInfoSheet } from "../components/sheets/TurnInfoSheet";
import { BottomSheet } from "../components/sheets/BottomSheet";
import { StatusBadge } from "../components/ui/StatusBadge";
import { formatCurrency } from "../lib/format";
import { getPendingConsumptionTotal, getPlayerName } from "../lib/turnStore";
import { useTurn } from "../store/TurnStoreProvider";

function getPlayerDebt(player) {
  return player.courtDebt + getPendingConsumptionTotal(player);
}

function getConsumptionTotal(player) {
  return player.consumptions.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

function getPlayerStatus(player) {
  const pendingConsumptions = getPendingConsumptionTotal(player);

  if (player.courtDebt > 0 && pendingConsumptions > 0) {
    return "Cancha + consumo";
  }

  if (player.courtDebt > 0) {
    return "Cancha pendiente";
  }

  if (pendingConsumptions > 0) {
    return "Consumo pendiente";
  }

  return "Pagado";
}

function getMovementLabel(movement) {
  return movement.meta ?? movement.detail ?? "Hace instantes";
}

function StatusSummary({ children, tone = "success" }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-[22px] px-3 py-3 ${
        tone === "success" ? "bg-primary/12 text-primaryStrong" : "bg-warning/12 text-warning"
      }`}
    >
      <CheckCircle2 size={17} />
      <p className="text-sm font-bold">{children}</p>
    </div>
  );
}

function MethodButtons({ selectedMethod, onSelect, pendingLabel = "Pendiente", options }) {
  const methods = options ?? ["Efectivo", "Transferencia", pendingLabel];

  return (
    <div className={`grid gap-2 ${methods.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
      {methods.map((method) => {
        const isPending = method === pendingLabel;
        const isActive = selectedMethod === method;

        return (
          <button
            key={method}
            type="button"
            onClick={() => onSelect(method)}
            className={`px-3 py-2.5 text-sm font-bold ${
              isPending
                ? isActive
                  ? "rounded-2xl border border-warning/40 bg-warning/16 text-warning"
                  : "rounded-2xl border border-warning/25 bg-warning/10 text-warning"
                : isActive
                  ? "button-primary"
                  : "button-secondary"
            }`}
          >
            {method === "Transferencia" ? "Transfer." : method}
          </button>
        );
      })}
    </div>
  );
}

function AddConsumptionSheet({ turn, onClose, onSelectTarget }) {
  return (
    <BottomSheet onClose={onClose} fitContent maxHeight="72dvh">
      <div className="px-4 pb-3 pt-1">
        <p className="text-2xl font-extrabold text-content">Agregar consumo</p>
        <p className="mt-1 text-sm text-muted">A quien queres asociar el consumo?</p>
      </div>

      <div className="space-y-3 px-4 pb-2">
        <div>
          <p className="section-title">Jugadores del turno</p>
          <div className="mt-2 space-y-2">
            {turn.players.map((player, index) => (
              <button
                key={player.id}
                type="button"
                onClick={() =>
                  onSelectTarget({
                    type: "player",
                    playerId: player.id,
                    playerName: getPlayerName(player, index),
                    label: getPlayerName(player, index),
                    saleTarget: getPlayerName(player, index),
                  })
                }
                className="surface-soft flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-content">{getPlayerName(player, index)}</p>
                  <p className="mt-0.5 text-xs text-muted">Asociar consumo directo al jugador</p>
                </div>
                <ChevronRight size={16} className="text-muted" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() =>
              onSelectTarget({
                type: "visitor",
                label: "Visitante",
                saleTarget: "Visitante",
              })
            }
            className="surface-soft flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left"
          >
            <div>
              <p className="text-sm font-extrabold text-content">Visitante</p>
              <p className="mt-0.5 text-xs text-muted">Registrar consumo para alguien fuera del turno</p>
            </div>
            <UserRound size={16} className="text-muted" />
          </button>

          <button
            type="button"
            onClick={() =>
              onSelectTarget({
                type: "general",
                label: "Caja general",
                saleTarget: "Caja general",
              })
            }
            className="surface-soft flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left"
          >
            <div>
              <p className="text-sm font-extrabold text-content">Caja general</p>
              <p className="mt-0.5 text-xs text-muted">Venta sin asociar a jugador</p>
            </div>
            <Receipt size={16} className="text-muted" />
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

function QuickPaymentSheet({
  turn,
  selectedPlayerIndex,
  onSelectPlayer,
  selectedMethod,
  onSelectMethod,
  onConfirm,
  onClose,
}) {
  const debtPlayers = turn.players
    .map((player, index) => {
      const pending = getPlayerDebt(player);
      return { player, index, pending };
    })
    .filter((item) => item.pending > 0);

  return (
    <BottomSheet onClose={onClose} height="62dvh" maxHeight="72dvh">
      <div className="px-4 pb-3 pt-1">
        <p className="text-2xl font-extrabold text-content">Registrar pago</p>
        <p className="mt-1 text-sm text-muted">Elegi jugador y metodo para cobrar rapido.</p>
      </div>

      <div className="space-y-3 px-4">
        <div>
          <p className="section-title">Jugadores con deuda</p>
          <div className="mt-2 space-y-2">
            {debtPlayers.map(({ player, index, pending }) => (
              <button
                key={player.id}
                type="button"
                onClick={() => onSelectPlayer(index)}
                className={`w-full rounded-[24px] px-3.5 py-3 text-left ${
                  selectedPlayerIndex === index
                    ? "border border-primary/25 bg-primary/10"
                    : "border border-line bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-content">{getPlayerName(player, index)}</p>
                    <p className="mt-0.5 text-xs text-muted">{getPlayerStatus(player)}</p>
                  </div>
                  <p className="text-sm font-extrabold text-danger">{formatCurrency(pending)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="section-title">Como paga</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {["Efectivo", "Transferencia", "Mixto", "Pendiente"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => onSelectMethod(method)}
                className={`px-3 py-3 text-sm font-bold ${
                  selectedMethod === method
                    ? method === "Pendiente"
                      ? "rounded-2xl border border-warning/40 bg-warning/16 text-warning"
                      : "button-primary"
                    : method === "Pendiente"
                      ? "rounded-2xl border border-warning/25 bg-warning/10 text-warning"
                      : "button-secondary"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={selectedPlayerIndex === null || !selectedMethod}
          className="button-primary w-full rounded-3xl px-4 py-3 text-sm font-extrabold disabled:opacity-50"
        >
          Confirmar pago
        </button>
      </div>
    </BottomSheet>
  );
}

function DesktopPlayerRow({ player, index, selected, onSelect }) {
  const debt = getPlayerDebt(player);
  const consumptionCount = player.consumptions.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      className={`w-full rounded-[20px] border px-3.5 py-2.5 text-left transition-all duration-200 ${
        selected ? "border-primary/20 bg-primary/10" : "border-line bg-white/5 hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-content">{getPlayerName(player, index)}</p>
          <p className="mt-0.5 text-xs text-muted">{getPlayerStatus(player)}</p>
        </div>
        <p className={`text-sm font-extrabold ${debt > 0 ? "text-danger" : "text-primaryStrong"}`}>
          {debt > 0 ? formatCurrency(debt) : "OK"}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-muted">
        <span>{consumptionCount} consumos</span>
        <span>{player.courtMethod}</span>
      </div>
    </button>
  );
}

function DesktopPlayerDetail({
  player,
  playerIndex,
  movements,
  onPayAll,
  onPayCourt,
  onPayConsumptions,
  onAddConsumption,
}) {
  const playerName = getPlayerName(player, playerIndex);
  const consumptionTotal = getConsumptionTotal(player);
  const pendingConsumptions = getPendingConsumptionTotal(player);
  const pendingTotal = getPlayerDebt(player);
  const grandTotal = player.courtShare + consumptionTotal;
  const [showPayAllMethods, setShowPayAllMethods] = useState(false);
  const [payAllMethod, setPayAllMethod] = useState(null);
  const [mixedCourtMethod, setMixedCourtMethod] = useState("Efectivo");
  const [mixedConsumptionMethod, setMixedConsumptionMethod] = useState("Transferencia");
  const [courtDraftMethod, setCourtDraftMethod] = useState(null);
  const [consumptionDraftMethod, setConsumptionDraftMethod] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showCourtEditor, setShowCourtEditor] = useState(false);
  const [showConsumptionEditor, setShowConsumptionEditor] = useState(false);

  useEffect(() => {
    setShowPayAllMethods(false);
    setPayAllMethod(null);
    setMixedCourtMethod("Efectivo");
    setMixedConsumptionMethod("Transferencia");
    setCourtDraftMethod(null);
    setConsumptionDraftMethod(null);
    setFeedback(null);
    setShowCourtEditor(false);
    setShowConsumptionEditor(false);
  }, [player.id]);

  const isCourtPaid = player.courtStatus === "paid";
  const hasConsumptions = player.consumptions.length > 0;
  const areConsumptionsPaid = hasConsumptions ? pendingConsumptions === 0 : true;
  const isEverythingPaid = isCourtPaid && areConsumptionsPaid;

  useEffect(() => {
    if (isEverythingPaid) {
      setShowPayAllMethods(false);
      setPayAllMethod(null);
    }

    if (isCourtPaid) {
      setCourtDraftMethod(null);
      setShowCourtEditor(false);
    }

    if (areConsumptionsPaid) {
      setConsumptionDraftMethod(null);
      setShowConsumptionEditor(false);
    }
  }, [areConsumptionsPaid, isCourtPaid, isEverythingPaid]);

  function handlePayAllConfirm() {
    if (!payAllMethod) {
      return;
    }

    if (payAllMethod === "Mixto") {
      onPayAll("Mixto", {
        courtMethod: mixedCourtMethod,
        consumptionMethod: mixedConsumptionMethod,
      });
      setFeedback({
        tone: "success",
        message: "Pago mixto registrado correctamente",
      });
    } else {
      onPayAll(payAllMethod);
      setFeedback({
        tone: payAllMethod === "Pendiente" ? "warning" : "success",
        message:
          payAllMethod === "Pendiente"
            ? "Jugador marcado como pendiente"
            : `Pago total registrado en ${payAllMethod.toLowerCase()}`,
      });
    }

    setShowPayAllMethods(false);
    setPayAllMethod(null);
  }

  function handleCourtConfirm() {
    if (!courtDraftMethod) {
      return;
    }

    onPayCourt(courtDraftMethod);
    setFeedback({
      tone: courtDraftMethod === "Pendiente" ? "warning" : "success",
      message:
        courtDraftMethod === "Pendiente"
          ? "Cancha marcada como pendiente"
          : `Pago de cancha registrado en ${courtDraftMethod.toLowerCase()}`,
    });
    setCourtDraftMethod(null);
    setShowCourtEditor(false);
  }

  function handleConsumptionConfirm() {
    if (!consumptionDraftMethod) {
      return;
    }

    onPayConsumptions(consumptionDraftMethod);
    setFeedback({
      tone: consumptionDraftMethod === "Pendiente" ? "warning" : "success",
      message:
        consumptionDraftMethod === "Pendiente"
          ? "Consumos marcados como pendiente"
          : `Pago de consumos registrado en ${consumptionDraftMethod.toLowerCase()}`,
    });
    setConsumptionDraftMethod(null);
    setShowConsumptionEditor(false);
  }

  return (
    <section className="surface-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="section-title">Jugador seleccionado</p>
          <h2 className="mt-1 truncate text-[28px] font-extrabold tracking-[-0.03em] text-content">{playerName}</h2>
          <div className="mt-2 flex items-center gap-2">
            <StatusBadge status={pendingTotal > 0 ? "debt" : "paid"}>
              {pendingTotal > 0 ? "Con deuda" : "Al dia"}
            </StatusBadge>
            <p className="text-sm font-bold text-muted">{getPlayerStatus(player)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="metric-label">Debe</p>
          <p className={`mt-1 text-2xl font-extrabold ${pendingTotal > 0 ? "text-danger" : "text-primaryStrong"}`}>
            {pendingTotal > 0 ? formatCurrency(pendingTotal) : "0"}
          </p>
        </div>
      </div>

      {feedback && (
        <div className="mt-4">
          <StatusSummary tone={feedback.tone === "warning" ? "warning" : "success"}>{feedback.message}</StatusSummary>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-[22px] border border-line bg-white/5 px-4 py-3">
          <p className="metric-label">Cancha</p>
          <p className="mt-1 text-base font-extrabold text-content">{formatCurrency(player.courtShare)}</p>
        </div>
        <div className="rounded-[22px] border border-line bg-white/5 px-4 py-3">
          <p className="metric-label">Consumos</p>
          <p className="mt-1 text-base font-extrabold text-content">{formatCurrency(consumptionTotal)}</p>
        </div>
        <div className="rounded-[22px] border border-primary/20 bg-primary/10 px-4 py-3">
          <p className="metric-label text-primaryStrong">Total</p>
          <p className="mt-1 text-base font-extrabold text-primaryStrong">{formatCurrency(grandTotal)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {isEverythingPaid ? (
          <StatusSummary>Todo pagado</StatusSummary>
        ) : (
          <div className="rounded-[24px] border border-line bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="section-title">Cobro principal</p>
                <p className="mt-1 text-lg font-extrabold text-content">{formatCurrency(pendingTotal)}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPayAllMethods((current) => !current)}
                className="button-primary px-4 py-3 text-sm font-extrabold"
              >
                Pagar todo
              </button>
            </div>

            {showPayAllMethods && (
              <div className="mt-4 space-y-3 rounded-[22px] bg-app px-4 py-4">
                <div>
                  <p className="metric-label">Como paga</p>
                  <div className="mt-2">
                    <MethodButtons
                      selectedMethod={payAllMethod}
                      onSelect={setPayAllMethod}
                      pendingLabel="Mixto"
                      options={["Efectivo", "Transferencia", "Mixto"]}
                    />
                  </div>
                </div>

                {payAllMethod === "Mixto" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="metric-label">Cancha</p>
                      <div className="mt-2">
                        <MethodButtons
                          selectedMethod={mixedCourtMethod}
                          onSelect={setMixedCourtMethod}
                          options={["Efectivo", "Transferencia"]}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="metric-label">Consumos</p>
                      <div className="mt-2">
                        <MethodButtons
                          selectedMethod={mixedConsumptionMethod}
                          onSelect={setMixedConsumptionMethod}
                          options={["Efectivo", "Transferencia"]}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {payAllMethod && (
                  <button
                    type="button"
                    onClick={handlePayAllConfirm}
                    className="button-primary w-full px-4 py-3 text-sm font-extrabold"
                  >
                    {payAllMethod === "Mixto"
                      ? `Confirmar pago mixto ${formatCurrency(pendingTotal)}`
                      : `Pagar ${formatCurrency(pendingTotal)}`}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <section className="rounded-[24px] border border-line bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-title">Cancha</p>
                <p className="mt-1 text-lg font-extrabold text-content">{formatCurrency(player.courtShare)}</p>
              </div>
              <StatusBadge status={player.courtStatus}>{player.courtMethod}</StatusBadge>
            </div>

            {isCourtPaid && !showCourtEditor ? (
              <div className="mt-3 space-y-2">
                <StatusSummary>{`Cancha pagada · ${player.courtMethod}`}</StatusSummary>
                <div className="flex items-center gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCourtEditor(true);
                      setCourtDraftMethod(player.courtMethod === "Pendiente" ? null : player.courtMethod);
                    }}
                    className="font-bold text-muted underline underline-offset-4"
                  >
                    Cambiar metodo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onPayCourt("Pendiente");
                      setFeedback({ tone: "warning", message: "Cancha marcada como pendiente" });
                    }}
                    className="font-bold text-warning underline underline-offset-4"
                  >
                    Marcar pendiente
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <MethodButtons
                  selectedMethod={courtDraftMethod}
                  onSelect={setCourtDraftMethod}
                  options={showCourtEditor ? ["Efectivo", "Transferencia"] : undefined}
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCourtConfirm}
                    disabled={!courtDraftMethod}
                    className="button-primary flex-1 px-4 py-3 text-sm font-extrabold disabled:opacity-50"
                  >
                    {showCourtEditor ? "Confirmar cambio" : "Confirmar pago"}
                  </button>
                  {showCourtEditor && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowCourtEditor(false);
                        setCourtDraftMethod(null);
                      }}
                      className="button-secondary flex h-[46px] w-[46px] items-center justify-center border-0"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-[24px] border border-line bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-title">Consumos</p>
                <p className="mt-1 text-lg font-extrabold text-content">{formatCurrency(consumptionTotal)}</p>
              </div>
              <StatusBadge status={pendingConsumptions > 0 ? "debt" : "paid"}>
                {hasConsumptions ? player.consumptions[0]?.method ?? "Pendiente" : "Sin consumos"}
              </StatusBadge>
            </div>

            {!hasConsumptions ? (
              <div className="mt-3 rounded-[22px] border border-dashed border-line px-4 py-4 text-sm text-muted">
                Todavia no hay consumos asociados a este jugador.
              </div>
            ) : areConsumptionsPaid && !showConsumptionEditor ? (
              <div className="mt-3 space-y-2">
                <StatusSummary>{`Consumos pagos · ${player.consumptions[0]?.method ?? "Efectivo"}`}</StatusSummary>
                <div className="flex items-center gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setShowConsumptionEditor(true);
                      setConsumptionDraftMethod(
                        player.consumptions[0]?.method === "Pendiente" ? null : player.consumptions[0]?.method,
                      );
                    }}
                    className="font-bold text-muted underline underline-offset-4"
                  >
                    Cambiar metodo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onPayConsumptions("Pendiente");
                      setFeedback({ tone: "warning", message: "Consumos marcados como pendiente" });
                    }}
                    className="font-bold text-warning underline underline-offset-4"
                  >
                    Marcar pendiente
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <MethodButtons
                  selectedMethod={consumptionDraftMethod}
                  onSelect={setConsumptionDraftMethod}
                  options={showConsumptionEditor ? ["Efectivo", "Transferencia"] : undefined}
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleConsumptionConfirm}
                    disabled={!consumptionDraftMethod}
                    className="button-primary flex-1 px-4 py-3 text-sm font-extrabold disabled:opacity-50"
                  >
                    {showConsumptionEditor ? "Confirmar cambio" : "Confirmar pago"}
                  </button>
                  {showConsumptionEditor && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowConsumptionEditor(false);
                        setConsumptionDraftMethod(null);
                      }}
                      className="button-secondary flex h-[46px] w-[46px] items-center justify-center border-0"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <section className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="section-title">Historial rapido</p>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">{movements.length} items</span>
        </div>

        <div className="mt-3 space-y-2">
          {movements.length > 0 ? (
            movements.map((movement) => (
              <div key={movement.id} className="rounded-[22px] border border-line bg-white/5 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-content">{movement.title}</p>
                    <p className="mt-1 text-xs text-muted">{getMovementLabel(movement)}</p>
                  </div>
                  <p className="text-sm font-extrabold text-content">{formatCurrency(movement.amount)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-line px-4 py-4 text-sm text-muted">
              Todavia no hay movimientos asociados a este jugador.
            </div>
          )}
        </div>
      </section>
    </section>
  );
}

export function TurnDetailPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    turn,
    refreshTurn,
    markCourtPayment,
    markConsumptionPayment,
    markPlayerPayAll,
    getPlayerMovements,
    pushFlash,
  } = useTurn(bookingId);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);
  const [showFinanceSheet, setShowFinanceSheet] = useState(false);
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [showAddConsumptionSheet, setShowAddConsumptionSheet] = useState(false);
  const [showQuickPaymentSheet, setShowQuickPaymentSheet] = useState(false);
  const [quickPaymentPlayerIndex, setQuickPaymentPlayerIndex] = useState(null);
  const [quickPaymentMethod, setQuickPaymentMethod] = useState(null);

  useEffect(() => {
    refreshTurn();
    setShowFinanceSheet(false);
    setShowInfoSheet(false);
  }, [bookingId, location.key, refreshTurn]);

  useEffect(() => {
    if (!turn) {
      return;
    }

    setSelectedPlayerIndex((current) => {
      if (current === null) {
        return 0;
      }

      return turn.players[current] ? current : 0;
    });
  }, [turn]);

  useEffect(() => {
    if (location.state?.quickAction === "payment") {
      setShowQuickPaymentSheet(true);
    }

    if (location.state?.quickAction === "consumption") {
      setShowAddConsumptionSheet(true);
    }
  }, [location.state]);

  const selectedPlayer = useMemo(() => {
    if (selectedPlayerIndex === null || !turn) {
      return null;
    }

    return turn.players[selectedPlayerIndex] ?? null;
  }, [selectedPlayerIndex, turn]);

  const selectedPlayerMovements = useMemo(
    () => getPlayerMovements(selectedPlayer, selectedPlayerIndex),
    [getPlayerMovements, selectedPlayer, selectedPlayerIndex],
  );

  function handleQuickPaymentConfirm() {
    if (quickPaymentPlayerIndex === null || !quickPaymentMethod) {
      return;
    }

    if (quickPaymentMethod === "Mixto") {
      setSelectedPlayerIndex(quickPaymentPlayerIndex);
      setShowQuickPaymentSheet(false);
      setQuickPaymentMethod(null);
      return;
    }

    markPlayerPayAll(quickPaymentPlayerIndex, quickPaymentMethod);
    setShowQuickPaymentSheet(false);
    setQuickPaymentPlayerIndex(null);
    setQuickPaymentMethod(null);
    pushFlash({
      tone: quickPaymentMethod === "Pendiente" ? "warning" : "success",
      message:
        quickPaymentMethod === "Pendiente"
          ? "Jugador marcado como pendiente"
          : "Pago registrado correctamente",
    });
  }

  function handleAddConsumptionTarget(target) {
    setShowAddConsumptionSheet(false);
    navigate("/consumos", {
      state: {
        returnTo: `/turnos/${bookingId}`,
        bookingId,
        association: target,
      },
    });
  }

  if (!turn) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="surface-card max-w-md p-6 text-center">
          <p className="text-lg font-extrabold text-content">Turno no encontrado</p>
          <Link
            to="/turnos"
            className="mt-4 inline-flex rounded-2xl bg-primary px-4 py-3 font-bold text-[#13210c]"
          >
            Volver a turnos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-0">
      <div className="lg:hidden">
        <header className="sticky top-0 z-40 -mx-4 border-b border-line bg-app/90 px-4 pb-3 pt-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Link
              to="/turnos"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-white/5 text-content"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <p className="section-title">Turno</p>
              <h1 className="truncate text-xl font-extrabold text-content">{turn.title}</h1>
            </div>
          </div>
        </header>

        <div className="space-y-3 pt-3">
          <section className="surface-card px-4 py-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-[22px] font-extrabold text-content">{turn.title}</h2>
                <div className="mt-1.5 flex items-center gap-2 text-sm">
                  <span className="font-extrabold text-danger">{`Debe ${formatCurrency(turn.pendingTotal)}`}</span>
                  <span className="h-1 w-1 rounded-full bg-white/25" />
                  <span className="text-muted">{`${turn.players.length} jugadores`}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInfoSheet(true)}
                className="text-sm font-bold text-muted underline underline-offset-4"
              >
                Ver info
              </button>
            </div>
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="section-title">Jugadores</p>
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Rapido</span>
            </div>

            {turn.players.map((player, index) => (
              <CompactPlayerCard
                key={player.id}
                player={player}
                index={index}
                onOpen={(_, playerIndex) => setSelectedPlayerIndex(playerIndex)}
              />
            ))}
          </section>
        </div>

        <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-app/95 backdrop-blur-xl">
          <div className="mx-auto max-w-lg space-y-2 px-4 pb-5 pt-2.5">
            <div className="flex items-center justify-between rounded-3xl bg-white/5 px-4 py-2.5">
              <p className="text-lg font-extrabold text-content">{`${formatCurrency(turn.grandTotal)} total`}</p>
              <button
                type="button"
                onClick={() => setShowFinanceSheet(true)}
                className="text-sm font-bold text-muted underline underline-offset-4"
              >
                Ver resumen
              </button>
            </div>

            <div className="grid grid-cols-[0.95fr_1.05fr] gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddConsumptionSheet(true)}
                className="button-secondary rounded-3xl px-4 py-3 text-sm font-bold"
              >
                Agregar consumo
              </button>
              <button
                type="button"
                onClick={() => setShowQuickPaymentSheet(true)}
                className="button-primary rounded-3xl px-4 py-3 text-sm font-extrabold"
              >
                Registrar pago
              </button>
            </div>
          </div>
        </footer>
      </div>

      <div className="hidden lg:flex lg:min-h-[calc(100vh-180px)] lg:flex-col">
          <DesktopContextHeader
            eyebrow="Turno activo"
            title={turn.title}
            description={`${turn.customerName} - ${turn.players.length} jugadores - Debe ${formatCurrency(turn.pendingTotal)}`}
            className="mb-5"
            leading={
              <Link
                to="/turnos"
                className="button-secondary flex h-12 w-12 items-center justify-center border-white/10"
              >
                <ArrowLeft size={18} />
              </Link>
            }
            actions={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowInfoSheet(true)}
                  className="button-secondary px-4 py-3 text-sm font-bold"
                >
                  Ver info
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuickPaymentSheet(true)}
                  className="button-primary flex items-center gap-2 px-4 py-3 text-sm font-extrabold"
                >
                  <Wallet size={16} />
                  Registrar pago
                </button>
              </div>
            }
          />
          <section className="grid flex-1 grid-cols-[280px_minmax(0,1fr)] gap-4">
            <DesktopPanelCard
              title="Jugadores"
              subtitle={`${turn.players.length} en cancha`}
            >
              <div className="space-y-2.5">
                {turn.players.map((player, index) => (
                  <DesktopPlayerRow
                  key={player.id}
                  player={player}
                  index={index}
                  selected={index === selectedPlayerIndex}
                  onSelect={setSelectedPlayerIndex}
                  />
                ))}
              </div>
            </DesktopPanelCard>

          <div className="flex flex-col gap-4">
            <div>
              <DesktopPlayerDetail
                player={selectedPlayer ?? turn.players[0]}
                playerIndex={selectedPlayerIndex ?? 0}
                movements={selectedPlayerMovements}
                onPayAll={(method, mixedMethods) => markPlayerPayAll(selectedPlayerIndex ?? 0, method, mixedMethods)}
                onPayCourt={(method) => markCourtPayment(selectedPlayerIndex ?? 0, method)}
                onPayConsumptions={(method) => markConsumptionPayment(selectedPlayerIndex ?? 0, method)}
                onAddConsumption={() =>
                  handleAddConsumptionTarget({
                    type: "player",
                    playerId: (selectedPlayer ?? turn.players[0]).id,
                    playerName: getPlayerName(selectedPlayer ?? turn.players[0], selectedPlayerIndex ?? 0),
                    label: getPlayerName(selectedPlayer ?? turn.players[0], selectedPlayerIndex ?? 0),
                    saleTarget: getPlayerName(selectedPlayer ?? turn.players[0], selectedPlayerIndex ?? 0),
                  })
                }
              />
            </div>

            <DesktopActionBar
              secondaryAction={
                <button
                  type="button"
                  onClick={() => setShowAddConsumptionSheet(true)}
                  className="button-secondary px-4 py-3 text-sm font-bold"
                >
                  Agregar consumo
                </button>
              }
              primaryAction={
                <button
                  type="button"
                  onClick={() => setShowQuickPaymentSheet(true)}
                  className="button-primary w-full px-4 py-3 text-sm font-extrabold"
                >
                  Registrar pago
                </button>
              }
              tertiaryAction={
                <button
                  type="button"
                  onClick={() => setShowFinanceSheet(true)}
                  className="button-secondary px-4 py-3 text-sm font-bold"
                >
                  Ver resumen
                </button>
              }
            />
          </div>
        </section>
      </div>

      <div className="lg:hidden">
        {selectedPlayer && (
          <PlayerDetailSheet
            player={selectedPlayer}
            playerIndex={selectedPlayerIndex ?? 0}
            movements={selectedPlayerMovements}
            onClose={() => setSelectedPlayerIndex(null)}
            onPayAll={(method, mixedMethods) =>
              markPlayerPayAll(selectedPlayerIndex ?? 0, method, mixedMethods)
            }
            onPayCourt={(method) => markCourtPayment(selectedPlayerIndex ?? 0, method)}
            onPayConsumptions={(method) => markConsumptionPayment(selectedPlayerIndex ?? 0, method)}
            onAddConsumption={() =>
              handleAddConsumptionTarget({
                type: "player",
                playerId: selectedPlayer.id,
                playerName: getPlayerName(selectedPlayer, selectedPlayerIndex ?? 0),
                label: getPlayerName(selectedPlayer, selectedPlayerIndex ?? 0),
                saleTarget: getPlayerName(selectedPlayer, selectedPlayerIndex ?? 0),
              })
            }
          />
        )}
      </div>

      {showAddConsumptionSheet && (
        <AddConsumptionSheet
          turn={turn}
          onClose={() => setShowAddConsumptionSheet(false)}
          onSelectTarget={handleAddConsumptionTarget}
        />
      )}

      {showQuickPaymentSheet && (
        <QuickPaymentSheet
          turn={turn}
          selectedPlayerIndex={quickPaymentPlayerIndex}
          onSelectPlayer={setQuickPaymentPlayerIndex}
          selectedMethod={quickPaymentMethod}
          onSelectMethod={setQuickPaymentMethod}
          onConfirm={handleQuickPaymentConfirm}
          onClose={() => {
            setShowQuickPaymentSheet(false);
            setQuickPaymentPlayerIndex(null);
            setQuickPaymentMethod(null);
          }}
        />
      )}

      <TurnFinanceSheet turn={showFinanceSheet ? turn : null} onClose={() => setShowFinanceSheet(false)} />
      <TurnInfoSheet turn={showInfoSheet ? turn : null} onClose={() => setShowInfoSheet(false)} />
    </div>
  );
}

