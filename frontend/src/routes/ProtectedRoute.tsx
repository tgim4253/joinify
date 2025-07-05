import { useContext } from "react";
import { Navigate, Outlet, useLocation} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function ProtectedRoute() {
  const { user, ready } = useContext(AuthContext);
  const location = useLocation(); 

  if (!ready) return null;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}