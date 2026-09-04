import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { calculateAge } from "../../../utils/calculateAge";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Field, Input, Select } from "../../../components/ui/Input";
import { Badge, EmptyState, Table, Th, Td } from "../../../components/ui/Table";
import { PatientRecord } from "../../../shared/patients/PatientRecord";

/** Patient list screen for health workers. */
export function Patients({ patients, loadData }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("patientId");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("last_name");

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = patients;

    if (term) {
      list = list.filter(
        (p) =>
          p.first_name.toLowerCase().includes(term) ||
          (p.middle_name || "").toLowerCase().includes(term) ||
          p.last_name.toLowerCase().includes(term) ||
          (p.contact_number || "").toLowerCase().includes(term)
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "birthdate") return new Date(a.birthdate) - new Date(b.birthdate);
      return a.last_name.localeCompare(b.last_name);
    });
  }, [patients, search, sortBy]);

  if (selectedId) {
    return (
      <PatientRecord
        patientId={selectedId}
        role="health_worker"
        onBack={() => setSearchParams({ page: "patients" })}
        onPatientUpdated={loadData}
      />
    );
  }

  return (
    <div className="grid gap-4">
      <PageHeader title="Patients" subtitle="Everyone registered at the Barangay Health Center of Mambog I.">
        <span className="ht-pill">{patients.length} registered</span>
        <button onClick={() => setSearchParams({ page: "register-patient" })} className="ht-button">
          Register Patient
        </button>
      </PageHeader>

      <div className="ht-panel">
        <div className="mb-3 grid gap-3 sm:grid-cols-[2fr_1fr]">
          <Field label="Search">
            <Input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or contact number" />
          </Field>
          <Field label="Sort by">
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="last_name">Surname (A-Z)</option>
              <option value="newest">Recently registered</option>
              <option value="birthdate">Date of birth</option>
            </Select>
          </Field>
        </div>

        {visible.length === 0 ? (
          <EmptyState>{search ? `No patient matches "${search}".` : "No patients registered yet."}</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Age</Th>
                <Th>Sex</Th>
                <Th>Contact</Th>
                <Th>Portal access</Th>
                <Th srOnly>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.patient_id}>
                  <Td className="font-bold" style={{ color: "var(--color-brand-strong)" }}>
                    {p.full_name}
                  </Td>
                  <Td>{calculateAge(p.birthdate)}</Td>
                  <Td className="capitalize">{p.sex}</Td>
                  <Td>{p.contact_number || "--"}</Td>
                  <Td>{p.user_id ? <Badge>Yes</Badge> : <span className="ht-muted text-xs">No login</span>}</Td>
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