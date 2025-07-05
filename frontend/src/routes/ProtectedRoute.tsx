import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function ProtectedRoute() {
  const { user, ready } = useContext(AuthContext);

  if (!ready) return null;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  return <Outlet />;
}