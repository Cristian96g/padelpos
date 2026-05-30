import { DesktopToolbar } from "./DesktopToolbar";

export function DesktopContextHeader({
  eyebrow,
  title,
  description,
  leading,
  actions,
  className = "",
}) {
  return (
    <DesktopToolbar
      className={className}
      left={
        <div className="flex items-center gap-3">
          {leading ? <div className="shrink-0">{leading}</div> : null}
          <div className="min-w-0">
            {eyebrow ? <p className="section-title">{eyebrow}</p> : null}
            <h1 className="mt-1 text-[32px] font-extrabold tracking-[-0.03em] text-content">{title}</h1>
            {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
          </div>
        </div>
      }
      right={actions}
    />
  );
}
