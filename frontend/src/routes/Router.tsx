import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/admin/Login";
// import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/admin/login",
    element: <Login />,
  },
//   {
//     element: <ProtectedRoute />, // 보호된 라우트 래퍼
//     children: [
//       {
//         path: "/",
//         element: <Dashboard />,
//       },
//     ],
//   },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}