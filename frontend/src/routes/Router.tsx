import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "../pages/admin/Login";
import EventList from "../pages/common/EventList";
import EventDashboard from "../pages/common/EventDashboard";
import { ProtectedRoute } from "./ProtectedRoute";
import EditEvent from "../pages/admin/EditEvent";

const router = createBrowserRouter([
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />, // 보호된 라우트 래퍼
    children: [
      {
        path: "/admin/events/list",
        element: <EventList />,
      },
    ],
  },
  {
    element: <ProtectedRoute />, // 보호된 라우트 래퍼
    children: [
      {
        path: "/admin/events/dashboard/:id",
        element: <EventDashboard />,
      },
    ],
  },
  {
    element: <ProtectedRoute />, // 보호된 라우트 래퍼
    children: [
      {
        path: "/admin/events/edit/:id",
        element: <EditEvent />,
      },
    ],
  },
  {
    path: "/events/dashboard/:id",
    element: <EventDashboard />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}