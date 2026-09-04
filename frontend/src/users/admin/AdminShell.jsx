import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { api } from "../../lib/axios";
import { SideBar } from "./components/SideBar";
import { Header } from "./components/Header";
import { Dashboard } from "./pages/Dashboard";
import { Patients } from "./pages/Patients";
import { Appointments } from "./pages/Appointments";

/**
 * Signed-in shell for the admin role. It owns page-level state and the data
 * fetch flow used across the admin dashboard and patient screens.
 */
export function AdminShell() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = searchParams.get("page") || "dashboard";

  const [dashboard, setDashboard] = useState(null);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [dashboardRes, patientsRes, appointmentsRes] = await Promise.all([
      api.get("/admin/dashboard"),
      api.get("/patients"),
      api.get("/admin/appointments"),
    ]);
    setDashboard(dashboardRes.data);
    setPatients(patientsRes.data.patients);
    setAppointments(appointmentsRes.data.appointments);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <header className="ht-topbar">
        <div className="ht-topbar-inner">
          <button className="ht-brand" onClick={() => navigate("/admin")}>
            <span className="ht-brand-mark">HT</span>
            <span>HealthTrack</span>
          </button>
          <SideBar />
          <Header />
        </div>
      </header>

      <main className="ht-content">
        {loading || !dashboard ? (
          <p className="ht-muted text-sm">Loading...</p>
        ) : page === "patients" ? (
          <Patients patients={patients} loadData={loadData} />
        ) : page === "appointments" ? (
          <Appointments appointments={appointments} loadData={loadData} />
        ) : (
          <Dashboard dashboard={dashboard} />
        )}
      </main>
    </>
  );
}
