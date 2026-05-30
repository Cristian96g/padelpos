export function DesktopActionBar({ primaryAction, secondaryAction, tertiaryAction, className = "" }) {
  return (
    <div
      className={`sticky bottom-0 z-10 rounded-[24px] border border-line bg-app/92 px-4 py-3 backdrop-blur-xl ${className}`.trim()}
    >
      <div className="flex items-center gap-3">
        {secondaryAction ? <div className="shrink-0">{secondaryAction}</div> : null}
        {primaryAction ? <div className="min-w-0 flex-1">{primaryAction}</div> : null}
        {tertiaryAction ? <div className="shrink-0">{tertiaryAction}</div> : null}
      </div>
    </div>
  );
}
