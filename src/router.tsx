import { createBrowserRouter } from "react-router";

import { authRoutes } from "./Auth/data/routes";
import { movieRoutes } from "./Movies/data/routes";
import { tvRoutes } from "./TVShows/data/routes";
import { searchRoutes } from "./Search/data/routes";
import { collectionRoutes } from "./Collection/data/routes";
import { preferencesRoutes } from "./Preferences/data/routes";
import { commonRoutes } from "./Common/data/routes";

export const router = createBrowserRouter([
  ...authRoutes,
  ...movieRoutes,
  ...tvRoutes,
  ...searchRoutes,
  ...collectionRoutes,
  ...preferencesRoutes,
  ...commonRoutes,
]);
