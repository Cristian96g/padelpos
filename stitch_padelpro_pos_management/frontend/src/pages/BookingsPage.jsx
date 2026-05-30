import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronRight, CreditCard, Receipt, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DesktopContextHeader } from "../components/desktop/DesktopContextHeader";
import { DesktopEmptyState } from "../components/desktop/DesktopEmptyState";
import { DesktopDetailPanel } from "../components/desktop/DesktopDetailPanel";
import { DesktopFilterChips } from "../components/desktop/DesktopFilterChips";
import { DesktopPanelCard } from "../components/desktop/DesktopPanelCard";
import { bookingGroups } from "../mocks/data";
import { BookingCard } from "../components/cards/BookingCard";
import { formatCurrency } from "../lib/format";
import { getPendingConsumptionTotal, getPlayerName } from "../lib/turnStore";
import { useTurnStore } from "../store/TurnStoreProvider";

const desktopFilters = ["Todos", "Con deuda", "Pagados", "Libres"];

function cleanDesktopText(value) {
  return typeof value === "string" ? value.replaceAll("Â-", "-") : value;
}

function getBookingStatusLabel(status) {
  switch (status) {
    case "partial":
      return "Parcial";
    case "debt":
      return "Deuda";
    case "pending":
      return "Pendiente";
    case "paid":
      return "Pagado";
    case "free":
      return "Libre";
    default:
      return "Activo";
  }
}

function getStatusClasses(status, selected) {
  if (status === "free") {
    return selected ? "border-white/15 bg-white/6 text-content" : "border-line bg-white/[0.03] text-muted";
  }

  if (status === "debt" || status === "pending") {
    return selected
      ? "border-danger/30 bg-danger/12 text-danger"
      : "border-danger/15 bg-danger/8 text-danger";
  }

  if (status === "partial") {
    return selected
      ? "border-warning/30 bg-warning/12 text-warning"
      : "border-warning/15 bg-warning/8 text-warning";
  }

  return selected
    ? "border-primary/25 bg-primary/12 text-primaryStrong"
    : "border-primary/10 bg-primary/8 text-primaryStrong";
}

function getPlayerDebt(player) {
  return player.courtDebt + getPendingConsumptionTotal(player);
}

function getPlayerStatus(player) {
  const consumptionDebt = getPendingConsumptionTotal(player);

  if (player.courtDebt > 0 && consumptionDebt > 0) {
    return "Cancha + consumo";
  }

  if (player.courtDebt > 0) {
    return "Cancha pendiente";
  }

  if (consumptionDebt > 0) {
    return "Consumo pendiente";
  }

  return "Pagado";
}

function getPlayerConsumptionCount(player) {
  return player.consumptions.reduce((acc, item) => acc + item.quantity, 0);
}

function getDesktopSummary(booking, turn) {
  if (turn) {
    const paidPlayers = turn.players.filter((player) => getPlayerDebt(player) <= 0).length;
    const debtPlayers = turn.players.filter((player) => getPlayerDebt(player) > 0).length;
    const pendingConsumptions = turn.players.reduce((acc, player) => acc + getPendingConsumptionTotal(player), 0);

    return {
      title: turn.title,
      subtitle: turn.customerName,
      playersCount: turn.players.length,
      paidPlayers,
      debtPlayers,
      courtTotal: turn.courtTotal,
      consumptionTotal: turn.consumptionTotal,
      grandTotal: turn.grandTotal,
      pendingTotal: turn.pendingTotal,
      pendingConsumptions,
      players: turn.players,
      status: turn.status,
      summary: turn.summary,
    };
  }

    return {
      title: cleanDesktopText(booking.slotLabel),
      subtitle: booking.customerName,
    playersCount: booking.playersCount,
    paidPlayers: booking.status === "paid" ? booking.playersCount : 0,
    debtPlayers: booking.debt > 0 ? booking.playersCount : 0,
    courtTotal: booking.courtTotal,
    consumptionTotal: booking.consumptionTotal,
    grandTotal: booking.courtTotal + booking.consumptionTotal,
    pendingTotal: booking.debt,
    pendingConsumptions: 0,
    players: [],
    status: booking.status,
    summary: null,
  };
}

function DesktopBookingRow({ booking, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(booking.id)}
      className={`w-full rounded-[20px] border px-3.5 py-2.5 text-left transition-all duration-200 ${
        selected ? "bg-white/6 shadow-[0_16px_40px_rgba(0,0,0,0.14)]" : "hover:bg-white/[0.04]"
      } ${selected ? "border-primary/20" : "border-line"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-extrabold text-content">{booking.court}</p>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-extrabold ${getStatusClasses(booking.status, selected)}`}>
              {getBookingStatusLabel(booking.status)}
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm font-bold text-content">{booking.customerName}</p>
          <p className="mt-0.5 text-[11px] text-muted">{booking.playersCount} jugadores</p>
        </div>

        <div className="text-right">
          <p className={`text-sm font-extrabold ${booking.debt > 0 ? "text-danger" : "text-primaryStrong"}`}>
            {booking.debt > 0 ? formatCurrency(booking.debt) : "OK"}
          </p>
        </div>
      </div>
    </button>
  );
}

function DesktopPlayerRow({ player, index, selected, onSelect, onOpenTurn }) {
  const debt = getPlayerDebt(player);
  const consumptions = getPlayerConsumptionCount(player);
  const actionLabel = debt > 0 ? "Cobrar" : "Ver turno";

  return (
    <div
      className={`rounded-[20px] border px-3.5 py-2.5 transition-all duration-200 ${
        selected ? "border-primary/20 bg-primary/10" : "border-line bg-white/5"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-extrabold text-content">{getPlayerName(player, index)}</p>
          <p className="mt-0.5 text-xs text-muted">{getPlayerStatus(player)}</p>
        </button>
        <p className={`text-sm font-extrabold ${debt > 0 ? "text-danger" : "text-primaryStrong"}`}>
          {debt > 0 ? formatCurrency(debt) : "OK"}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] text-muted">
          <span>{consumptions} consumos</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>{player.courtMethod}</span>
        </div>

        <button
          type="button"
          onClick={onOpenTurn}
          className="button-secondary flex items-center gap-2 px-3 py-2 text-xs font-bold"
        >
          {actionLabel}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function DesktopTurnSummary({ booking, turn, selectedPlayer, selectedPlayerIndex }) {
  const navigate = useNavigate();
  const summary = getDesktopSummary(booking, turn);
  const hasPlayerContext = turn && selectedPlayer;
  const playerDebt = hasPlayerContext ? getPlayerDebt(selectedPlayer) : 0;
  const playerConsumptions = hasPlayerContext ? getPlayerConsumptionCount(selectedPlayer) : 0;

  return (
    <aside>
      <DesktopDetailPanel
        title={hasPlayerContext ? getPlayerName(selectedPlayer, selectedPlayerIndex ?? 0) : "Contexto del turno"}
        subtitle={hasPlayerContext ? getPlayerStatus(selectedPlayer) : summary.subtitle}
        action={
          hasPlayerContext ? (
            <p className={`text-sm font-extrabold ${playerDebt > 0 ? "text-danger" : "text-primaryStrong"}`}>
              {playerDebt > 0 ? formatCurrency(playerDebt) : "OK"}
            </p>
          ) : (
            <span className={`rounded-full border px-2.5 py-1 text-xs font-extrabold ${getStatusClasses(summary.status, true)}`}>
              {getBookingStatusLabel(summary.status)}
            </span>
          )
        }
      >
        {hasPlayerContext ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[20px] border border-line bg-white/5 px-3.5 py-3">
                <p className="metric-label">Cancha</p>
                <p className="mt-1 text-lg font-extrabold text-content">{formatCurrency(selectedPlayer.courtShare)}</p>
              </div>
              <div className="rounded-[20px] border border-line bg-white/5 px-3.5 py-3">
                <p className="metric-label">Consumos</p>
                <p className="mt-1 text-lg font-extrabold text-content">{playerConsumptions}</p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between gap-3 rounded-[18px] border border-line bg-white/5 px-3.5 py-2.5">
                <span className="text-sm font-bold text-muted">Metodo cancha</span>
                <span className="text-sm font-extrabold text-content">{selectedPlayer.courtMethod}</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[18px] border border-line bg-white/5 px-3.5 py-2.5">
                <span className="text-sm font-bold text-muted">Pendiente consumo</span>
                <span className="text-sm font-extrabold text-warning">
                  {formatCurrency(getPendingConsumptionTotal(selectedPlayer))}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-extrabold text-content">{summary.title}</h2>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[20px] border border-line bg-white/5 px-3.5 py-3">
                <p className="metric-label">Turno</p>
                <p className="mt-1 text-lg font-extrabold text-content">{formatCurrency(summary.grandTotal)}</p>
              </div>
              <div className="rounded-[20px] border border-line bg-danger/8 px-3.5 py-3">
                <p className="metric-label">Por cobrar</p>
                <p className="mt-1 text-lg font-extrabold text-danger">{formatCurrency(summary.pendingTotal)}</p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between gap-3 rounded-[18px] border border-line bg-white/5 px-3.5 py-2.5">
                <span className="text-sm font-bold text-muted">Cancha</span>
                <span className="text-sm font-extrabold text-content">{formatCurrency(summary.courtTotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[18px] border border-line bg-white/5 px-3.5 py-2.5">
                <span className="text-sm font-bold text-muted">Consumos</span>
                <span className="text-sm font-extrabold text-content">{formatCurrency(summary.consumptionTotal)}</span>
              </div>
            </div>
          </>
        )}

        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => navigate(`/turnos/${booking.id}`)}
            className="button-primary flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-extrabold"
          >
            <Wallet size={16} />
            Abrir turno completo
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                navigate(`/turnos/${booking.id}`, {
                  state: {
                    quickAction: "payment",
                  },
                })
              }
              className="button-secondary flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold"
            >
              <CreditCard size={14} />
              Cobrar
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(`/turnos/${booking.id}`, {
                  state: {
                    quickAction: "consumption",
                  },
                })
              }
              className="button-secondary flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold"
            >
              <Receipt size={14} />
              Consumo
            </button>
          </div>
        </div>
      </DesktopDetailPanel>
    </aside>
  );
}

function MobileBookingsView() {
  return (
    <div className="space-y-5 pb-4 lg:hidden">
      <section className="flex items-center justify-between rounded-3xl border border-line bg-white/5 p-4">
        <div>
          <p className="section-title">Hoy</p>
          <p className="mt-1 text-lg font-extrabold text-content">Viernes, 22 de mayo</p>
        </div>
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primaryDark text-primaryStrong">
          <CalendarDays size={18} />
        </button>
      </section>

      {bookingGroups.map((group) => (
        <section key={group.slot} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <p className="section-title">{group.slot}</p>
            <div className="h-px flex-1 bg-line" />
          </div>

          <div className="space-y-3">
            {group.bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function BookingsPage() {
  const { turnsById } = useTurnStore();
  const navigate = useNavigate();

  const desktopBookings = useMemo(
    () =>
      bookingGroups.flatMap((group) =>
        group.bookings.map((booking) => ({
          ...booking,
          slot: group.slot,
          slotLabel: `${group.slot} - ${booking.court}`,
        })),
      ),
    [],
  );

  const [selectedBookingId, setSelectedBookingId] = useState(desktopBookings[0]?.id ?? null);
  const [activeDesktopFilter, setActiveDesktopFilter] = useState("Todos");
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);

  useEffect(() => {
    if (!desktopBookings.some((booking) => booking.id === selectedBookingId)) {
      setSelectedBookingId(desktopBookings[0]?.id ?? null);
    }
  }, [desktopBookings, selectedBookingId]);

  const filteredDesktopBookings = useMemo(() => {
    if (activeDesktopFilter === "Todos") {
      return desktopBookings;
    }

    if (activeDesktopFilter === "Con deuda") {
      return desktopBookings.filter((booking) => booking.debt > 0);
    }

    if (activeDesktopFilter === "Pagados") {
      return desktopBookings.filter((booking) => booking.status === "paid");
    }

    return desktopBookings.filter((booking) => booking.status === "free");
  }, [activeDesktopFilter, desktopBookings]);

  const selectedBooking = useMemo(
    () => filteredDesktopBookings.find((booking) => booking.id === selectedBookingId) ?? filteredDesktopBookings[0] ?? null,
    [filteredDesktopBookings, selectedBookingId],
  );

  const selectedTurn = selectedBooking ? turnsById[selectedBooking.id] ?? null : null;
  const selectedPlayer = selectedTurn?.players?.[selectedPlayerIndex] ?? selectedTurn?.players?.[0] ?? null;
  const groupedDesktopBookings = useMemo(
    () =>
      bookingGroups.map((group) => ({
        ...group,
        bookings: group.bookings.map((booking) => ({
          ...booking,
          slot: group.slot,
          slotLabel: `${group.slot} - ${booking.court}`,
        })),
      })),
    [],
  );

  useEffect(() => {
    setSelectedPlayerIndex(0);
  }, [selectedBookingId]);

  return (
    <>
      <MobileBookingsView />

      <div className="hidden min-h-[calc(100vh-180px)] flex-col gap-5 lg:flex">
        <DesktopContextHeader
          eyebrow="Turnos"
          title="Agenda de hoy"
          description="Selecciona un turno, detecta deuda rapido y entra directo al flujo operativo."
          className="mb-1"
        />

        <section className="grid grid-cols-[280px_minmax(0,1fr)_320px] gap-4">
          <DesktopPanelCard
            title="Hoy"
            subtitle="Agenda compacta"
            action={
              <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primaryDark text-primaryStrong">
                <CalendarDays size={18} />
              </button>
            }
          >
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted">Filtrar agenda</p>
            <DesktopFilterChips
              items={desktopFilters}
              activeItem={activeDesktopFilter}
              onChange={setActiveDesktopFilter}
            />

            <div className="mt-4 space-y-3">
              {groupedDesktopBookings.map((group) => {
                const visibleBookings = group.bookings.filter((booking) =>
                  filteredDesktopBookings.some((filteredBooking) => filteredBooking.id === booking.id),
                );

                if (visibleBookings.length === 0) {
                  return null;
                }

                return (
                  <section key={group.slot} className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <div className="h-px flex-1 bg-line" />
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted">{group.slot}</p>
                      <div className="h-px flex-1 bg-line" />
                    </div>

                    <div className="space-y-2">
                      {visibleBookings.map((booking) => (
                        <DesktopBookingRow
                          key={booking.id}
                          booking={booking}
                          selected={booking.id === selectedBooking?.id}
                          onSelect={setSelectedBookingId}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}

              {filteredDesktopBookings.length === 0 && (
                <DesktopEmptyState
                  className="min-h-[220px]"
                  title="Sin turnos para este filtro"
                  description="No hay turnos que coincidan con la lectura operativa seleccionada."
                />
              )}
            </div>
          </DesktopPanelCard>

          <DesktopPanelCard
            title="Turno activo"
            subtitle={
              selectedTurn
                ? `${selectedTurn.players.length} jugadores activos - ${selectedTurn.customerName}`
                : selectedBooking
                  ? `${selectedBooking.playersCount} jugadores - ${selectedBooking.customerName}`
                  : ""
            }
            action={
              selectedBooking ? (
                <Link
                  to={`/turnos/${selectedBooking.id}`}
                  className="button-secondary flex items-center gap-2 px-3 py-2 text-sm font-bold"
                >
                  Abrir turno
                  <ChevronRight size={15} />
                </Link>
              ) : null
            }
          >
            {selectedBooking ? (
              <>
                <div className="rounded-[20px] border border-line bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-lg font-extrabold text-content">{cleanDesktopText(selectedBooking.slotLabel)}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {selectedTurn
                        ? `${selectedTurn.players.length} jugadores activos - ${selectedTurn.customerName}`
                        : `${selectedBooking.playersCount} jugadores - ${selectedBooking.customerName}`}
                    </p>
                  </div>

                </div>

                {selectedTurn ? (
                  <div className="mt-4 space-y-2.5">
                    {selectedTurn.players.map((player, index) => (
                      <DesktopPlayerRow
                        key={player.id}
                        player={player}
                        index={index}
                        selected={index === selectedPlayerIndex}
                        onSelect={() => setSelectedPlayerIndex(index)}
                        onOpenTurn={() =>
                          navigate(`/turnos/${selectedBooking.id}`, {
                            state: {
                              quickAction: getPlayerDebt(player) > 0 ? "payment" : undefined,
                            },
                          })
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-5">
                    <DesktopEmptyState
                      className="min-h-[360px]"
                      title="Detalle rapido no disponible"
                      description="Este turno todavia no tiene el desglose completo cargado en el store. Podes abrirlo igual y continuar el flujo operativo desde la vista completa."
                      action={
                        <button
                          type="button"
                          onClick={() => navigate(`/turnos/${selectedBooking.id}`)}
                          className="button-primary px-4 py-3 text-sm font-extrabold"
                        >
                          Ir al turno
                        </button>
                      }
                    />
                  </div>
                )}
              </>
            ) : null}
          </DesktopPanelCard>

          {selectedBooking ? (
            <DesktopTurnSummary
              booking={selectedBooking}
              turn={selectedTurn}
              selectedPlayer={selectedPlayer}
              selectedPlayerIndex={selectedPlayerIndex}
            />
          ) : (
            <div />
          )}
        </section>
      </div>
    </>
  );
}

