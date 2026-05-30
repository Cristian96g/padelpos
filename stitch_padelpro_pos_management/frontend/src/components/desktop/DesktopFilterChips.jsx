export function DesktopFilterChips({ items, activeItem, onChange, className = "" }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`.trim()}>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`px-3.5 py-2 text-sm font-bold ${
            activeItem === item
              ? "button-secondary rounded-full border-primary/20 bg-primary/10 text-primaryStrong"
              : "pill-chip text-content"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
