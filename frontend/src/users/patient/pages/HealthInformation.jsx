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
  const [activeSection, setActiveSection] = useState("overview");

  if (!healthInfo?.patient) {
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

  const { patient, appointments = [], records = {}, recordTypes = {} } =
    healthInfo;

  const patientName =
    `${patient.first_name || ""} ${patient.middle_name || ""} ${
      patient.last_name || ""
    }`
      .replace(/\s+/g, " ")
      .trim();

  // Get Vital Signs from your existing data
  const vitalSigns =
    records["vital-signs"] ||
    records["vital_signs"] ||
    records.vitalSigns ||
    [];

  // If your backend uses a record type definition,
  // use its fields to display the vital signs.
  const vitalDefinition =
    recordTypes["vital-signs"] ||
    recordTypes["vital_signs"] ||
    recordTypes.vitalSigns;

  return (
    <div className="patient-healthinfo-page">

      {/* =====================================================
          LEFT SIDEBAR
      ===================================================== */}
      <aside className="patient-healthinfo-sidebar">

        <nav
          className="patient-healthinfo-nav"
          aria-label="Health information navigation"
        >

          {/* OVERVIEW */}
          <button
            type="button"
            onClick={() => setActiveSection("overview")}
            className={`patient-sidebar-item ${
              activeSection === "overview" ? "is-active" : ""
            }`}
          >
            <span className="patient-sidebar-icon">
              <Home size={20} strokeWidth={1.8} />
            </span>

            <span>Overview</span>
          </button>


          {/* TITLE */}
          <div className="patient-sidebar-label">
            MY HEALTH INFORMATION
          </div>


          {/* APPOINTMENTS */}
          <button
            type="button"
            onClick={() => setActiveSection("appointments")}
            className={`patient-sidebar-item ${
              activeSection === "appointments" ? "is-active" : ""
            }`}
          >
            <span className="patient-sidebar-icon">
              <Calendar size={20} strokeWidth={1.8} />
            </span>

            <span>Appointments</span>
          </button>


          {/* PATIENT INFORMATION */}
          <button
            type="button"
            onClick={() => setActiveSection("patient-information")}
            className={`patient-sidebar-item ${
              activeSection === "patient-information" ? "is-active" : ""
            }`}
          >
            <span className="patient-sidebar-icon">
              <User size={20} strokeWidth={1.8} />
            </span>

            <span>Patient Information</span>
          </button>


          {/* VITAL SIGNS */}
          <button
            type="button"
            onClick={() => setActiveSection("vital-signs")}
            className={`patient-sidebar-item ${
              activeSection === "vital-signs" ? "is-active" : ""
            }`}
          >
            <span className="patient-sidebar-icon">
              <Activity size={20} strokeWidth={1.8} />
            </span>

            <span>Vital Signs</span>
          </button>

        </nav>


        {/* =================================================
            NEED HELP
        ================================================= */}
        <div className="patient-help-card">

          <div className="patient-help-icon">
            <ShieldPlus size={34} strokeWidth={1.7} />
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


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <main className="patient-healthinfo-main">


        {/* =================================================
            PAGE HEADER
        ================================================= */}
        <section className="patient-healthinfo-header-card">

          <div className="patient-healthinfo-header-copy">

            <div className="patient-panel-icon patient-panel-icon-large">
              <FileText size={23} strokeWidth={1.8} />
            </div>

            <div>
              <h1>My Health Information</h1>

              <p>
                Everything has been recorded here at Barangay Health
                Center of Mambog I.
              </p>
            </div>

          </div>


          <span className="patient-readonly-pill">
            <Lock size={15} strokeWidth={1.8} />
            Read Only
          </span>

        </section>


        {/* =================================================
            OVERVIEW PAGE
        ================================================= */}
        {activeSection === "overview" && (
          <>

            {/* =============================================
                APPOINTMENTS
            ============================================= */}
            <section className="patient-healthinfo-card">

              <div className="patient-card-header">

                <div className="patient-card-title">

                  <span className="patient-panel-icon patient-panel-icon-small">
                    <Calendar size={19} strokeWidth={1.8} />
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
                              size={16}
                              strokeWidth={1.8}
                            />

                            {formatDateTime(
                              appointment.scheduled_at
                            )}

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

                Showing 1 to{" "}
                {Math.min(appointments.length, 2)} appointments

              </div>

            </section>


            {/* =============================================
                PATIENT INFORMATION
            ============================================= */}
            <section className="patient-healthinfo-card">

              <div className="patient-card-header">

                <div className="patient-card-title">

                  <span className="patient-panel-icon patient-panel-icon-small">
                    <User size={19} strokeWidth={1.8} />
                  </span>

                  <h2>Patient Information</h2>

                </div>


                <button
                  type="button"
                  className="patient-view-all-btn"
                  onClick={() =>
                    setActiveSection("patient-information")
                  }
                >
                  <Eye size={17} strokeWidth={1.8} />
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
                  value={formatGender(patient.sex)}
                />

                <InfoField
                  label="Date of Birth"
                  value={formatDate(patient.birthdate)}
                />

                <InfoField
                  label="Age"
                  value={
                    patient.age !== undefined &&
                    patient.age !== null
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


            {/* =============================================
                VITAL SIGNS
            ============================================= */}
            <section className="patient-healthinfo-card">

              <div className="patient-card-header">

                <div className="patient-card-title">

                  <span className="patient-panel-icon patient-panel-icon-small">
                    <Activity size={19} strokeWidth={1.8} />
                  </span>

                  <h2>Vital Signs</h2>

                </div>


                <button
                  type="button"
                  className="patient-view-all-btn"
                  onClick={() =>
                    setActiveSection("vital-signs")
                  }
                >
                  <Eye size={17} strokeWidth={1.8} />
                  View All
                </button>

              </div>


              {vitalSigns.length === 0 ? (

                <div className="patient-empty-state">
                  No vital signs recorded.
                </div>

              ) : (

                <VitalSignsTable
                  records={vitalSigns}
                  definition={vitalDefinition}
                />

              )}


              <div className="patient-table-footer">
                Showing latest vital signs
              </div>

            </section>


            {/* =============================================
                PAGE NAVIGATION
            ============================================= */}
            <div className="patient-pagination">

              <span>Page 1 of 2</span>

              <button type="button">
                Next Page
              </button>

            </div>

          </>
        )}


        {/* =================================================
            APPOINTMENTS VIEW ALL
        ================================================= */}
        {activeSection === "appointments" && (
          <AppointmentsPage appointments={appointments} />
        )}


        {/* =================================================
            PATIENT INFORMATION VIEW ALL
        ================================================= */}
        {activeSection === "patient-information" && (
          <PatientInformationPage patient={patient} />
        )}


        {/* =================================================
            VITAL SIGNS VIEW ALL
        ================================================= */}
        {activeSection === "vital-signs" && (
          <VitalSignsPage
            records={vitalSigns}
            definition={vitalDefinition}
          />
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
   VITAL SIGNS TABLE
============================================================ */

function VitalSignsTable({ records, definition }) {

  /*
   * If your backend provides field definitions,
   * use those fields.
   */
  if (definition?.fields) {

    const fields = Object.entries(definition.fields)
      .filter(([, field]) => field.column || field.primary);

    return (
      <div className="patient-table-wrap">

        <table className="patient-health-table">

          <thead>

            <tr>

              {fields.map(([column, field]) => (
                <th key={column}>
                  {field.label}
                </th>
              ))}

              <th>
                {definition.dateLabel || "Date Recorded"}
              </th>

            </tr>

          </thead>


          <tbody>

            {records.slice(0, 8).map((record) => (

              <tr key={record.record_id}>

                {fields.map(([column, field]) => (

                  <td key={column}>

                    {field.type === "select"
                      ? field.options?.[record[column]] ||
                        record[column] ||
                        "--"
                      : record[column] || "--"}

                  </td>

                ))}

                <td className="patient-date-cell">

                  {formatDate(
                    record[definition.dateField]
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    );
  }


  /*
   * Fallback for a common Vital Signs data structure.
   */
  return (
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

          {records.slice(0, 8).map((record, index) => (

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

              <td className="patient-date-cell">
                {formatDate(
                  record.recorded_at ||
                    record.date_recorded ||
                    record.created_at
                )}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}


/* ============================================================
   APPOINTMENTS PAGE
============================================================ */

function AppointmentsPage({ appointments }) {

  return (
    <section className="patient-healthinfo-card">

      <div className="patient-card-header">

        <div className="patient-card-title">

          <span className="patient-panel-icon patient-panel-icon-small">
            <Calendar size={19} />
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

              {appointments.map((appointment) => (

                <tr key={appointment.appointment_id}>

                  <td>
                    {formatDateTime(
                      appointment.scheduled_at
                    )}
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

    </section>
  );
}


/* ============================================================
   PATIENT INFORMATION PAGE
============================================================ */

function PatientInformationPage({ patient }) {

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
            <User size={19} />
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
          value={formatGender(patient.sex)}
        />

        <InfoField
          label="Date of Birth"
          value={formatDate(patient.birthdate)}
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
   VITAL SIGNS PAGE
============================================================ */

function VitalSignsPage({ records, definition }) {

  return (
    <section className="patient-healthinfo-card">

      <div className="patient-card-header">

        <div className="patient-card-title">

          <span className="patient-panel-icon patient-panel-icon-small">
            <Activity size={19} />
          </span>

          <h2>Vital Signs</h2>

        </div>

      </div>


      {records.length === 0 ? (

        <div className="patient-empty-state">
          No vital signs recorded.
        </div>

      ) : (

        <VitalSignsTable
          records={records}
          definition={definition}
        />

      )}

    </section>
  );
}


/* ============================================================
   DATE HELPERS
============================================================ */

function formatDate(date) {

  if (!date) return "--";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}


function formatDateTime(date) {

  if (!date) return "--";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}


function formatGender(gender) {

  if (!gender) return null;

  return (
    gender.charAt(0).toUpperCase() +
    gender.slice(1).toLowerCase()
  );
}