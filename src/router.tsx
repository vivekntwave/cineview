import { createBrowserRouter, Navigate } from "react-router";
import { ShellLayout, NotFoundPage } from "./Common/index.ts";
import { HomePage, MovieDetailPage } from "./Movies/index.ts";
import { SearchPage } from "./Search/index.ts";
import { TVShowLayout, TVShowDetailPage, SeasonDetailPage } from "./TVShows/index.ts";
import { CollectionDetailPage, CollectionsPage, WatchlistPage } from "./Collection/index.ts";
import { PreferencesPage } from "./Preferences/index.ts";
import { LoginPage, ProtectedRoute } from "./Auth/index.ts";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <ShellLayout />, children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "movie/:id",
            element: <MovieDetailPage />,
          },
          {
            path: "search",
            element: <SearchPage />,
          },
          {
            path: "tv/:id",
            element: <TVShowLayout />,
            children: [
              {
                index: true,
                element: <TVShowDetailPage />,
              },
              {
                path: "season/:seasonNumber",
                element: <SeasonDetailPage />,
              },
            ],
          },
          {
            path: "collections",
            element: <CollectionsPage />,
          },
          {
            path: "collection/:id",
            element: <CollectionDetailPage />,
          },
          {
            path: "watchlist",
            element: <WatchlistPage />,
          },
          {
            path: "preferences",
            element: <PreferencesPage />,
          },
          {
            path: "404",
            element: <NotFoundPage />,
          },
          {
            path: "*",
            element: <Navigate to="/404" replace />,
          },
        ],
      },
    ],
  },
]);
