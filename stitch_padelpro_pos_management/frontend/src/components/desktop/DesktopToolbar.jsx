export function DesktopToolbar({ left, right, className = "" }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`.trim()}>
      <div className="min-w-0 flex-1">{left}</div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}
