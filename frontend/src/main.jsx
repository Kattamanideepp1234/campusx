import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./layouts/ProtectedRoute";
import AssetsPage from "./pages/AssetsPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "assets", element: <AssetsPage /> },
      { path: "login", element: <AuthPage mode="login" /> },
      { path: "signup", element: <AuthPage mode="signup" /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
