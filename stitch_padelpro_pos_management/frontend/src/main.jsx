import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { TurnStoreProvider } from "./store/TurnStoreProvider";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TurnStoreProvider>
      <RouterProvider router={router} />
    </TurnStoreProvider>
  </React.StrictMode>,
);
