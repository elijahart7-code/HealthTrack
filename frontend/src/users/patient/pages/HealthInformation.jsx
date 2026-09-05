import { useState } from "react";
import {
  Home,
  Calendar,
  User,
  Activity,
  Lock,
  HelpCircle,
  FileText,
  Eye,
  ShieldPlus,
} from "lucide-react";

export function HealthInformation({ healthInfo }) {
  const [section, setSection] = useState("overview");

  if (!healthInfo.patient) {
    return (
      <div className="ht-panel">
        <div className="ht-empty">
          Your account is not linked to a patient record yet.
          <span className="mt-2 block text-xs">
            Please contact the Barangay Health Center of Mambog I so a health
            worker can link it.
          </span>
        </div>
      </div>
    );
  }

  const {
    patient,
    records = {},
    appointments = [],
  } = healthInfo;

  const patientName =
    `${patient.first_name || ""} ${patient.middle_name || ""} ${
      patient.last_name || ""
    }`
      .replace(/\s+/g, " ")
      .trim();

  // Get vital signs from your records
  const vitalSigns = records["vital-signs"] || records.vital_signs || [];

  return (
    <div className="patient-healthinfo-page">

      {/* ================= SIDEBAR ================= */}
      <aside className="patient-healthinfo-sidebar">

        <nav
          className="patient-healthinfo-nav"
          aria-label="Health information navigation"
        >

          {/* Overview */}
          <button
            onClick={() => setSection("overview")}
            className={`patient-sidebar-item ${
              section === "overview" ? "is-active-overview" : ""
            }`}
          >
            <span className="patient-sidebar-icon">
              <Home size={25} strokeWidth={1.7} />
            </span>

            <span>Overview</span>
          </button>

          <div className="patient-sidebar-label">
            MY HEALTH INFORMATION
          </div>

          {/* Appointments */}
          <button
            onClick={() => setSection("appointments")}
            className={`patient-sidebar-item ${
              section === "appointments" ? "is-active" : ""
            }`}
          >
            <span className="patient-sidebar-icon">
              <Calendar size={25} strokeWidth={1.7} />
            </span>

            <span>Appointments</span>
          </button>

          {/* Patient Information */}
          <button
            onClick={() => setSection("patient-information")}
            className={`patient-sidebar-item ${
              section === "patient-information" ? "is-active" : ""
            }`}
          >
            <span className="patient-sidebar-icon">
              <User size={25} strokeWidth={1.7} />
            </span>

            <span>Patient Information</span>
          </button>

          {/* Vital Signs */}
          <button
            onClick={() => setSection("vital-signs")}
            className={`patient-sidebar-item ${
              section === "vital-signs" ? "is-active" : ""
            }`}
          >
            <span className="patient-sidebar-icon">
              <Activity size={25} strokeWidth={1.7} />
            </span>

            <span>Vital Signs</span>
          </button>

        </nav>

        {/* ================= HELP CARD ================= */}
        <div className="patient-help-card">

          <div className="patient-help-icon">
            <ShieldPlus size={38} strokeWidth={1.6} />
          </div>

          <div>
            <h3>Need help?</h3>

            <p>
              Contact your midwife or
              <br />
              health worker for assistance.
            </p>
          </div>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}
      <main className="patient-healthinfo-main">

        {/* ================= HEADER ================= */}
        <section className="patient-healthinfo-header-card">

          <div className="patient-healthinfo-header-copy">

            <div className="patient-panel-icon patient-panel-icon-large">
              <FileText size={28} strokeWidth={1.7} />
            </div>

            <div>
              <h1>My Health Information</h1>

              <p>
                Everything has been recorded here at Barangay Health Center
                of Mambog I.
              </p>
            </div>

          </div>

          <span className="patient-readonly-pill">
            <Lock size={16} strokeWidth={1.8} />
            Read Only
          </span>

        </section>


        {/* =====================================================
            OVERVIEW
        ===================================================== */}

        {section === "overview" && (
          <>

            {/* ================= APPOINTMENTS ================= */}
            <section className="patient-healthinfo-card">

              <div className="patient-card-header">

                <div className="patient-card-title">

                  <span className="patient-panel-icon patient-panel-icon-small">
                    <Calendar size={21} strokeWidth={1.7} />
                  </span>

                  <h2>Appointments</h2>

                </div>

                <span className="patient-card-total">
                  {appointments.length} total
                </span>

              </div>


              {appointments.length === 0 ? (
                <div className="patient-empty-state">
                  No appointments recorded.
                </div>
              ) : (

                <div className="patient-table-wrap">

                  <table className="patient-health-table">

                    <thead>
                      <tr>
                        <th>Date and Time</th>
                        <th>Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {appointments.slice(0, 2).map((appointment) => (

                        <tr key={appointment.appointment_id}>

                          <td className="patient-date-cell">
                            <Calendar
                              size={17}
                              strokeWidth={1.7}
                            />

                            {new Date(
                              appointment.scheduled_at
                            ).toLocaleString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </td>

                          <td>
                            {appointment.reason || "--"}
                          </td>

                          <td>
                            <span className="patient-status-pill">
                              {appointment.status || "Confirmed"}
                            </span>
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

              <div className="patient-table-footer">
                Showing 1 to {Math.min(appointments.length, 2)}{" "}
                appointments
              </div>

            </section>


            {/* ================= PATIENT INFORMATION ================= */}
            <section className="patient-healthinfo-card">

              <div className="patient-card-header">

                <div className="patient-card-title">

                  <span className="patient-panel-icon patient-panel-icon-small">
                    <User size={21} strokeWidth={1.7} />
                  </span>

                  <h2>Patient Information</h2>

                </div>

                <button
                  className="patient-view-all-btn"
                  onClick={() => setSection("patient-information")}
                >
                  <Eye size={18} strokeWidth={1.7} />
                  View All
                </button>

              </div>


              <div className="patient-information-grid">

                <InfoField
                  label="Full Name"
                  value={patientName}
                />

                <InfoField
                  label="Gender"
                  value={
                    patient.sex
                      ? patient.sex.charAt(0).toUpperCase() +
                        patient.sex.slice(1)
                      : null
                  }
                />

                <InfoField
                  label="Date of Birth"
                  value={
                    patient.birthdate
                      ? new Date(
                          patient.birthdate
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : null
                  }
                />

                <InfoField
                  label="Age"
                  value={
                    patient.age !== undefined
                      ? `${patient.age} years old`
                      : null
                  }
                />

                <InfoField
                  label="Contact Number"
                  value={patient.contact_number}
                />

                <InfoField
                  label="Address"
                  value={patient.address}
                />

                <InfoField
                  label="Blood Type"
                  value={patient.blood_type}
                />

              </div>

            </section>


            {/* ================= VITAL SIGNS ================= */}
            <section className="patient-healthinfo-card">

              <div className="patient-card-header">

                <div className="patient-card-title">

                  <span className="patient-panel-icon patient-panel-icon-small">
                    <Activity size={21} strokeWidth={1.7} />
                  </span>

                  <h2>Vital Signs</h2>

                </div>

                <button
                  className="patient-view-all-btn"
                  onClick={() => setSection("vital-signs")}
                >
                  <Eye size={18} strokeWidth={1.7} />
                  View All
                </button>

              </div>


              {vitalSigns.length === 0 ? (

                <div className="patient-empty-state">
                  No vital signs recorded.
                </div>

              ) : (

                <div className="patient-table-wrap">

                  <table className="patient-health-table">

                    <thead>
                      <tr>
                        <th>Measurement</th>
                        <th>Result</th>
                        <th>Unit</th>
                        <th>Date Recorded</th>
                      </tr>
                    </thead>

                    <tbody>

                      {vitalSigns
                        .slice(0, 8)
                        .map((record, index) => (

                          <tr
                            key={
                              record.record_id || index
                            }
                          >

                            <td>
                              {record.measurement ||
                                record.type ||
                                record.name ||
                                "--"}
                            </td>

                            <td>
                              {record.result ||
                                record.value ||
                                "--"}
                            </td>

                            <td>
                              {record.unit || "--"}
                            </td>

                            <td className="patient-date-cell">
                              {record.recorded_at ||
                              record.date_recorded ||
                              record.created_at
                                ? new Date(
                                    record.recorded_at ||
                                      record.date_recorded ||
                                      record.created_at
                                  ).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                    }
                                  )
                                : "--"}
                            </td>

                          </tr>

                        ))}

                    </tbody>

                  </table>

                </div>

              )}

              <div className="patient-table-footer">
                Showing latest vital signs
              </div>

            </section>


            {/* ================= PAGINATION ================= */}
            <div className="patient-pagination">

              <span>
                Page 1 of 2
              </span>

              <button>
                Next Page
              </button>

            </div>

          </>
        )}


        {/* =====================================================
            APPOINTMENTS PAGE
        ===================================================== */}

        {section === "appointments" && (
          <FullAppointments appointments={appointments} />
        )}


        {/* =====================================================
            PATIENT INFORMATION PAGE
        ===================================================== */}

        {section === "patient-information" && (
          <FullPatientInformation patient={patient} />
        )}


        {/* =====================================================
            VITAL SIGNS PAGE
        ===================================================== */}

        {section === "vital-signs" && (
          <FullVitalSigns records={vitalSigns} />
        )}

      </main>
    </div>
  );
}


/* ============================================================
   INFO FIELD
============================================================ */

function InfoField({ label, value }) {
  return (
    <div className="patient-info-field">

      <span className="patient-info-label">
        {label}
      </span>

      <span className="patient-info-value">
        {value || "Not provided"}
      </span>

    </div>
  );
}


/* ============================================================
   FULL APPOINTMENTS
============================================================ */

function FullAppointments({ appointments }) {
  return (
    <section className="patient-healthinfo-card">

      <div className="patient-card-header">

        <div className="patient-card-title">

          <span className="patient-panel-icon patient-panel-icon-small">
            <Calendar size={21} />
          </span>

          <h2>Appointments</h2>

        </div>

        <span className="patient-card-total">
          {appointments.length} total
        </span>

      </div>

      {appointments.length === 0 ? (
        <div className="patient-empty-state">
          No appointments recorded.
        </div>
      ) : (
        <div className="patient-table-wrap">

          <table className="patient-health-table">

            <thead>
              <tr>
                <th>Date and Time</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {appointments.map((a) => (
                <tr key={a.appointment_id}>

                  <td>
                    {new Date(
                      a.scheduled_at
                    ).toLocaleString()}
                  </td>

                  <td>
                    {a.reason || "--"}
                  </td>

                  <td>
                    <span className="patient-status-pill">
                      {a.status}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </section>
  );
}


/* ============================================================
   FULL PATIENT INFORMATION
============================================================ */

function FullPatientInformation({ patient }) {

  const patientName =
    `${patient.first_name || ""} ${
      patient.middle_name || ""
    } ${patient.last_name || ""}`
      .replace(/\s+/g, " ")
      .trim();

  return (
    <section className="patient-healthinfo-card">

      <div className="patient-card-header">

        <div className="patient-card-title">

          <span className="patient-panel-icon patient-panel-icon-small">
            <User size={21} />
          </span>

          <h2>Patient Information</h2>

        </div>

      </div>

      <div className="patient-information-grid">

        <InfoField
          label="Full Name"
          value={patientName}
        />

        <InfoField
          label="Gender"
          value={patient.sex}
        />

        <InfoField
          label="Date of Birth"
          value={
            patient.birthdate
              ? new Date(
                  patient.birthdate
                ).toLocaleDateString()
              : null
          }
        />

        <InfoField
          label="Age"
          value={
            patient.age !== undefined
              ? `${patient.age} years old`
              : null
          }
        />

        <InfoField
          label="Contact Number"
          value={patient.contact_number}
        />

        <InfoField
          label="Address"
          value={patient.address}
        />

        <InfoField
          label="Blood Type"
          value={patient.blood_type}
        />

        <InfoField
          label="Civil Status"
          value={patient.civil_status}
        />

      </div>

    </section>
  );
}


/* ============================================================
   FULL VITAL SIGNS
============================================================ */

function FullVitalSigns({ records }) {

  return (
    <section className="patient-healthinfo-card">

      <div className="patient-card-header">

        <div className="patient-card-title">

          <span className="patient-panel-icon patient-panel-icon-small">
            <Activity size={21} />
          </span>

          <h2>Vital Signs</h2>

        </div>

      </div>

      {records.length === 0 ? (
        <div className="patient-empty-state">
          No vital signs recorded.
        </div>
      ) : (
        <div className="patient-table-wrap">

          <table className="patient-health-table">

            <thead>
              <tr>
                <th>Measurement</th>
                <th>Result</th>
                <th>Unit</th>
                <th>Date Recorded</th>
              </tr>
            </thead>

            <tbody>

              {records.map((record, index) => (

                <tr key={record.record_id || index}>

                  <td>
                    {record.measurement ||
                      record.type ||
                      record.name ||
                      "--"}
                  </td>

                  <td>
                    {record.result ||
                      record.value ||
                      "--"}
                  </td>

                  <td>
                    {record.unit || "--"}
                  </td>

                  <td>
                    {record.recorded_at ||
                    record.date_recorded ||
                    record.created_at
                      ? new Date(
                          record.recorded_at ||
                            record.date_recorded ||
                            record.created_at
                        ).toLocaleDateString()
                      : "--"}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </section>
  );
}