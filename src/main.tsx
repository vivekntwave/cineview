import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import "./core/i18n";
import { syncPreferences } from "./core/syncPreferences";
import { router } from "./router";

syncPreferences();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);