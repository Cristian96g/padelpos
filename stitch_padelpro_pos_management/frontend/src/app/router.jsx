import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { BookingsPage } from "../pages/BookingsPage";
import { TurnDetailPage } from "../pages/TurnDetailPage";
import { ConsumptionsPage } from "../pages/ConsumptionsPage";
import { CashPage } from "../pages/CashPage";
import { MorePage } from "../pages/MorePage";
import { AppErrorPage } from "../pages/AppErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <AppErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "turnos", element: <BookingsPage /> },
      { path: "turnos/:bookingId", element: <TurnDetailPage /> },
      { path: "consumos", element: <ConsumptionsPage /> },
      { path: "caja", element: <CashPage /> },
      { path: "mas", element: <MorePage /> },
    ],
  },
]);
