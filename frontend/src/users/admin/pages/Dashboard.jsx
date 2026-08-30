import { useSearchParams } from "react-router";
import { PageHeader } from "../../../components/ui/PageHeader";
import { StatCard } from "../../../components/ui/Card";
import { EmptyState, Table, Th, Td, Badge } from "../../../components/ui/Table";

/** Admin dashboard. */
export function Dashboard({ dashboard }) {
  const [, setSearchParams] = useSearchParams();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="grid gap-4">
      <PageHeader title="Admin Dashboard" subtitle="Barangay Health Center of Mambog I">
        <span className="ht-pill">{today}</span>
      </PageHeader>

      <div className="ht-metric-grid">
        <StatCard label="Registered patients" value={dashboard.patientCount} tone="brand" />
        <StatCard label="Appointments today" value={dashboard.appointmentsToday} tone="warm" />
        <StatCard label="Upcoming appointments" value={dashboard.upcomingCount} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="ht-panel">
          <h2>Today's schedule</h2>

          {dashboard.todaysAppointments.length === 0 ? (
            <EmptyState>Nothing scheduled for today.</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Time</Th>
                  <Th>Patient</Th>
                  <Th>Reason</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {dashboard.todaysAppointments.map((a) => (
                  <tr key={a.appointment_id}>
                    <Td className="whitespace-nowrap font-bold">
                      {new Date(a.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Td>
                    <Td>
                      <button
                        onClick={() => setSearchParams({ page: "patients", patientId: a.patient_id })}
                        style={{ color: "var(--color-brand-strong)", fontWeight: 700 }}
                      >
                        {a.last_name}, {a.first_name}
                      </button>
                    </Td>
                    <Td>{a.reason}</Td>
                    <Td>
                      <Badge>{a.status}</Badge>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

        <div className="ht-panel">
          <h2>Recently registered</h2>

          {dashboard.recentPatients.length === 0 ? (
            <EmptyState>No patients yet.</EmptyState>
          ) : (
            <ul className="m-0 grid list-none gap-2 p-0">
              {dashboard.recentPatients.map((p) => (
                <li key={p.patient_id}>
                  <button
                    onClick={() => setSearchParams({ page: "patients", patientId: p.patient_id })}
                    className="block w-full rounded-xl p-3 text-left text-sm"
                    style={{ background: "var(--color-surface-muted)", color: "var(--color-ink)" }}
                  >
                    <span className="font-bold">
                      {p.last_name}, {p.first_name}
                    </span>
                    <span className="ht-muted block text-xs">
                      Registered {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button onClick={() => setSearchParams({ page: "patients" })} className="ht-button ht-button-muted mt-3">
            View all patients
          </button>
        </div>
      </div>
    </div>
  );
}
