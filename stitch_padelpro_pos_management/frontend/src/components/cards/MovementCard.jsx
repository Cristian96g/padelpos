import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "../../lib/format";

export function MovementCard({ movement }) {
  const positive = movement.amount >= 0;

  return (
    <div className="surface-card flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            positive ? "bg-primary/12 text-primaryStrong" : "bg-danger/12 text-danger"
          }`}
        >
          {positive ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
        </div>
        <div>
          <p className="font-bold text-content">{movement.title}</p>
          <p className="text-sm text-muted">{movement.subtitle}</p>
        </div>
      </div>
      <p className={`text-lg font-extrabold ${positive ? "text-primaryStrong" : "text-danger"}`}>
        {positive ? "+" : ""}
        {formatCurrency(movement.amount)}
      </p>
    </div>
  );
}
