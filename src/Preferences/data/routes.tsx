import type { RouteObject } from "react-router";

import { PreferencesPage } from "../ui/PreferencesPage";

export const preferencesRoutes: RouteObject[] = [
  {
    path: "/preferences",
    element: <PreferencesPage />,
  },
];
