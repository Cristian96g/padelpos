import { turnDetails } from "../mocks/data";

const STORAGE_KEY = "padelpro-turns";
export const DEFAULT_ACTOR = "Mostrador";

export function cloneTurn(turn) {
  return JSON.parse(JSON.stringify(turn));
}

export function getPlayerName(player, index) {
  return player.name?.trim() ? player.name : `Jugador ${index + 1}`;
}

export function getConsumptionAmount(consumption) {
  return consumption.price * consumption.quantity;
}

export function getPendingConsumptionTotal(player) {
  return player.consumptions.reduce((acc, item) => {
    if (item.status === "debt") {
      return acc + getConsumptionAmount(item);
    }

    return acc;
  }, 0);
}

export function createPaymentSnapshot(method, status, amount) {
  return {
    method,
    status,
    amount,
  };
}

export function createMovement(title, meta, amount, options = {}) {
  const createdAt = options.createdAt ?? new Date().toISOString();

  return {
    id: `mv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    meta,
    amount,
    createdAt,
    actor: options.actor ?? DEFAULT_ACTOR,
    actionType: options.actionType ?? "movement",
    referenceType: options.referenceType ?? null,
    referenceId: options.referenceId ?? null,
  };
}

export function createAuditEntry(actionType, options = {}) {
  const createdAt = options.createdAt ?? new Date().toISOString();

  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    actionType,
    label: options.label ?? actionType,
    detail: options.detail ?? "",
    actor: options.actor ?? DEFAULT_ACTOR,
    createdAt,
    targetType: options.targetType ?? "turn",
    targetId: options.targetId ?? null,
    before: options.before ?? null,
    after: options.after ?? null,
  };
}

export function appendAuditEntry(turn, entry) {
  turn.auditTrail = turn.auditTrail ?? [];
  turn.auditTrail.unshift(entry);
}

function getMovementMethod(meta = "") {
  const normalized = meta.toLowerCase();

  if (normalized.includes("transferencia")) {
    return "Transferencia";
  }

  if (normalized.includes("efectivo")) {
    return "Efectivo";
  }

  return "Pendiente";
}

function getMovementTone(method, amount) {
  if (amount < 0) {
    return "negative";
  }

  if (method === "Pendiente") {
    return "pending";
  }

  return "positive";
}

function getMovementCategory(title = "") {
  const normalized = title.toLowerCase();

  if (normalized.includes("consumo") || normalized.includes("gatorade") || normalized.includes("agua")) {
    return "Consumos";
  }

  if (normalized.includes("pendiente")) {
    return "Pendientes";
  }

  return "Canchas";
}

function formatTime(createdAt) {
  if (!createdAt) {
    return "Ahora";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Ahora";
  }

  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function recalculateTurn(turn) {
  let courtCash = 0;
  let courtTransfer = 0;
  let consumptionCash = 0;
  let consumptionTransfer = 0;
  let pendingTotal = 0;
  let consumptionTotal = 0;

  turn.players.forEach((player) => {
    if (player.courtStatus === "paid") {
      if (player.courtMethod === "Efectivo") {
        courtCash += player.courtShare;
      }

      if (player.courtMethod === "Transferencia") {
        courtTransfer += player.courtShare;
      }

      player.courtDebt = 0;
    } else {
      player.courtDebt = player.courtShare;
      player.courtMethod = "Pendiente";
      pendingTotal += player.courtShare;
    }

    player.consumptions.forEach((consumption) => {
      const amount = getConsumptionAmount(consumption);
      consumptionTotal += amount;

      if (consumption.status === "paid") {
        if (consumption.method === "Efectivo") {
          consumptionCash += amount;
        }

        if (consumption.method === "Transferencia") {
          consumptionTransfer += amount;
        }
      } else {
        consumption.method = "Pendiente";
        pendingTotal += amount;
      }
    });
  });

  const extraConsumptions = turn.extraConsumptions ?? [];

  extraConsumptions.forEach((consumption) => {
    const amount = getConsumptionAmount(consumption);
    consumptionTotal += amount;

    if (consumption.status === "paid") {
      if (consumption.method === "Efectivo") {
        consumptionCash += amount;
      }

      if (consumption.method === "Transferencia") {
        consumptionTransfer += amount;
      }
    } else {
      consumption.method = "Pendiente";
      pendingTotal += amount;
    }
  });

  const courtTotal = turn.players.reduce((acc, player) => acc + player.courtShare, 0);
  const grandTotal = courtTotal + consumptionTotal;

  return {
    ...turn,
    courtTotal,
    consumptionTotal,
    pendingTotal,
    grandTotal,
    status: pendingTotal === 0 ? "paid" : pendingTotal === grandTotal ? "debt" : "partial",
    summary: {
      courtCash,
      courtTransfer,
      consumptionCash,
      consumptionTransfer,
    },
    auditTrail: turn.auditTrail ?? [],
  };
}

function readStoredTurns() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function writeStoredTurns(turnMap) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(turnMap));
}

export function loadTurnById(bookingId) {
  const storedTurns = readStoredTurns();
  const baseTurn = storedTurns[bookingId] ?? turnDetails[bookingId];

  if (!baseTurn) {
    return null;
  }

  const recalculated = recalculateTurn(cloneTurn(baseTurn));
  storedTurns[bookingId] = recalculated;
  writeStoredTurns(storedTurns);
  return recalculated;
}

export function persistTurn(turn) {
  const storedTurns = readStoredTurns();
  storedTurns[turn.id] = recalculateTurn(cloneTurn(turn));
  writeStoredTurns(storedTurns);
  return storedTurns[turn.id];
}

export function updateTurnById(bookingId, mutator) {
  const currentTurn = loadTurnById(bookingId);

  if (!currentTurn) {
    return null;
  }

  const nextTurn = cloneTurn(currentTurn);
  mutator(nextTurn);
  return persistTurn(nextTurn);
}

export function appendConsumptionsToTurn({
  bookingId,
  association,
  cartItems,
  paymentMethod,
  customerName,
  actor = DEFAULT_ACTOR,
}) {
  return updateTurnById(bookingId, (draft) => {
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price ?? 0) * item.quantity, 0);
    const ownerName = customerName || association.label;

    const consumptions = cartItems.map((item) => ({
      id: `cons-${Date.now()}-${item.id}-${Math.random().toString(36).slice(2, 6)}`,
      name: item.name,
      price: item.price ?? 0,
      quantity: item.quantity,
      method: paymentMethod === "Pendiente" ? "Pendiente" : paymentMethod,
      status: paymentMethod === "Pendiente" ? "debt" : "paid",
      ownerName,
    }));

    if (association.type === "player") {
      const player = draft.players.find((item) => item.id === association.playerId);

      if (player) {
        player.consumptions.push(...consumptions);
      }
    } else {
      draft.extraConsumptions = draft.extraConsumptions ?? [];
      draft.extraConsumptions.push(
        ...consumptions.map((item) => ({
          ...item,
          targetLabel: association.label,
        })),
      );
    }

    const movementTitle =
      paymentMethod === "Pendiente"
        ? `${ownerName} dejo consumo pendiente`
        : `${ownerName} sumo consumos`;

    draft.movements.unshift(
      createMovement(movementTitle, `${paymentMethod} · hace instantes`, totalAmount, {
        actor,
        actionType: paymentMethod === "Pendiente" ? "pending_created" : "consumption_added",
        referenceType: association.type,
        referenceId: association.playerId ?? association.label,
      }),
    );

    appendAuditEntry(
      draft,
      createAuditEntry(paymentMethod === "Pendiente" ? "pending_created" : "consumption_added", {
        actor,
        label: paymentMethod === "Pendiente" ? "Pendiente registrado" : "Consumo registrado",
        detail: `${ownerName} · ${paymentMethod} · ${totalAmount}`,
        targetType: association.type === "player" ? "player" : "sale",
        targetId: association.playerId ?? association.label,
        after: {
          paymentMethod,
          totalAmount,
          items: consumptions.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
          })),
        },
      }),
    );
  });
}

export function derivePendingItemsFromTurn(turn) {
  const items = [];

  turn.players.forEach((player, index) => {
    if (player.courtDebt > 0) {
      items.push({
        id: `pending-court-${turn.id}-${player.id}`,
        name: getPlayerName(player, index),
        amount: player.courtDebt,
        context: `${turn.title} · Cancha`,
        type: "Cancha",
        turnId: turn.id,
        playerId: player.id,
        sourceType: "court",
        sourceId: player.id,
        status: "open",
      });
    }

    player.consumptions.forEach((consumption) => {
      if (consumption.status === "debt") {
        items.push({
          id: `pending-cons-${turn.id}-${player.id}-${consumption.id}`,
          name: getPlayerName(player, index),
          amount: getConsumptionAmount(consumption),
          context: `${turn.title} · ${consumption.name}`,
          type: "Consumos",
          turnId: turn.id,
          playerId: player.id,
          sourceType: "player-consumption",
          sourceId: consumption.id,
          status: "open",
        });
      }
    });
  });

  (turn.extraConsumptions ?? []).forEach((consumption) => {
    if (consumption.status === "debt") {
      items.push({
        id: `pending-extra-${turn.id}-${consumption.id}`,
        name: consumption.ownerName || consumption.targetLabel || "Visitante",
        amount: getConsumptionAmount(consumption),
        context: `${turn.title} · ${consumption.targetLabel || consumption.name}`,
        type: "Consumos",
        turnId: turn.id,
        sourceType: "extra-consumption",
        sourceId: consumption.id,
        status: "open",
      });
    }
  });

  return items;
}

export function deriveCashMovementsFromTurn(turn) {
  return (turn.movements ?? []).map((movement) => {
    const method = getMovementMethod(movement.meta);
    const category = getMovementCategory(movement.title);

    return {
      id: `${turn.id}-${movement.id}`,
      time: formatTime(movement.createdAt),
      title: movement.title,
      origin: turn.title,
      method,
      amount: movement.amount,
      tone: getMovementTone(method, movement.amount),
      category,
      detail: movement.meta,
      turnId: turn.id,
      actor: movement.actor ?? DEFAULT_ACTOR,
      createdAt: movement.createdAt ?? null,
      actionType: movement.actionType ?? "movement",
    };
  });
}

export function deriveAuditEventsFromTurn(turn) {
  return (turn.auditTrail ?? []).map((entry) => ({
    id: `${turn.id}-${entry.id}`,
    turnId: turn.id,
    time: formatTime(entry.createdAt),
    title: entry.label,
    detail: entry.detail,
    actor: entry.actor ?? DEFAULT_ACTOR,
    actionType: entry.actionType,
    targetType: entry.targetType,
    targetId: entry.targetId,
    createdAt: entry.createdAt ?? null,
  }));
}

export function deriveCashSummaryFromTurns(turns) {
  return turns.reduce(
    (acc, turn) => {
      acc.total += turn.grandTotal;
      acc.pending += turn.pendingTotal;
      acc.court.total += turn.courtTotal;
      acc.court.cash += turn.summary.courtCash;
      acc.court.transfer += turn.summary.courtTransfer;
      acc.court.pending += turn.players.reduce((sum, player) => sum + player.courtDebt, 0);
      acc.consumptions.total += turn.consumptionTotal;
      acc.consumptions.cash += turn.summary.consumptionCash;
      acc.consumptions.transfer += turn.summary.consumptionTransfer;
      acc.consumptions.pending += derivePendingItemsFromTurn(turn)
        .filter((item) => item.type === "Consumos")
        .reduce((sum, item) => sum + item.amount, 0);
      return acc;
    },
    {
      total: 0,
      pending: 0,
      court: {
        total: 0,
        cash: 0,
        transfer: 0,
        pending: 0,
      },
      consumptions: {
        total: 0,
        cash: 0,
        transfer: 0,
        pending: 0,
      },
    },
  );
}
