import { Outlet, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { BottomNav } from "../navigation/BottomNav";
import { GlobalFlash } from "../ui/GlobalFlash";
import { routeTitles } from "../navigation/navItems";
import { DesktopSidebar } from "./DesktopSidebar";
import { DesktopTopbar } from "./DesktopTopbar";

export function AppLayout() {
  const location = useLocation();
  const isTurnDetail = location.pathname.startsWith("/turnos/");
  const title = isTurnDetail ? "Turno" : routeTitles[location.pathname] ?? "PadelPro POS";

  return (
    <div className="min-h-screen bg-app lg:grid lg:min-h-screen lg:grid-cols-[260px_minmax(0,1fr)] lg:pb-0">
      <GlobalFlash />

      <DesktopSidebar />

      <div className="min-w-0 lg:flex lg:min-h-screen lg:flex-col">
        <DesktopTopbar pathname={location.pathname} />

        {!isTurnDetail && (
          <header className="sticky top-0 z-40 border-b border-line bg-app/85 backdrop-blur-xl lg:hidden">
            <div className="mx-auto flex max-w-lg items-center justify-between px-4 pb-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primaryDark text-primaryStrong shadow-glow">
                  PP
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-primaryStrong">
                    PadelPro POS
                  </p>
                  <h1 className="text-lg font-extrabold text-content">{title}</h1>
                </div>
              </div>
              <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-white/5 text-primaryStrong">
                <Bell size={18} />
              </button>
            </div>
          </header>
        )}

        <main className="mx-auto w-full max-w-lg px-4 pt-4 lg:max-w-none lg:flex-1 lg:px-6 lg:pt-6">
          <Outlet />
        </main>
      </div>

      {!isTurnDetail && <BottomNav />}
    </div>
  );
}
