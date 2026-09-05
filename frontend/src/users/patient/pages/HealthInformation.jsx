import { Home, Calendar, User, Activity, Lock, HelpCircle, FileText, Eye } from "lucide-react";

export function HealthInformation({ healthInfo }) {
  if (!healthInfo?.patient) {
    return (
      <div className="patient-healthinfo-page">
        <div className="patient-healthinfo-main">
          <div className="patient-healthinfo-card">
            <div className="patient-empty-state">
              Your account is not linked to a patient record yet.
              <span className="mt-2 block text-xs">
                Please contact the Barangay Health Center of Mambog I so a
                health worker can link it.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    patient,
    recordTypes = {},
    records = {},
    appointments = [],
  } = healthInfo;

  /* --------------------------------
     PATIENT NAME
  -------------------------------- */
  const patientName =
    `${patient.first_name || ""} ${patient.middle_name || ""} ${
      patient.last_name || ""
    }`
      .replace(/\s+/g, " ")
      .trim();

  /* --------------------------------
     FIND VITAL SIGNS RECORD TYPE
  -------------------------------- */
  const vitalKey = Object.keys(recordTypes).find(
    (key) =>
      key.toLowerCase() === "vital-signs" ||
      key.toLowerCase() === "vital_signs" ||
      key.toLowerCase() === "vitals"
  );

  const vitalDefinition = vitalKey ? recordTypes[vitalKey] : null;
  const vitalRecords = vitalKey ? records[vitalKey] || [] : [];

  /* --------------------------------
     GET LATEST VITAL SIGNS
  -------------------------------- */
  const latestVital =
    vitalRecords.length > 0
      ? vitalRecords[vitalRecords.length - 1]
      : null;

  /* --------------------------------
     VITAL SIGN DISPLAY
  -------------------------------- */
  const vitalSigns = [
    {
      label: "Blood Pressure",
      value:
        latestVital?.blood_pressure ||
        latestVital?.bp ||
        latestVital?.bloodPressure ||
        "--",
      unit: "mmHg",
    },
    {
      label: "Heart Rate",
      value:
        latestVital?.heart_rate ||
        latestVital?.heartRate ||
        "--",
      unit: "bpm",
    },
    {
      label: "Temperature",
      value:
        latestVital?.temperature ||
        "--",
      unit: "°C",
    },
    {
      label: "Respiratory Rate",
      value:
        latestVital?.respiratory_rate ||
        latestVital?.respiratoryRate ||
        "--",
      unit: "breaths/min",
    },
    {
      label: "Height",
      value:
        latestVital?.height ||
        "--",
      unit: "cm",
    },
    {
      label: "Weight",
      value:
        latestVital?.weight ||
        "--",
      unit: "kg",
    },
    {
      label: "BMI",
      value:
        latestVital?.bmi ||
        "--",
      unit: "kg/m²",
    },
    {
      label: "Pulse Rate",
      value:
        latestVital?.pulse_rate ||
        latestVital?.pulseRate ||
        "--",
      unit: "bpm",
    },
  ];

  const vitalDate =
    latestVital?.recorded_at ||
    latestVital?.date_recorded ||
    latestVital?.created_at ||
    latestVital?.updated_at ||
    null;

  /* --------------------------------
     SCROLL TO SECTION
  -------------------------------- */
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="patient-healthinfo-page">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside className="patient-healthinfo-sidebar">

        <nav
          className="patient-healthinfo-nav"
          aria-label="Health information navigation"
        >

          {/* OVERVIEW */}
          <button
            type="button"
            className="patient-sidebar-item"
            onClick={() => scrollToSection("health-information-top")}
          >
            <span className="patient-sidebar-icon">
              <Home size={18} strokeWidth={1.8} />
            </span>

            <span>Overview</span>
          </button>

          {/* LABEL */}
          <div className="patient-sidebar-label">
            MY HEALTH INFORMATION
          </div>

          {/* APPOINTMENTS */}
          <button
            type="button"
            className="patient-sidebar-item is-active"
            onClick={() => scrollToSection("appointments")}
          >
            <span className="patient-sidebar-icon">
              <Calendar size={18} strokeWidth={1.8} />
            </span>

            <span>Appointments</span>
          </button>

          {/* PATIENT INFORMATION */}
          <button
            type="button"
            className="patient-sidebar-item"
            onClick={() => scrollToSection("patient-information")}
          >
            <span className="patient-sidebar-icon">
              <User size={18} strokeWidth={1.8} />
            </span>

            <span>Patient Information</span>
          </button>

          {/* VITAL SIGNS */}
          <button
            type="button"
            className="patient-sidebar-item"
            onClick={() => scrollToSection("vital-signs")}
          >
            <span className="patient-sidebar-icon">
              <Activity size={18} strokeWidth={1.8} />
            </span>

            <span>Vital Signs</span>
          </button>
        </nav>

        {/* =================================================
            HELP CARD
        ================================================== */}
        <div className="patient-help-card">

          <div className="patient-help-icon">
            <HelpCircle size={24} strokeWidth={1.8} />
          </div>

          <h3>Need help?</h3>

          <p>
            Contact your midwife or health worker for assistance.
          </p>

        </div>
      </aside>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main
        className="patient-healthinfo-main"
        id="health-information-top"
      >

        {/* =================================================
            PAGE HEADER
        ================================================== */}
        <section className="patient-healthinfo-header-card">

          <div className="patient-healthinfo-header-copy">

            <div className="patient-panel-icon patient-panel-icon-large">
              <FileText size={22} strokeWidth={1.8} />
            </div>

            <div>
              <h1>My Health Information</h1>

              <p>
                Everything has been recorded here at the Barangay Health
                Center of Mambog I.
              </p>
            </div>

          </div>

          <span className="patient-readonly-pill">
            <Lock size={16} strokeWidth={1.8} />
            Read Only
          </span>

        </section>


        {/* =====================================================
            APPOINTMENTS
        ====================================================== */}
        <section
          className="patient-healthinfo-card"
          id="appointments"
        >

          <div className="patient-card-header">

            <div className="patient-card-title">

              <span className="patient-panel-icon patient-panel-icon-small">
                <Calendar size={18} strokeWidth={1.8} />
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

                      <td className="patient-date-cell">

                        {appointment.scheduled_at
                          ? new Date(
                              appointment.scheduled_at
                            ).toLocaleString([], {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : "--"}

                      </td>

                      <td>
                        {appointment.reason || "--"}
                      </td>

                      <td>
                        <span className="patient-status-pill">
                          {appointment.status || "--"}
                        </span>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

          <div className="patient-table-footer">

            Showing 1 to {appointments.length} of{" "}
            {appointments.length} appointments

          </div>

        </section>


        {/* =====================================================
            PATIENT INFORMATION
        ====================================================== */}
        <section
          className="patient-healthinfo-card"
          id="patient-information"
        >

          <div className="patient-card-header">

            <div className="patient-card-title">

              <span className="patient-panel-icon patient-panel-icon-small">
                <User size={18} strokeWidth={1.8} />
              </span>

              <h2>Patient Information</h2>

            </div>

            <button
              type="button"
              className="patient-view-all-button"
              onClick={() => {}}
            >
              <Eye size={16} strokeWidth={1.8} />
              View All
            </button>

          </div>


          <div className="patient-information-grid">

            <InfoField
              label="Full Name"
              value={patientName || "Patient"}
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


        {/* =====================================================
            VITAL SIGNS
        ====================================================== */}
        <section
          className="patient-healthinfo-card"
          id="vital-signs"
        >

          <div className="patient-card-header">

            <div className="patient-card-title">

              <span className="patient-panel-icon patient-panel-icon-small">
                <Activity size={18} strokeWidth={1.8} />
              </span>

              <h2>Vital Signs</h2>

            </div>

            <button
              type="button"
              className="patient-view-all-button"
              onClick={() => {}}
            >
              <Eye size={16} strokeWidth={1.8} />
              View All
            </button>

          </div>


          {latestVital ? (

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

                  {vitalSigns.map((vital) => (

                    <tr key={vital.label}>

                      <td>
                        {vital.label}
                      </td>

                      <td>
                        {vital.value}
                      </td>

                      <td>
                        {vital.unit}
                      </td>

                      <td className="patient-date-cell">

                        {vitalDate
                          ? new Date(
                              vitalDate
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })
                          : "--"}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="patient-empty-state">
              No vital signs recorded.
            </div>

          )}


          <div className="patient-table-footer">
            Showing latest vital signs
          </div>

        </section>

      </main>
    </div>
  );
}


/* =========================================================
   PATIENT INFORMATION FIELD
========================================================= */

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