import { useSearchParams } from "react-router";
import { PageHeader } from "../../../components/ui/PageHeader";
import { StatCard } from "../../../components/ui/Card";
import { EmptyState, Table, Th, Td } from "../../../components/ui/Table";
import { calculateAge } from "../../../utils/calculateAge";

/** Port of resources/views/livewire/health-worker/dashboard.blade.php. */
export function Dashboard({ dashboard, onRegisterClick }) {
  const [, setSearchParams] = useSearchParams();
  return (
    <div className="grid gap-4">
      <PageHeader title="Health Worker Dashboard" subtitle="Register patients and keep their details up to date.">
        <button onClick={onRegisterClick} className="ht-button">
          Register Patient
        </button>
      </PageHeader>

      <div className="ht-metric-grid">
        <StatCard label="Registered patients" value={dashboard.patientCount} tone="brand" />
        <StatCard label="Registered this month" value={dashboard.registeredThisMonth} tone="warm" />
        <StatCard label="Without portal login" value={dashboard.withoutPortalLogin} />
      </div>

      <div className="ht-panel">
        <h2>Recently registered</h2>

        {dashboard.recentPatients.length === 0 ? (
          <EmptyState>No patients registered yet.</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Age</Th>
                <Th>Contact</Th>
                <Th>Registered</Th>
                <Th srOnly>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentPatients.map((p) => (
                <tr key={p.patient_id}>
                  <Td className="font-bold" style={{ color: "var(--color-brand-strong)" }}>
                    {p.last_name}, {p.first_name}
                  </Td>
                  <Td>{calculateAge(p.birthdate)}</Td>
                  <Td>{p.contact_number || "--"}</Td>
                  <Td className="whitespace-nowrap">{new Date(p.created_at).toLocaleDateString()}</Td>
                  <Td>
                    <button
                      onClick={() => setSearchParams({ page: "patients", patientId: p.patient_id })}
                      className="ht-button ht-button-muted"
                    >
                      Open record
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}