import { CalendarRange, Grid2x2, Home, Menu, Wallet } from "lucide-react";

export const appNavItems = [
  { to: "/", label: "Inicio", icon: Home, end: true },
  { to: "/turnos", label: "Turnos", icon: CalendarRange },
  { to: "/consumos", label: "Consumos", icon: Grid2x2 },
  { to: "/caja", label: "Caja", icon: Wallet },
  { to: "/mas", label: "Mas", icon: Menu },
];

export const routeTitles = {
  "/": "Inicio",
  "/turnos": "Turnos",
  "/consumos": "Consumos",
  "/caja": "Caja",
  "/mas": "Mas",
};
