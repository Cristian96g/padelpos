import { ArrowRight, Plus, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../lib/format";
import { StatusBadge } from "../ui/StatusBadge";

export function BookingCard({ booking }) {
  if (booking.status === "free") {
    return (
      <div className="surface-card flex min-h-[174px] flex-col items-center justify-center gap-3 border-dashed bg-transparent p-5 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white/5 text-muted">
          <Plus size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-content">{booking.court}</p>
          <p className="mt-1 text-sm text-muted">Disponible para nuevo turno</p>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/turnos/${booking.id}`} className="surface-card block min-h-[174px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="metric-label">{booking.court}</p>
          <h3 className="mt-1 text-lg font-extrabold text-content">{booking.customerName}</h3>
          <p className="mt-1 text-sm text-muted">{booking.playersCount} jugadores</p>
        </div>
        <StatusBadge status={booking.status}>
          {booking.status === "partial"
            ? "Parcial"
            : booking.status === "debt"
              ? "Deuda"
              : booking.status === "pending"
                ? "Pendiente"
                : "Pagado"}
        </StatusBadge>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/5 p-3">
          <p className="metric-label">Cancha</p>
          <p className="mt-1 text-base font-extrabold">{formatCurrency(booking.courtTotal)}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-3">
          <p className="metric-label">Consumos</p>
          <p className="mt-1 text-base font-extrabold">{formatCurrency(booking.consumptionTotal)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className={booking.debt > 0 ? "text-danger" : "text-primaryStrong"}>
          <p className="metric-label">Estado</p>
          <p className="mt-1 text-base font-extrabold">
            {booking.debt > 0 ? `Debe ${formatCurrency(booking.debt)}` : "Todo cobrado"}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-[#13210c]">
          {booking.debt > 0 ? <Wallet size={16} /> : <ArrowRight size={16} />}
          {booking.debt > 0 ? "Cobrar" : "Abrir"}
        </div>
      </div>
    </Link>
  );
}
