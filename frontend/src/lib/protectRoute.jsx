import { Navigate } from "react-router";
import { getCurrentUser, homeRouteForRole } from "./auth.js";

/**
 * Route guard -- the original app enforced this with 'role' middleware in
 * routes/web.php;
 * (lib/protectRoute.js) as an empty stub. Implemented here for real, since
 * this system needs it: no URL should be reachable without a valid session
 * and matching role.
 */

export function ProtectRoute({ roles, children }) {
  const user = getCurrentUser();

  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to={homeRouteForRole(user.role)} replace />;

  return <>{children}</>;
}
