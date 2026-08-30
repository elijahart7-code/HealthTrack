import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { api } from "../../../lib/axios";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Field, Select } from "../../../components/ui/Input";
import { EmptyState, Table, Th, Td } from "../../../components/ui/Table";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

/** Admin appointment management. */
export function Appointments({ appointments, loadData }) {
  const [filter, setFilter] = useState("upcoming");
  const [, setSearchParams] = useSearchParams();

  const visible = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    let list = appointments;
    if (filter === "today") {
      list = list.filter((a) => new Date(a.scheduled_at) >= startOfToday && new Date(a.scheduled_at) < endOfToday);
    } else if (filter === "past") {
      list = [...list.filter((a) => new Date(a.scheduled_at) < now)].sort(
        (a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at)
      );
    } else if (filter === "upcoming") {
      list = list.filter((a) => new Date(a.scheduled_at) >= now && !["completed", "cancelled"].includes(a.status));
    }
    return list;
  }, [appointments, filter]);

  async function setStatus(appointmentId, status) {
    await api.patch(`/appointments/${appointmentId}/status`, { status });
    loadData();
  }

  return (
    <div className="grid gap-4">
      <PageHeader title="Appointments" subtitle="Schedule new appointments from a patient's record.">
        <span className="ht-pill">{visible.length} shown</span>
      </PageHeader>

      <div className="ht-panel">
        <Field label="Show" className="mb-3 max-w-xs">
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="upcoming">Upcoming</option>
            <option value="today">Today</option>
            <option value="past">Past</option>
            <option value="all">All</option>
          </Select>
        </Field>

        {visible.length === 0 ? (
          <EmptyState>No appointments in this view.</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Date and time</Th>
                <Th>Patient</Th>
                <Th>Reason</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => (
                <tr key={a.appointment_id}>
                  <Td className="whitespace-nowrap font-bold">{new Date(a.scheduled_at).toLocaleString()}</Td>
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
                    <Select value={a.status} onChange={(e) => setStatus(a.appointment_id, e.target.value)} style={{ minWidth: 130 }}>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </Select>
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
