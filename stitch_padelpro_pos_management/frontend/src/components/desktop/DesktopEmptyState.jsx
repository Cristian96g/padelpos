export function DesktopEmptyState({ title, description, actionLabel, onAction, className = "" }) {
  return (
    <div
      className={`flex min-h-[220px] flex-col items-center justify-center rounded-[28px] border border-dashed border-line bg-white/[0.03] px-8 text-center ${className}`.trim()}
    >
      <p className="text-lg font-extrabold text-content">{title}</p>
      <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction} className="button-primary mt-5 px-4 py-3 text-sm font-extrabold">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
