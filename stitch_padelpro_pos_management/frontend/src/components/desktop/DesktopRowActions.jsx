export function DesktopRowActions({ actions, className = "" }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`.trim()}>
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={action.onClick}
          className={action.primary ? "button-primary px-3 py-2 text-xs font-extrabold" : "button-secondary px-3 py-2 text-xs font-bold"}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
