import { Search } from "lucide-react";

export function DesktopSearchField({
  value,
  onChange,
  placeholder,
  inputRef,
  className = "",
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-[24px] border border-line bg-white/5 px-4 py-3 text-sm text-muted ${className}`.trim()}
    >
      <Search size={17} />
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-bold text-content outline-none placeholder:text-muted"
      />
    </div>
  );
}
