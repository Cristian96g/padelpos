import { useEffect, useMemo, useState } from "react";

export function BottomSheet({
  onClose,
  children,
  height = "72dvh",
  maxHeight = "80dvh",
  fitContent = false,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartY, setTouchStartY] = useState(null);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => setIsVisible(true));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const sheetStyle = useMemo(
    () => ({
      transform: isVisible
        ? `translateY(${dragOffset}px)`
        : "translateY(100%)",
      transition: isDragging ? "none" : "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
    }),
    [dragOffset, isDragging, isVisible],
  );

  function handleTouchStart(event) {
    setTouchStartY(event.touches[0].clientY);
    setIsDragging(true);
  }

  function handleTouchMove(event) {
    if (touchStartY === null) {
      return;
    }

    const nextOffset = Math.max(0, event.touches[0].clientY - touchStartY);
    setDragOffset(nextOffset);
  }

  function handleTouchEnd() {
    setIsDragging(false);

    if (dragOffset > 110) {
      onClose();
      return;
    }

    setTouchStartY(null);
    setDragOffset(0);
  }

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Cerrar panel"
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className="absolute bottom-0 left-0 right-0 mx-auto flex max-w-lg flex-col overflow-hidden rounded-t-[30px] border border-b-0 border-line bg-appRaised shadow-card"
        style={sheetStyle}
      >
        <div
          className="px-4 pb-2 pt-2"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="sheet-handle mx-auto h-1.5 w-14 rounded-full bg-white/10" />
        </div>

        <div
          style={fitContent ? { maxHeight } : { height, maxHeight }}
          className={`overscroll-contain pb-[calc(20px+env(safe-area-inset-bottom))] ${
            fitContent ? "overflow-y-visible" : "overflow-y-auto"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
