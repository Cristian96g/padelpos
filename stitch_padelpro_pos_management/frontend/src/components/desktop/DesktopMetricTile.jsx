export function DesktopMetricTile({
  title,
  label,
  value,
  detail,
  tone = "default",
  percentage,
  onClick,
  className = "",
}) {
  const resolvedTitle = title ?? label;
  const accentClass =
    tone === "cash"
      ? "border-primary/20 bg-primary/12 text-primaryStrong"
      : tone === "transfer"
        ? "border-info/20 bg-info/12 text-info"
        : tone === "pending"
          ? "border-warning/40 bg-[linear-gradient(180deg,rgba(255,184,77,0.18),rgba(255,184,77,0.08))] text-warning shadow-[0_18px_48px_rgba(255,184,77,0.08)]"
          : "border-line bg-white/5 text-content";
  const titleClass =
    tone === "pending"
      ? "text-warning"
      : tone === "transfer"
        ? "text-info"
        : tone === "cash"
          ? "text-primaryStrong"
          : "text-muted";
  const valueClass =
    tone === "pending"
      ? "text-warning"
      : tone === "transfer"
        ? "text-info"
        : tone === "cash"
          ? "text-primaryStrong"
          : "text-content";
  const detailClass =
    tone === "pending"
      ? "text-warning/90"
      : tone === "transfer"
        ? "text-info/80"
        : tone === "cash"
          ? "text-primaryStrong/80"
          : "text-muted";

  const content = (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className={`metric-label ${titleClass}`}>{resolvedTitle}</p>
        {typeof percentage === "number" ? <span className="text-xs font-extrabold">{percentage}%</span> : null}
      </div>
      <p className={`mt-1.5 text-[26px] font-extrabold leading-none ${valueClass}`}>{value}</p>
      {detail ? <p className={`mt-2 text-xs font-bold ${detailClass}`}>{detail}</p> : null}
      {typeof percentage === "number" ? (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
          <div
            className={`h-full rounded-full ${
              tone === "transfer" ? "bg-info" : tone === "pending" ? "bg-warning" : "bg-primary"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`rounded-[24px] border px-4 py-4 text-left transition-all duration-200 hover:bg-white/[0.08] ${accentClass} ${className}`.trim()}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={`rounded-[24px] border px-4 py-4 ${accentClass} ${className}`.trim()}>
      {content}
    </div>
  );
}
