import { Navigate, Outlet, useLocation } from "react-router";
import { isAuthenticated } from "../data/authService";

export function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
