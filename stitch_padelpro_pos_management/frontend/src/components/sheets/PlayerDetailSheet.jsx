import { CheckCircle2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BottomSheet } from "./BottomSheet";
import { formatCurrency } from "../../lib/format";
import { StatusBadge } from "../ui/StatusBadge";

function getPlayerName(player, index) {
  return player.name?.trim() ? player.name : `Jugador ${index + 1}`;
}

function getConsumptionTotal(player) {
  return player.consumptions.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

function getPendingConsumptionTotal(player) {
  return player.consumptions.reduce((acc, item) => {
    if (item.status === "debt") {
      return acc + item.price * item.quantity;
    }

    return acc;
  }, 0);
}

function getTotalPending(player) {
  return player.courtDebt + getPendingConsumptionTotal(player);
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
    <div className="grid grid-cols-3 gap-2">
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

export function PlayerDetailSheet({
  player,
  playerIndex,
  onClose,
  onPayAll,
  onPayCourt,
  onPayConsumptions,
  onAddConsumption,
  movements = [],
}) {
  if (!player) {
    return null;
  }

  const playerName = getPlayerName(player, playerIndex);
  const consumptionTotal = getConsumptionTotal(player);
  const pendingTotal = getTotalPending(player);
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

  const consumptionStatus = useMemo(() => {
    if (consumptionTotal === 0) {
      return "paid";
    }

    return player.consumptions.every((item) => item.status === "paid") ? "paid" : "debt";
  }, [consumptionTotal, player.consumptions]);
  const pendingConsumptionTotal = useMemo(() => getPendingConsumptionTotal(player), [player]);
  const isCourtPaid = player.courtStatus === "paid";
  const hasConsumptions = player.consumptions.length > 0;
  const areConsumptionsPaid = hasConsumptions ? pendingConsumptionTotal === 0 : true;
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
        tone: "success",
        message: `Pago total registrado en ${payAllMethod.toLowerCase()}`,
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

  function handleCourtPending() {
    onPayCourt("Pendiente");
    setFeedback({
      tone: "warning",
      message: "Cancha marcada como pendiente",
    });
    setCourtDraftMethod(null);
    setShowCourtEditor(false);
  }

  function handleConsumptionPending() {
    onPayConsumptions("Pendiente");
    setFeedback({
      tone: "warning",
      message: "Consumos marcados como pendiente",
    });
    setConsumptionDraftMethod(null);
    setShowConsumptionEditor(false);
  }

  return (
    <BottomSheet onClose={onClose} height="68dvh" maxHeight="78dvh">
      <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-1">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-extrabold text-content">{playerName}</h3>
          <div className="mt-1 space-y-0.5">
            <p className="text-sm font-bold text-content">{`${formatCurrency(grandTotal)} total`}</p>
            {pendingTotal > 0 ? (
              <p className="text-sm font-bold text-danger">{`Debe ${formatCurrency(pendingTotal)}`}</p>
            ) : (
              <p className="text-sm font-bold text-primaryStrong">Todo al dia</p>
            )}
          </div>
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
        {feedback && (
          <section
            className={`flex items-center gap-2 rounded-[24px] px-3.5 py-3 ${
              feedback.tone === "success"
                ? "bg-primary/12 text-primaryStrong"
                : "bg-warning/12 text-warning"
            }`}
          >
            <CheckCircle2 size={18} />
            <p className="text-sm font-bold">{feedback.message}</p>
          </section>
        )}

        <section className="surface-card p-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-white/5 px-3 py-2.5">
              <p className="metric-label">Cancha</p>
              <p className="mt-1 text-sm font-extrabold text-content">{formatCurrency(player.courtShare)}</p>
            </div>
            <div className="rounded-2xl bg-white/5 px-3 py-2.5">
              <p className="metric-label">Consumos</p>
              <p className="mt-1 text-sm font-extrabold text-content">{formatCurrency(consumptionTotal)}</p>
            </div>
            <div className="rounded-2xl bg-primary/12 px-3 py-2.5">
              <p className="metric-label text-primaryStrong">Total</p>
              <p className="mt-1 text-sm font-extrabold text-primaryStrong">{formatCurrency(grandTotal)}</p>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {isEverythingPaid ? (
              <StatusSummary>Todo pagado</StatusSummary>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShowPayAllMethods((current) => !current)}
                  className="button-primary w-full rounded-3xl px-4 py-3 text-sm font-extrabold"
                >
                  Pagar todo
                </button>

                {showPayAllMethods && (
                  <div className="space-y-2 rounded-[24px] bg-white/5 p-3">
                    <p className="text-base font-extrabold text-content">{`${formatCurrency(pendingTotal)} por cobrar`}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Como paga</p>
                    <MethodButtons
                      selectedMethod={payAllMethod}
                      onSelect={(method) => setPayAllMethod(method)}
                      pendingLabel="Mixto"
                      options={["Efectivo", "Transferencia", "Mixto"]}
                    />

                    {payAllMethod && (
                      <div className="rounded-[22px] bg-app px-3 py-3">
                        <p className="text-sm font-bold text-content">
                          {payAllMethod === "Mixto"
                            ? "Pago mixto seleccionado"
                            : `${payAllMethod} seleccionado`}
                        </p>
                      </div>
                    )}

                    {payAllMethod === "Mixto" && (
                      <div className="space-y-2 rounded-[22px] bg-app px-3 py-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Cancha</p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {["Efectivo", "Transferencia"].map((method) => (
                              <button
                                key={method}
                                type="button"
                                onClick={() => setMixedCourtMethod(method)}
                                className={
                                  mixedCourtMethod === method ? "button-primary px-3 py-2.5 text-sm font-extrabold" : "button-secondary px-3 py-2.5 text-sm font-bold"
                                }
                              >
                                {method === "Transferencia" ? "Transfer." : method}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Consumos</p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {["Efectivo", "Transferencia"].map((method) => (
                              <button
                                key={method}
                                type="button"
                                onClick={() => setMixedConsumptionMethod(method)}
                                className={
                                  mixedConsumptionMethod === method ? "button-primary px-3 py-2.5 text-sm font-extrabold" : "button-secondary px-3 py-2.5 text-sm font-bold"
                                }
                              >
                                {method === "Transferencia" ? "Transfer." : method}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {payAllMethod && (
                      <button
                        type="button"
                        onClick={handlePayAllConfirm}
                        className="button-primary w-full rounded-3xl px-4 py-3 text-sm font-extrabold"
                      >
                        {payAllMethod === "Mixto"
                          ? `Confirmar pago mixto ${formatCurrency(pendingTotal)}`
                          : `Pagar ${formatCurrency(pendingTotal)}`}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="surface-card p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="metric-label">Pago cancha</p>
              <p className="mt-1 text-lg font-extrabold text-content">
                {formatCurrency(player.courtShare)}
              </p>
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
                  onClick={handleCourtPending}
                  className="font-bold text-warning underline underline-offset-4"
                >
                  Marcar pendiente
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-3 space-y-2 rounded-[22px] bg-white/5 p-3">
                <p className="text-sm font-bold text-content">
                  {showCourtEditor ? "Seleccionar nuevo metodo" : "Como paga cancha"}
                </p>
                <MethodButtons
                  selectedMethod={courtDraftMethod}
                  onSelect={setCourtDraftMethod}
                  options={showCourtEditor ? ["Efectivo", "Transferencia"] : undefined}
                />

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCourtConfirm}
                    disabled={!courtDraftMethod}
                    className="button-primary rounded-3xl px-4 py-3 text-sm font-extrabold disabled:opacity-50"
                  >
                    {showCourtEditor ? "Confirmar cambio" : courtDraftMethod === "Pendiente"
                      ? "Confirmar pendiente"
                      : `Registrar ${formatCurrency(player.courtShare)}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCourtDraftMethod(null);
                      setShowCourtEditor(false);
                    }}
                    className="button-secondary rounded-3xl border-0 px-4 py-3 text-sm font-bold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <section className="surface-card p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="metric-label">Consumos</p>
              <p className="mt-1 text-base font-extrabold text-content">
                {formatCurrency(consumptionTotal)}
              </p>
            </div>
            <StatusBadge status={consumptionStatus}>
              {pendingTotal > 0 && pendingConsumptionTotal > 0 ? "Pendiente" : "Pagado"}
            </StatusBadge>
          </div>

          {player.consumptions.length > 0 ? (
            <>
              {areConsumptionsPaid && !showConsumptionEditor ? (
                <div className="mt-3 space-y-2">
                  <StatusSummary>{`Consumos pagos · ${player.consumptions[0]?.method ?? "Sin metodo"}`}</StatusSummary>
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
                      onClick={handleConsumptionPending}
                      className="font-bold text-warning underline underline-offset-4"
                    >
                      Marcar pendiente
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-3 space-y-2 rounded-[22px] bg-white/5 p-3">
                    <p className="text-sm font-bold text-content">
                      {showConsumptionEditor ? "Seleccionar nuevo metodo" : "Como paga consumos"}
                    </p>
                    <MethodButtons
                      selectedMethod={consumptionDraftMethod}
                      onSelect={setConsumptionDraftMethod}
                      options={showConsumptionEditor ? ["Efectivo", "Transferencia"] : undefined}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleConsumptionConfirm}
                        disabled={!consumptionDraftMethod}
                        className="button-primary rounded-3xl px-4 py-3 text-sm font-extrabold disabled:opacity-50"
                      >
                        {showConsumptionEditor ? "Confirmar cambio" : consumptionDraftMethod === "Pendiente"
                          ? "Confirmar pendiente"
                          : `Registrar ${formatCurrency(pendingConsumptionTotal || consumptionTotal)}`}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConsumptionDraftMethod(null);
                          setShowConsumptionEditor(false);
                        }}
                        className="button-secondary rounded-3xl border-0 px-4 py-3 text-sm font-bold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="mt-3 rounded-2xl bg-white/5 px-3 py-3 text-sm font-bold text-muted">
              No hay consumos para cobrar en este jugador.
            </div>
          )}
        </section>

        <button
          type="button"
          onClick={onAddConsumption}
          className="button-secondary w-full rounded-3xl px-4 py-3 text-sm font-bold"
        >
          Agregar consumo a {playerName}
        </button>

        <section className="surface-card p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="section-title">Historial rapido</p>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
              {movements.length}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {movements.length > 0 ? (
              movements.map((movement) => (
                <div key={movement.id} className="rounded-2xl bg-panelStrong px-3 py-2.5">
                  <p className="text-sm font-extrabold text-content">{movement.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{movement.meta}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-panelStrong px-3 py-4 text-sm text-muted">
                Sin movimientos recientes para este jugador.
              </div>
            )}
          </div>
        </section>

        <div className="space-y-2 pb-1">
          {player.consumptions.length > 0 ? (
            player.consumptions.map((consumption) => (
              <div
                key={consumption.id}
                className="flex items-center justify-between rounded-2xl bg-panelStrong px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-content">{consumption.name}</p>
                  <p className="mt-0.5 text-sm text-muted">
                    {formatCurrency(consumption.price * consumption.quantity)}
                  </p>
                </div>
                <StatusBadge status={consumption.status}>{consumption.method}</StatusBadge>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-panelStrong px-3 py-4 text-sm text-muted">
              Sin consumos cargados por ahora.
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
