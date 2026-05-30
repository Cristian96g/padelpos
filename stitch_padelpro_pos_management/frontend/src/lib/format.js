export function formatCurrency(amount) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function statusTone(status) {
  const tones = {
    free: "bg-white/6 text-muted",
    partial: "bg-warning/15 text-warning",
    paid: "bg-primary/15 text-primaryStrong",
    debt: "bg-danger/15 text-danger",
    pending: "bg-warning/15 text-warning",
  };

  return tones[status] ?? "bg-white/6 text-muted";
}
