import type { RouteObject } from "react-router";

import { HomePage } from "../ui/HomePage";
import { MovieDetailPage } from "../ui/MovieDetailPage";

export const movieRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/movies/:movieId",
    element: <MovieDetailPage />,
  },
];
