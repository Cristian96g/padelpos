import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { turnDetails } from "../mocks/data";
import {
  appendAuditEntry,
  appendConsumptionsToTurn,
  createAuditEntry,
  createMovement,
  createPaymentSnapshot,
  DEFAULT_ACTOR,
  deriveAuditEventsFromTurn,
  deriveCashMovementsFromTurn,
  deriveCashSummaryFromTurns,
  derivePendingItemsFromTurn,
  getConsumptionAmount,
  getPendingConsumptionTotal,
  getPlayerName,
  loadTurnById,
  updateTurnById,
} from "../lib/turnStore";

const TurnStoreContext = createContext(null);
const CURRENT_ACTOR = DEFAULT_ACTOR;

function buildInitialTurnsMap() {
  return Object.keys(turnDetails).reduce((acc, bookingId) => {
    const turn = loadTurnById(bookingId);

    if (turn) {
      acc[bookingId] = turn;
    }

    return acc;
  }, {});
}

export function TurnStoreProvider({ children }) {
  const [turnsById, setTurnsById] = useState(() => buildInitialTurnsMap());
  const [lastFlash, setLastFlash] = useState(null);

  const pushFlash = useCallback((flash) => {
    if (!flash?.message) {
      return;
    }

    setLastFlash({
      tone: flash.tone ?? "success",
      message: flash.message,
    });
  }, []);

  const consumeFlash = useCallback(() => {
    setLastFlash(null);
  }, []);

  const syncTurn = useCallback((turn) => {
    if (!turn) {
      return null;
    }

    setTurnsById((current) => {
      if (current[turn.id] === turn) {
        return current;
      }

      return {
        ...current,
        [turn.id]: turn,
      };
    });

    return turn;
  }, []);

  const getTurnById = useCallback((bookingId) => turnsById[bookingId] ?? null, [turnsById]);

  const refreshTurn = useCallback(
    (bookingId) => {
      const nextTurn = loadTurnById(bookingId);
      return syncTurn(nextTurn);
    },
    [syncTurn],
  );

  const updateTurn = useCallback(
    (bookingId, mutator) => {
      const nextTurn = updateTurnById(bookingId, mutator);
      return syncTurn(nextTurn);
    },
    [syncTurn],
  );

  const markCourtPayment = useCallback(
    (bookingId, playerIndex, method) =>
      updateTurn(bookingId, (draft) => {
        const player = draft.players[playerIndex];

        if (!player) {
          return;
        }

        const before = createPaymentSnapshot(player.courtMethod, player.courtStatus, player.courtShare);

        if (method === "Pendiente") {
          player.courtStatus = "debt";
          player.courtMethod = "Pendiente";
          appendAuditEntry(
            draft,
            createAuditEntry("court_marked_pending", {
              actor: CURRENT_ACTOR,
              label: "Cancha marcada como pendiente",
              detail: `${getPlayerName(player, playerIndex)} · ${player.courtShare}`,
              targetType: "player",
              targetId: player.id,
              before,
              after: createPaymentSnapshot("Pendiente", "debt", player.courtShare),
            }),
          );
          return;
        }

        player.courtStatus = "paid";
        player.courtMethod = method;
        draft.movements.unshift(
          createMovement(`${getPlayerName(player, playerIndex)} pago cancha`, `${method} · hace instantes`, player.courtShare, {
            actor: CURRENT_ACTOR,
            actionType: "court_paid",
            referenceType: "player",
            referenceId: player.id,
          }),
        );
        appendAuditEntry(
          draft,
          createAuditEntry("court_paid", {
            actor: CURRENT_ACTOR,
            label: "Pago de cancha registrado",
            detail: `${getPlayerName(player, playerIndex)} · ${method} · ${player.courtShare}`,
            targetType: "player",
            targetId: player.id,
            before,
            after: createPaymentSnapshot(method, "paid", player.courtShare),
          }),
        );
      }),
    [updateTurn],
  );

  const markConsumptionPayment = useCallback(
    (bookingId, playerIndex, method) =>
      updateTurn(bookingId, (draft) => {
        const player = draft.players[playerIndex];

        if (!player || player.consumptions.length === 0) {
          return;
        }

        const amount = player.consumptions.reduce((acc, item) => acc + getConsumptionAmount(item), 0);
        const before = {
          method: player.consumptions[0]?.method ?? "Pendiente",
          status: player.consumptions.every((item) => item.status === "paid") ? "paid" : "debt",
          amount,
        };

        player.consumptions.forEach((consumption) => {
          consumption.status = method === "Pendiente" ? "debt" : "paid";
          consumption.method = method;
        });

        if (method !== "Pendiente") {
          draft.movements.unshift(
            createMovement(`${getPlayerName(player, playerIndex)} pago consumos`, `${method} · hace instantes`, amount, {
              actor: CURRENT_ACTOR,
              actionType: "consumptions_paid",
              referenceType: "player",
              referenceId: player.id,
            }),
          );
        }

        appendAuditEntry(
          draft,
          createAuditEntry(method === "Pendiente" ? "consumptions_marked_pending" : "consumptions_paid", {
            actor: CURRENT_ACTOR,
            label: method === "Pendiente" ? "Consumos marcados como pendiente" : "Pago de consumos registrado",
            detail: `${getPlayerName(player, playerIndex)} · ${method} · ${amount}`,
            targetType: "player",
            targetId: player.id,
            before,
            after: createPaymentSnapshot(method, method === "Pendiente" ? "debt" : "paid", amount),
          }),
        );
      }),
    [updateTurn],
  );

  const markPlayerPayAll = useCallback(
    (bookingId, playerIndex, method, mixedMethods) =>
      updateTurn(bookingId, (draft) => {
        const player = draft.players[playerIndex];

        if (!player) {
          return;
        }

        const consumptionAmount = player.consumptions.reduce((acc, item) => acc + getConsumptionAmount(item), 0);
        const before = {
          court: createPaymentSnapshot(player.courtMethod, player.courtStatus, player.courtShare),
          consumptions: createPaymentSnapshot(
            player.consumptions[0]?.method ?? "Pendiente",
            player.consumptions.every((item) => item.status === "paid") ? "paid" : "debt",
            consumptionAmount,
          ),
        };

        if (method === "Pendiente") {
          player.courtStatus = "debt";
          player.courtMethod = "Pendiente";
          player.consumptions.forEach((consumption) => {
            consumption.status = "debt";
            consumption.method = "Pendiente";
          });
          appendAuditEntry(
            draft,
            createAuditEntry("player_marked_pending", {
              actor: CURRENT_ACTOR,
              label: "Jugador marcado como pendiente",
              detail: `${getPlayerName(player, playerIndex)} · ${player.courtShare + consumptionAmount}`,
              targetType: "player",
              targetId: player.id,
              before,
              after: {
                court: createPaymentSnapshot("Pendiente", "debt", player.courtShare),
                consumptions: createPaymentSnapshot("Pendiente", "debt", consumptionAmount),
              },
            }),
          );
          return;
        }

        const courtMethod = method === "Mixto" ? mixedMethods?.courtMethod ?? "Efectivo" : method;
        const consumptionMethod = method === "Mixto" ? mixedMethods?.consumptionMethod ?? "Transferencia" : method;

        player.courtStatus = "paid";
        player.courtMethod = courtMethod;
        player.consumptions.forEach((consumption) => {
          consumption.status = "paid";
          consumption.method = consumptionMethod;
        });

        draft.movements.unshift(
          createMovement(`${getPlayerName(player, playerIndex)} pago todo`, `${method} · hace instantes`, player.courtShare + consumptionAmount, {
            actor: CURRENT_ACTOR,
            actionType: "player_paid_all",
            referenceType: "player",
            referenceId: player.id,
          }),
        );
        appendAuditEntry(
          draft,
          createAuditEntry("player_paid_all", {
            actor: CURRENT_ACTOR,
            label: "Pago total registrado",
            detail: `${getPlayerName(player, playerIndex)} · ${method} · ${player.courtShare + consumptionAmount}`,
            targetType: "player",
            targetId: player.id,
            before,
            after: {
              court: createPaymentSnapshot(courtMethod, "paid", player.courtShare),
              consumptions: createPaymentSnapshot(consumptionMethod, "paid", consumptionAmount),
            },
          }),
        );
      }),
    [updateTurn],
  );

  const addConsumptions = useCallback(
    (payload) => {
      const nextTurn = appendConsumptionsToTurn({
        ...payload,
        actor: CURRENT_ACTOR,
      });
      return syncTurn(nextTurn);
    },
    [syncTurn],
  );

  const collectPending = useCallback(
    (pendingRecord, method = "Efectivo") => {
      if (!pendingRecord?.turnId) {
        return null;
      }

      const nextTurn = updateTurnById(pendingRecord.turnId, (draft) => {
        const playerIndex = draft.players.findIndex((player) => player.id === pendingRecord.playerId);
        const player = playerIndex >= 0 ? draft.players[playerIndex] : null;

        if (pendingRecord.sourceType === "court" && player) {
          player.courtStatus = "paid";
          player.courtMethod = method;
        }

        if (pendingRecord.sourceType === "player-consumption" && player) {
          player.consumptions.forEach((consumption) => {
            if (consumption.id === pendingRecord.sourceId) {
              consumption.status = "paid";
              consumption.method = method;
            }
          });
        }

        if (pendingRecord.sourceType === "extra-consumption") {
          draft.extraConsumptions = (draft.extraConsumptions ?? []).map((consumption) =>
            consumption.id === pendingRecord.sourceId
              ? { ...consumption, status: "paid", method }
              : consumption,
          );
        }

        draft.movements.unshift(
          createMovement(`${pendingRecord.name} cobro pendiente`, `${method} · hace instantes`, pendingRecord.amount, {
            actor: CURRENT_ACTOR,
            actionType: "pending_collected",
            referenceType: pendingRecord.sourceType,
            referenceId: pendingRecord.sourceId,
          }),
        );
        appendAuditEntry(
          draft,
          createAuditEntry("pending_collected", {
            actor: CURRENT_ACTOR,
            label: "Pendiente cobrado",
            detail: `${pendingRecord.name} · ${method} · ${pendingRecord.amount}`,
            targetType: pendingRecord.sourceType,
            targetId: pendingRecord.sourceId,
            before: createPaymentSnapshot("Pendiente", "debt", pendingRecord.amount),
            after: createPaymentSnapshot(method, "paid", pendingRecord.amount),
          }),
        );
      });

      syncTurn(nextTurn);
      pushFlash({
        tone: "success",
        message: `Pendiente cobrado para ${pendingRecord.name}`,
      });
      return nextTurn;
    },
    [pushFlash, syncTurn],
  );

  const turns = useMemo(() => Object.values(turnsById), [turnsById]);
  const pendingRecords = useMemo(() => turns.flatMap((turn) => derivePendingItemsFromTurn(turn)), [turns]);
  const auditEvents = useMemo(
    () => turns.flatMap((turn) => deriveAuditEventsFromTurn(turn)).sort((a, b) => b.id.localeCompare(a.id)),
    [turns],
  );
  const cashMovements = useMemo(
    () => turns.flatMap((turn) => deriveCashMovementsFromTurn(turn)).sort((a, b) => b.id.localeCompare(a.id)),
    [turns],
  );
  const cashSummary = useMemo(() => deriveCashSummaryFromTurns(turns), [turns]);

  const value = useMemo(
    () => ({
      turnsById,
      pendingRecords,
      auditEvents,
      cashMovements,
      cashSummary,
      lastFlash,
      pushFlash,
      consumeFlash,
      currentActor: CURRENT_ACTOR,
      getTurnById,
      refreshTurn,
      updateTurn,
      markCourtPayment,
      markConsumptionPayment,
      markPlayerPayAll,
      addConsumptions,
      collectPending,
    }),
    [
      turnsById,
      pendingRecords,
      auditEvents,
      cashMovements,
      cashSummary,
      lastFlash,
      pushFlash,
      consumeFlash,
      getTurnById,
      refreshTurn,
      updateTurn,
      markCourtPayment,
      markConsumptionPayment,
      markPlayerPayAll,
      addConsumptions,
      collectPending,
    ],
  );

  return <TurnStoreContext.Provider value={value}>{children}</TurnStoreContext.Provider>;
}

export function useTurnStore() {
  const context = useContext(TurnStoreContext);

  if (!context) {
    throw new Error("useTurnStore must be used inside TurnStoreProvider");
  }

  return context;
}

export function useTurn(bookingId) {
  const {
    getTurnById,
    refreshTurn: refreshTurnFromStore,
    markCourtPayment: markCourtPaymentFromStore,
    markConsumptionPayment: markConsumptionPaymentFromStore,
    markPlayerPayAll: markPlayerPayAllFromStore,
    addConsumptions: addConsumptionsFromStore,
    pushFlash,
  } = useTurnStore();

  const turn = getTurnById(bookingId);

  const refreshTurn = useCallback(() => refreshTurnFromStore(bookingId), [refreshTurnFromStore, bookingId]);
  const markCourtPayment = useCallback(
    (playerIndex, method) => markCourtPaymentFromStore(bookingId, playerIndex, method),
    [markCourtPaymentFromStore, bookingId],
  );
  const markConsumptionPayment = useCallback(
    (playerIndex, method) => markConsumptionPaymentFromStore(bookingId, playerIndex, method),
    [markConsumptionPaymentFromStore, bookingId],
  );
  const markPlayerPayAll = useCallback(
    (playerIndex, method, mixedMethods) =>
      markPlayerPayAllFromStore(bookingId, playerIndex, method, mixedMethods),
    [markPlayerPayAllFromStore, bookingId],
  );
  const addConsumptions = useCallback(
    (payload) => addConsumptionsFromStore({ ...payload, bookingId }),
    [addConsumptionsFromStore, bookingId],
  );
  const getPlayerPending = useCallback((player) => player.courtDebt + getPendingConsumptionTotal(player), []);

  const playerMovements = useCallback(
    (player, playerIndex) => {
      if (!turn || !player) {
        return [];
      }

      const playerName = getPlayerName(player, playerIndex);
      return turn.movements
        .filter((movement) => movement.title.toLowerCase().includes(playerName.toLowerCase()))
        .slice(0, 4);
    },
    [turn],
  );

  return {
    turn,
    refreshTurn,
    markCourtPayment,
    markConsumptionPayment,
    markPlayerPayAll,
    addConsumptions,
    getPlayerMovements: playerMovements,
    getPlayerPending,
    pushFlash,
  };
}
