import type { RouteObject } from "react-router";

import { SearchPage } from "../ui/SearchPage";

export const searchRoutes: RouteObject[] = [
  {
    path: "/search",
    element: <SearchPage />,
  },
];
