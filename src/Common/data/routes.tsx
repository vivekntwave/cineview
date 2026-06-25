import type { RouteObject } from "react-router";

import { NotFoundPage } from "../ui/NotFoundPage";

export const commonRoutes: RouteObject[] = [
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
