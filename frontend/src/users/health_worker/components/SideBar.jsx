import { useSearchParams } from "react-router";

const NAV = [
  { key: "dashboard", label: "Dashboard" },
  { key: "patients", label: "Patients" },
  { key: "appointments", label: "Appointments" },
];

/**
 * Primary nav, rendered inside the shared topbar -- mirrors the plain-text
 * nav links for the admin workspace
 * (no icons for staff nav; the patient portal nav is the one with icons).
 * Drives the active page via the `?page=` query param.
 */
export function SideBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "dashboard";

  return (
    <nav className="ht-nav" aria-label="Primary">
      {NAV.map((item) => (
        <button
          key={item.key}
          onClick={() => setSearchParams({ page: item.key })}
          aria-current={page === item.key ? "page" : undefined}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
