import { NavLink } from "react-router-dom";
import { appNavItems } from "./navItems";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-app/90 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 pb-7 pt-2">
        {appNavItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-w-[68px] flex-col items-center rounded-2xl px-3 py-2 text-xs font-bold ${
                isActive ? "bg-primary text-[#13210c]" : "text-muted"
              }`
            }
          >
            <Icon size={18} />
            <span className="mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
