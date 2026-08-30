import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./auth/LoginPage";
import { ProtectRoute } from "./lib/protectRoute";
import { getCurrentUser, homeRouteForRole } from "./lib/auth";

import { AdminShell } from "./users/admin/AdminShell";
import { HealthWorkerShell } from "./users/health_worker/HealthWorkerShell";
import { PatientShell } from "./users/patient/PatientShell";

/**
 * One route per role root (`/admin`, `/health_worker`, `/patient`) --
 * same shape as TechCare's App.tsx routing table (`/admin`, `/doctor`,
 * `/frontdesk-staff`, ...). Which *page* is showing within a role is not a
 * separate route; it's the `?page=` query param each shell reads, so the
 * whole role's UI lives under one URL, matching TechCare's per-role
 * shell + SideBar(?page=) + pages/ pattern rather than nested routes.
 */
function DashboardRedirect() {
  const user = getCurrentUser();
  return <Navigate to={user ? homeRouteForRole(user.role) : "/login"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectRoute roles={["admin"]}>
            <AdminShell />
          </ProtectRoute>
        }
      />

      <Route
        path="/health_worker"
        element={
          <ProtectRoute roles={["health_worker"]}>
            <HealthWorkerShell />
          </ProtectRoute>
        }
      />

      <Route
        path="/patient"
        element={
          <ProtectRoute roles={["patient"]}>
            <PatientShell />
          </ProtectRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}