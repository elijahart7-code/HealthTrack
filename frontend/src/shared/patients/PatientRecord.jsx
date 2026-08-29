import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { calculateAge } from "../../utils/calculateAge";
import { RECORD_TYPES } from "../../config/recordTypes";
import { PageHeader } from "../../components/ui/PageHeader";
import { Field, Input, Select, Textarea } from "../../components/ui/Input";
import { Badge, EmptyState, Table, Th, Td } from "../../components/ui/Table";
import { ClinicalRecords } from "./ClinicalRecords";

/**
 * One patient's full record, as seen by staff -- port of
 * resources/views/livewire/patient-registry/record.blade.php. The
 * `.ht-record-layout` sidebar of section tabs is built from RECORD_TYPES,
 * same as the original's `$sections` array built from config.
 */
export function PatientRecord({ patientId, role, onBack, onPatientUpdated }) {
  const isAdmin = role === "admin";

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [section, setSection] = useState("general");
  const [loading, setLoading] = useState(true);

  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("pending");
  const [apptError, setApptError] = useState(null);

  const [showAccountForm, setShowAccountForm] = useState(false);
  const [portalEmail, setPortalEmail] = useState("");
  const [accountError, setAccountError] = useState(null);

  async function load() {
    setLoading(true);
    const [patientRes, apptRes] = await Promise.all([
      api.get(`/patients/${patientId}`),
      api.get(`/patients/${patientId}/appointments`),
    ]);
    setPatient(patientRes.data.patient);
    setAppointments(apptRes.data.appointments);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  async function scheduleAppointment() {
    setApptError(null);
    if (!scheduledAt || !reason) {
      setApptError("Date/time and reason are required.");
      return;
    }
    try {
      await api.post(`/patients/${patientId}/appointments`, { scheduledAt, reason, notes, status });
      setScheduledAt("");
      setReason("");
      setNotes("");
      setStatus("pending");
      setShowAppointmentForm(false);
      load();
      onPatientUpdated?.();
    } catch (err) {
      setApptError(err?.response?.data?.error || "Could not schedule that appointment.");
    }
  }

  async function deleteAppointment(appointmentId) {
    if (!confirm("Remove this appointment?")) return;
    await api.delete(`/appointments/${appointmentId}`);
    load();
    onPatientUpdated?.();
  }

  async function createPortalAccount() {
    setAccountError(null);
    if (!portalEmail) {
      setAccountError("Email address is required.");
      return;
    }
    try {
      const { data } = await api.post(`/patients/${patientId}/portal-account`, { email: portalEmail });
      setPatient(data.patient);
      setPortalEmail("");
      setShowAccountForm(false);
      onPatientUpdated?.();
    } catch (err) {
      setAccountError(err?.response?.data?.error || "Could not create that account.");
    }
  }

  if (loading || !patient) return <p className="ht-muted text-sm">Loading...</p>;

  const sections = { general: "General", ...Object.fromEntries(Object.entries(RECORD_TYPES).map(([k, v]) => [k, v.label])) };

  return (
    <div className="grid gap-4">
      <PageHeader
        title={patient.full_name}
        subtitle={`${patient.sex.charAt(0).toUpperCase() + patient.sex.slice(1)} | ${calculateAge(patient.birthdate)} years old | Born ${new Date(patient.birthdate).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })}`}
      >
        <button onClick={onBack} className="ht-button ht-button-muted">
          Back to patients
        </button>
      </PageHeader>

      <div className="ht-record-layout">
        <nav className="ht-record-nav" aria-label="Record sections">
          {Object.entries(sections).map(([key, label]) => (
            <button key={key} onClick={() => setSection(key)} aria-current={section === key ? "page" : undefined}>
              {label}
            </button>
          ))}
        </nav>

        <div className="grid gap-4">
          {section === "general" ? (
            <>
              <div className="ht-panel">
                <h2>Patient details</h2>
                <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  <Detail label="Civil status" value={patient.civil_status} />
                  <Detail label="Blood type" value={patient.blood_type} />
                  <Detail label="Occupation" value={patient.occupation} />
                  <Detail label="Barangay ID number" value={patient.barangay_id_number} />
                  <Detail label="Nationality" value={patient.nationality} />
                  <Detail label="Place of birth" value={patient.place_of_birth} />
                  <Detail label="Address" value={patient.address} />
                  <Detail label="Contact number" value={patient.contact_number} />
                  <Detail label="Emergency contact" value={patient.emergency_contact_name} />
                  <Detail label="Emergency number" value={patient.emergency_contact_number} />
                  <Detail label="Relationship" value={patient.emergency_contact_relationship} />
                </dl>
              </div>

              <div className="ht-panel">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2>Portal account</h2>
                  {!patient.user_id && isAdmin && (
                    <button onClick={() => setShowAccountForm((v) => !v)} className="ht-button">
                      {showAccountForm ? "Cancel" : "Create account"}
                    </button>
                  )}
                </div>

                {patient.user_id ? (
                  <>
                    <p className="m-0 text-sm">
                      Has a portal login.
                    </p>
                    <p className="ht-muted m-0 mt-1 text-xs">
                      The patient sets their own password with "Forgot password". Staff never see it.
                    </p>
                  </>
                ) : showAccountForm && isAdmin ? (
                  <div className="grid gap-3 rounded-xl p-4" style={{ background: "var(--color-surface-muted)" }}>
                    {accountError && <div className="ht-login-alert ht-login-alert-error">{accountError}</div>}
                    <p className="ht-muted m-0 text-xs">
                      Creates a login so this patient can view their own records. No password is set here -- they choose one
                      themselves using the "Forgot password" link.
                    </p>
                    <div className="max-w-md">
                      <Field label="Email address" required>
                        <Input type="email" value={portalEmail} onChange={(e) => setPortalEmail(e.target.value)} />
                      </Field>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={createPortalAccount} className="ht-button">
                        Create account
                      </button>
                      <button onClick={() => setShowAccountForm(false)} className="ht-button ht-button-muted">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="ht-empty">No portal account.{!isAdmin && " Only the admin can create one."}</div>
                )}
              </div>

              <div className="ht-panel">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2>Appointments</h2>
                  <div className="flex items-center gap-2">
                    <span className="ht-pill">{appointments.length} total</span>
                    {isAdmin && (
                      <button onClick={() => setShowAppointmentForm((v) => !v)} className="ht-button">
                        {showAppointmentForm ? "Cancel" : "Schedule appointment"}
                      </button>
                    )}
                  </div>
                </div>

                {showAppointmentForm && isAdmin && (
                  <div className="mb-4 grid gap-3 rounded-xl p-4" style={{ background: "var(--color-surface-muted)" }}>
                    {apptError && <div className="ht-login-alert ht-login-alert-error">{apptError}</div>}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Date and time" required>
                        <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
                      </Field>
                      <Field label="Status">
                        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </Select>
                      </Field>
                    </div>
                    <Field label="Reason" required>
                      <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Prenatal check-up" />
                    </Field>
                    <Field label="Notes">
                      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </Field>
                    <div className="flex gap-2">
                      <button onClick={scheduleAppointment} className="ht-button">
                        Save appointment
                      </button>
                      <button onClick={() => setShowAppointmentForm(false)} className="ht-button ht-button-muted">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {appointments.length === 0 ? (
                  <EmptyState>No appointments for this patient.</EmptyState>
                ) : (
                  <Table>
                    <thead>
                      <tr>
                        <Th>Date and time</Th>
                        <Th>Reason</Th>
                        <Th>Status</Th>
                        {isAdmin && <Th srOnly>Actions</Th>}
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((a) => (
                        <tr key={a.appointment_id}>
                          <Td className="whitespace-nowrap font-bold" style={{ color: "var(--color-brand-strong)" }}>
                            {new Date(a.scheduled_at).toLocaleString()}
                          </Td>
                          <Td>{a.reason}</Td>
                          <Td>
                            <Badge>{a.status}</Badge>
                          </Td>
                          {isAdmin && (
                            <Td>
                              <button onClick={() => deleteAppointment(a.appointment_id)} className="ht-button ht-button-danger">
                                Remove
                              </button>
                            </Td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
            </>
          ) : (
            <ClinicalRecords patientId={patientId} type={section} role={role} />
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="ht-muted text-xs font-bold">{label}</dt>
      <dd className="m-0">{value || "--"}</dd>
    </div>
  );
}