import { CheckCircle2, AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import { useTurnStore } from "../../store/TurnStoreProvider";

function getFlashStyles(tone) {
  if (tone === "warning") {
    return {
      icon: AlertTriangle,
      wrapper: "border-warning/25 bg-warning/14 text-warning",
      iconBox: "bg-warning/14 text-warning",
    };
  }

  return {
    icon: CheckCircle2,
    wrapper: "border-primary/20 bg-primary/12 text-primaryStrong",
    iconBox: "bg-primary/14 text-primaryStrong",
  };
}

export function GlobalFlash() {
  const { lastFlash, consumeFlash } = useTurnStore();

  useEffect(() => {
    if (!lastFlash) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      consumeFlash();
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [consumeFlash, lastFlash]);

  if (!lastFlash) {
    return null;
  }

  const styles = getFlashStyles(lastFlash.tone);
  const Icon = styles.icon;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[90] px-4">
      <div className="mx-auto max-w-lg">
        <div
          className={`pointer-events-auto flex items-center gap-3 rounded-[26px] border px-3.5 py-3 shadow-card backdrop-blur-xl ${styles.wrapper}`}
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${styles.iconBox}`}>
            <Icon size={18} />
          </div>

          <p className="min-w-0 flex-1 text-sm font-extrabold">{lastFlash.message}</p>

          <button
            type="button"
            onClick={consumeFlash}
            className="button-secondary flex h-9 w-9 items-center justify-center border-0 bg-white/8"
            aria-label="Cerrar mensaje"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
