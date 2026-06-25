import type { RouteObject } from "react-router";

import { TVShowDetailPage } from "../ui/TVShowDetailPage";
import { SeasonDetailPage } from "../ui/SeasonDetailPage";

export const tvRoutes: RouteObject[] = [
  {
    path: "/tv/:showId",
    element: <TVShowDetailPage />,
  },
  {
    path: "/tv/:showId/seasons/:seasonNumber",
    element: <SeasonDetailPage />,
  },
];
