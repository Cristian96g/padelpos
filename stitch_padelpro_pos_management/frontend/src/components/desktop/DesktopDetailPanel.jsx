import { DesktopPanelCard } from "./DesktopPanelCard";

export function DesktopDetailPanel({ title, subtitle, action, children, className = "" }) {
  return (
    <DesktopPanelCard title={title} subtitle={subtitle} action={action} className={className}>
      {children}
    </DesktopPanelCard>
  );
}
