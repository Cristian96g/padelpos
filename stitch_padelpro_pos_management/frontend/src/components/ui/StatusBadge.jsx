import { statusTone } from "../../lib/format";

export function StatusBadge({ status, children }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusTone(status)}`}>
      {children}
    </span>
  );
}
