export function DesktopPanelCard({
  title,
  subtitle,
  action,
  className = "",
  bodyClassName = "",
  children,
}) {
  return (
    <section className={`surface-card p-5 ${className}`.trim()}>
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between gap-3">
          <div>
            {title ? <p className="section-title">{title}</p> : null}
            {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}

      <div className={title || subtitle || action ? `mt-4 ${bodyClassName}`.trim() : bodyClassName}>
        {children}
      </div>
    </section>
  );
}
