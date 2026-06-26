import { createBrowserRouter } from "react-router";

import { movieRoutes } from "./Movies/data/routes";
import { tvRoutes } from "./TVShows/data/routes";
import { searchRoutes } from "./Search/data/routes";
import { collectionRoutes } from "./Collection/data/routes";
import { preferencesRoutes } from "./Preferences/data/routes";
import { ShellLayout, commonRoutes } from "./Common/index.ts";
import { LoginPage, ProtectedRoute } from "./Auth/index.ts";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <ShellLayout />,
        children: [
          ...movieRoutes,
          ...tvRoutes,
          ...searchRoutes,
          ...collectionRoutes,
          ...preferencesRoutes,
          ...commonRoutes,
        ],
      },
    ],
  },
]);
