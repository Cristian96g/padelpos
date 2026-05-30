import { formatCurrency } from "../../lib/format";

export function MetricCard({ label, value, tone = "default", large = false }) {
  const toneClass = {
    default: "bg-white/5 text-content",
    primary: "bg-primary/10 text-primaryStrong",
    danger: "bg-danger/12 text-danger",
  }[tone];

  return (
    <div className={`surface-soft p-4 ${toneClass}`}>
      <p className="metric-label">{label}</p>
      <p className={large ? "mt-2 text-3xl font-extrabold" : "mt-2 text-xl font-extrabold"}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}
