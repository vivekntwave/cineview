import type { RouteObject } from "react-router";

import { WatchlistPage } from "../ui/WatchlistPage";
import { CollectionsPage } from "../ui/CollectionsPage";
import { CollectionDetailPage } from "../ui/CollectionDetailPage";

export const collectionRoutes: RouteObject[] = [
  {
    path: "/watchlist",
    element: <WatchlistPage />,
  },
  {
    path: "/collections",
    element: <CollectionsPage />,
  },
  {
    path: "/collections/:collectionId",
    element: <CollectionDetailPage />,
  },
];
