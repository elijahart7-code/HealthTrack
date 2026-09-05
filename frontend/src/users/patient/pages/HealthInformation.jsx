import { useState } from "react";
import {
  Home,
  CalendarDays,
  UserRound,
  HeartPulse,
  LockKeyhole,
  Eye,
  ShieldPlus,
  FileText,
  LogOut,
} from "lucide-react";

export function HealthInformation({ healthInfo }) {
  const [activeSection, setActiveSection] = useState("overview");

  if (!healthInfo?.patient) {
    return (
      <div style={styles.page}>
        <div style={styles.empty}>
          Your account is not linked to a patient record yet.
        </div>
      </div>
    );
  }

  const {
    patient,
    appointments = [],
    records = {},
    recordTypes = {},
  } = healthInfo;

  const patientName = [
    patient.first_name,
    patient.middle_name,
    patient.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const vitalSigns =
    records["vital-signs"] ||
    records["vital_signs"] ||
    records["vitalSigns"] ||
    [];

  const vitalDefinition =
    recordTypes["vital-signs"] ||
    recordTypes["vital_signs"] ||
    recordTypes["vitalSigns"];

  return (
    <div style={styles.page}>

      {/* =====================================================
          TOP HEADER
      ===================================================== */}
      <header style={styles.topHeader}>

        {/* LOGO */}
        <div style={styles.logoArea}>
          <div style={styles.logoBox}>HT</div>
          <span style={styles.logoText}>HealthTrack</span>
        </div>

        {/* TOP NAVIGATION */}
        <div style={styles.topNavigation}>

          <button
            style={styles.topNavButton}
            onClick={() => {}}
          >
            Dashboard
          </button>

          <button
            style={{
              ...styles.topNavButton,
              ...styles.topNavActive,
            }}
          >
            My Health Information
          </button>

        </div>

        {/* USER */}
        <div style={styles.userArea}>

          <div style={styles.userName}>
            <strong>{patientName || "Juan Dela Cruz"}</strong>
            <span>Patient</span>
          </div>

          <button style={styles.logoutButton}>
            <LogOut size={17} />
            Log out
          </button>

        </div>

      </header>


      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}
      <div style={styles.layout}>


        {/* ===================================================
            SIDEBAR
        =================================================== */}
        <aside style={styles.sidebar}>

          {/* OVERVIEW */}
          <button
            onClick={() => setActiveSection("overview")}
            style={{
              ...styles.sidebarItem,
              ...(activeSection === "overview"
                ? styles.sidebarOverviewActive
                : {}),
            }}
          >
            <Home size={23} strokeWidth={1.7} />
            <span>Overview</span>
          </button>


          {/* SIDEBAR TITLE */}
          <div style={styles.sidebarTitle}>
            MY HEALTH INFORMATION
          </div>


          {/* APPOINTMENTS */}
          <button
            onClick={() => setActiveSection("appointments")}
            style={{
              ...styles.sidebarItem,
              ...(activeSection === "appointments"
                ? styles.sidebarActive
                : {}),
            }}
          >
            <CalendarDays size={23} strokeWidth={1.7} />
            <span>Appointments</span>
          </button>


          {/* PATIENT INFORMATION */}
          <button
            onClick={() =>
              setActiveSection("patient-information")
            }
            style={{
              ...styles.sidebarItem,
              ...(activeSection === "patient-information"
                ? styles.sidebarActive
                : {}),
            }}
          >
            <UserRound size={23} strokeWidth={1.7} />
            <span>Patient Information</span>
          </button>


          {/* VITAL SIGNS */}
          <button
            onClick={() => setActiveSection("vital-signs")}
            style={{
              ...styles.sidebarItem,
              ...(activeSection === "vital-signs"
                ? styles.sidebarActive
                : {}),
            }}
          >
            <HeartPulse size={23} strokeWidth={1.7} />
            <span>Vital Signs</span>
          </button>


          {/* =================================================
              HELP CARD
          ================================================= */}
          <div style={styles.helpCard}>

            <div style={styles.helpIcon}>
              <ShieldPlus
                size={42}
                strokeWidth={1.5}
              />
            </div>

            <div>
              <h3 style={styles.helpTitle}>
                Need help?
              </h3>

              <p style={styles.helpText}>
                Contact your midwife or
                <br />
                health worker for assistance.
              </p>
            </div>

          </div>

        </aside>


        {/* ===================================================
            CONTENT
        =================================================== */}
        <main style={styles.content}>


          {/* =================================================
              PAGE HEADER
          ================================================= */}
          <section style={styles.pageHeader}>

            <div style={styles.pageHeaderLeft}>

              <div style={styles.headerIcon}>
                <FileText
                  size={27}
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <h1 style={styles.pageTitle}>
                  My Health Information
                </h1>

                <p style={styles.pageSubtitle}>
                  Everything has been recorded here at
                  Barangay Health Center of Mambog I.
                </p>
              </div>

            </div>


            <div style={styles.readOnly}>
              <LockKeyhole
                size={16}
                strokeWidth={1.8}
              />
              Read Only
            </div>

          </section>


          {/* =================================================
              OVERVIEW
          ================================================= */}
          {activeSection === "overview" && (
            <>
              <AppointmentsCard
                appointments={appointments}
                onViewAll={() =>
                  setActiveSection("appointments")
                }
              />

              <PatientInformationCard
                patient={patient}
                patientName={patientName}
                onViewAll={() =>
                  setActiveSection("patient-information")
                }
              />

              <VitalSignsCard
                records={vitalSigns}
                definition={vitalDefinition}
                onViewAll={() =>
                  setActiveSection("vital-signs")
                }
              />

              {/* PAGE FOOTER */}
              <div style={styles.pagination}>

                <span style={styles.pageNumber}>
                  Page 1 of 2
                </span>

                <button style={styles.nextButton}>
                  Next Page
                </button>

              </div>
            </>
          )}


          {/* =================================================
              APPOINTMENTS
          ================================================= */}
          {activeSection === "appointments" && (
            <AppointmentsCard
              appointments={appointments}
              onViewAll={() => {}}
              full
            />
          )}


          {/* =================================================
              PATIENT INFORMATION
          ================================================= */}
          {activeSection === "patient-information" && (
            <PatientInformationCard
              patient={patient}
              patientName={patientName}
              onViewAll={() => {}}
              full
            />
          )}


          {/* =================================================
              VITAL SIGNS
          ================================================= */}
          {activeSection === "vital-signs" && (
            <VitalSignsCard
              records={vitalSigns}
              definition={vitalDefinition}
              onViewAll={() => {}}
              full
            />
          )}

        </main>

      </div>

    </div>
  );
}


/* ============================================================
   APPOINTMENTS CARD
============================================================ */

function AppointmentsCard({
  appointments,
  onViewAll,
  full = false,
}) {
  const shownAppointments = full
    ? appointments
    : appointments.slice(0, 2);

  return (
    <section style={styles.card}>

      {/* CARD HEADER */}
      <div style={styles.cardHeader}>

        <div style={styles.cardTitleArea}>

          <div style={styles.cardIcon}>
            <CalendarDays
              size={22}
              strokeWidth={1.7}
            />
          </div>

          <h2 style={styles.cardTitle}>
            Appointments
          </h2>

        </div>

        <span style={styles.totalBadge}>
          {appointments.length} total
        </span>

      </div>


      {/* TABLE */}
      {appointments.length > 0 ? (

        <div style={styles.tableContainer}>

          <table style={styles.table}>

            <thead>

              <tr>
                <th style={styles.th}>
                  Date and Time
                </th>

                <th style={styles.th}>
                  Reason
                </th>

                <th style={styles.th}>
                  Status
                </th>
              </tr>

            </thead>

            <tbody>

              {shownAppointments.map((appointment) => (

                <tr key={appointment.appointment_id}>

                  <td style={styles.td}>

                    <div style={styles.dateCell}>
                      <CalendarDays
                        size={16}
                        strokeWidth={1.7}
                      />

                      {formatDateTime(
                        appointment.scheduled_at
                      )}
                    </div>

                  </td>

                  <td style={styles.td}>
                    {appointment.reason || "--"}
                  </td>

                  <td style={styles.td}>

                    <span style={styles.status}>
                      {appointment.status ||
                        "Confirmed"}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      ) : (

        <div style={styles.emptyInside}>
          No appointments recorded.
        </div>

      )}


      {/* FOOTER */}
      {!full && (
        <div style={styles.tableFooter}>
          Showing 1 to{" "}
          {Math.min(appointments.length, 2)}{" "}
          appointments
        </div>
      )}

    </section>
  );
}


/* ============================================================
   PATIENT INFORMATION CARD
============================================================ */

function PatientInformationCard({
  patient,
  patientName,
  onViewAll,
  full = false,
}) {
  return (
    <section style={styles.card}>

      {/* HEADER */}
      <div style={styles.cardHeader}>

        <div style={styles.cardTitleArea}>

          <div style={styles.cardIcon}>
            <UserRound
              size={22}
              strokeWidth={1.7}
            />
          </div>

          <h2 style={styles.cardTitle}>
            Patient Information
          </h2>

        </div>


        {!full && (
          <button
            onClick={onViewAll}
            style={styles.viewAllButton}
          >
            <Eye size={17} strokeWidth={1.7} />
            View All
          </button>
        )}

      </div>


      {/* INFORMATION */}
      <div style={styles.patientGrid}>

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

        {full && (
          <InfoField
            label="Civil Status"
            value={patient.civil_status}
          />
        )}

      </div>

    </section>
  );
}


/* ============================================================
   VITAL SIGNS CARD
============================================================ */

function VitalSignsCard({
  records,
  definition,
  onViewAll,
  full = false,
}) {
  const shownRecords = full
    ? records
    : records.slice(0, 8);

  return (
    <section style={styles.card}>

      {/* HEADER */}
      <div style={styles.cardHeader}>

        <div style={styles.cardTitleArea}>

          <div style={styles.cardIcon}>
            <HeartPulse
              size={22}
              strokeWidth={1.7}
            />
          </div>

          <h2 style={styles.cardTitle}>
            Vital Signs
          </h2>

        </div>


        {!full && (
          <button
            onClick={onViewAll}
            style={styles.viewAllButton}
          >
            <Eye size={17} strokeWidth={1.7} />
            View All
          </button>
        )}

      </div>


      {shownRecords.length > 0 ? (

        <div style={styles.tableContainer}>

          <VitalSignsTable
            records={shownRecords}
            definition={definition}
          />

        </div>

      ) : (

        <div style={styles.emptyInside}>
          No vital signs recorded.
        </div>

      )}


      {!full && (
        <div style={styles.tableFooter}>
          Showing latest vital signs
        </div>
      )}

    </section>
  );
}


/* ============================================================
   VITAL SIGNS TABLE
============================================================ */

function VitalSignsTable({
  records,
  definition,
}) {

  /*
   * Use your existing backend record definition
   * when available.
   */
  if (definition?.fields) {

    const fields = Object.entries(
      definition.fields
    ).filter(
      ([, field]) => field.column || field.primary
    );

    return (
      <table style={styles.table}>

        <thead>
          <tr>

            {fields.map(([column, field]) => (
              <th
                key={column}
                style={styles.th}
              >
                {field.label}
              </th>
            ))}

            <th style={styles.th}>
              {definition.dateLabel ||
                "Date Recorded"}
            </th>

          </tr>
        </thead>


        <tbody>

          {records.map((record, index) => (

            <tr
              key={
                record.record_id || index
              }
            >

              {fields.map(([column, field]) => (

                <td
                  key={column}
                  style={styles.td}
                >

                  {field.type === "select"
                    ? field.options?.[
                        record[column]
                      ] ||
                      record[column] ||
                      "--"
                    : record[column] || "--"}

                </td>

              ))}

              <td
                style={styles.td}
              >
                {formatDate(
                  record[
                    definition.dateField
                  ]
                )}
              </td>

            </tr>

          ))}

        </tbody>

      </table>
    );
  }


  /*
   * Fallback for common vital-sign format.
   */
  return (
    <table style={styles.table}>

      <thead>
        <tr>

          <th style={styles.th}>
            Measurement
          </th>

          <th style={styles.th}>
            Result
          </th>

          <th style={styles.th}>
            Unit
          </th>

          <th style={styles.th}>
            Date Recorded
          </th>

        </tr>
      </thead>


      <tbody>

        {records.map((record, index) => (

          <tr key={record.record_id || index}>

            <td style={styles.td}>
              {record.measurement ||
                record.type ||
                record.name ||
                "--"}
            </td>

            <td style={styles.td}>
              {record.result ||
                record.value ||
                "--"}
            </td>

            <td style={styles.td}>
              {record.unit || "--"}
            </td>

            <td style={styles.td}>
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
  );
}


/* ============================================================
   INFORMATION FIELD
============================================================ */

function InfoField({ label, value }) {

  return (
    <div style={styles.infoField}>

      <span style={styles.infoLabel}>
        {label}
      </span>

      <span style={styles.infoValue}>
        {value || "Not provided"}
      </span>

    </div>
  );
}


/* ============================================================
   HELPERS
============================================================ */

function formatDate(date) {

  if (!date) return "--";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  );
}


function formatDateTime(date) {

  if (!date) return "--";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}


function formatGender(gender) {

  if (!gender) return null;

  return (
    gender.charAt(0).toUpperCase() +
    gender.slice(1).toLowerCase()
  );
}


/* ============================================================
   INLINE STYLES
============================================================ */

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f1f8f5",
    color: "#171b19",
    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",
    boxSizing: "border-box",
  },


  /* ================= TOP HEADER ================= */

  topHeader: {
    height: "76px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 22px 0 18px",
    background: "#f1f8f5",
    boxSizing: "border-box",
  },


  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: "270px",
  },


  logoBox: {
    width: "43px",
    height: "43px",
    borderRadius: "10px",
    background: "#087b50",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "17px",
  },


  logoText: {
    fontSize: "19px",
    fontWeight: "600",
  },


  topNavigation: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },


  topNavButton: {
    border: "none",
    background: "transparent",
    padding: "12px 25px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },


  topNavActive: {
    background: "#e3eee9",
    boxShadow:
      "inset 0 0 0 1px rgba(100,130,115,.06)",
  },


  userArea: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: "270px",
    justifyContent: "flex-end",
  },


  userName: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    lineHeight: "1.1",
    fontSize: "14px",
  },


  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "1px solid #aab8b1",
    background: "#e9f1ed",
    borderRadius: "10px",
    padding: "10px 13px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },


  /* ================= LAYOUT ================= */

  layout: {
    display: "grid",
    gridTemplateColumns: "360px minmax(0, 1fr)",
    gap: "10px",
    padding: "0 16px 25px",
    boxSizing: "border-box",
  },


  /* ================= SIDEBAR ================= */

  sidebar: {
    minHeight: "calc(100vh - 95px)",
    paddingRight: "8px",
    boxSizing: "border-box",
  },


  sidebarItem: {
    width: "100%",
    height: "57px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "0 18px",
    marginBottom: "3px",
    border: "1px solid transparent",
    background: "transparent",
    borderRadius: "7px",
    color: "#111614",
    fontSize: "15px",
    fontWeight: "600",
    textAlign: "left",
    cursor: "pointer",
  },


  sidebarOverviewActive: {
    background: "#f1f8f5",
    border: "1px solid #aab8b1",
  },


  sidebarActive: {
    background: "#dcebe4",
  },


  sidebarTitle: {
    fontSize: "14px",
    fontWeight: "700",
    margin: "9px 18px 10px",
    letterSpacing: "0.1px",
  },


  /* ================= HELP CARD ================= */

  helpCard: {
    margin: "72px 3px 0",
    minHeight: "176px",
    border: "1px solid #d7e1dc",
    background: "#edf5f1",
    borderRadius: "0px",
    padding: "22px 16px",
    display: "flex",
    alignItems: "center",
    gap: "17px",
    boxSizing: "border-box",
  },


  helpIcon: {
    width: "68px",
    height: "68px",
    border: "1.5px solid #76827d",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },


  helpTitle: {
    fontSize: "15px",
    margin: "0 0 10px",
    fontWeight: "700",
  },


  helpText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.45",
    fontWeight: "500",
  },


  /* ================= CONTENT ================= */

  content: {
    minWidth: 0,
    paddingLeft: "0px",
  },


  /* ================= PAGE HEADER ================= */

  pageHeader: {
    minHeight: "84px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px 14px 12px",
    boxSizing: "border-box",
  },


  pageHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },


  headerIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#e4eee9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },


  pageTitle: {
    margin: 0,
    fontSize: "21px",
    fontWeight: "700",
    lineHeight: "1.2",
  },


  pageSubtitle: {
    margin: "3px 0 0",
    fontSize: "15px",
    lineHeight: "1.3",
  },


  readOnly: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #a8b5af",
    background: "#e9f1ed",
    borderRadius: "10px",
    padding: "10px 13px",
    fontSize: "14px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },


  /* ================= CARD ================= */

  card: {
    background: "#f4f9f7",
    border: "1px solid #dbe6e1",
    borderRadius: "10px",
    marginBottom: "8px",
    padding: "14px 15px 8px",
    boxSizing: "border-box",
    overflow: "hidden",
  },


  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "48px",
  },


  cardTitleArea: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },


  cardIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#e5efea",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },


  cardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
  },


  totalBadge: {
    border: "1px solid #8c9993",
    background: "#e8f0ec",
    borderRadius: "17px",
    padding: "8px 15px",
    fontSize: "14px",
    fontWeight: "700",
  },


  viewAllButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid #9ba9a2",
    background: "#e8f0ec",
    borderRadius: "10px",
    padding: "6px 11px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },


  /* ================= TABLE ================= */

  tableContainer: {
    width: "100%",
    overflow: "hidden",
    border: "1px solid #aab7b1",
    borderRadius: "10px",
    boxSizing: "border-box",
  },


  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
    fontSize: "14px",
  },


  th: {
    background: "#dce9e3",
    padding: "8px 18px",
    textAlign: "left",
    fontWeight: "700",
    borderBottom: "1px solid #b7c2bd",
  },


  td: {
    padding: "7px 18px",
    borderBottom: "1px solid #bcc7c2",
    fontWeight: "500",
    verticalAlign: "middle",
  },


  dateCell: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },


  status: {
    fontWeight: "700",
  },


  tableFooter: {
    height: "36px",
    border: "1px solid #aab7b1",
    borderTop: "none",
    borderRadius: "0 0 10px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "600",
    marginTop: "-1px",
  },


  emptyInside: {
    padding: "25px",
    textAlign: "center",
    fontSize: "14px",
  },


  /* ================= PATIENT INFO ================= */

  patientGrid: {
    display: "grid",
    gridTemplateColumns:
      "1.25fr 0.85fr 1fr 0.75fr",
    columnGap: "20px",
    rowGap: "13px",
    padding: "7px 18px 9px",
  },


  infoField: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    minWidth: 0,
  },


  infoLabel: {
    fontSize: "14px",
    fontWeight: "700",
  },


  infoValue: {
    fontSize: "15px",
    fontWeight: "500",
    overflowWrap: "break-word",
  },


  /* ================= PAGINATION ================= */

  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "2px 15px 0",
  },


  pageNumber: {
    fontSize: "14px",
    fontWeight: "600",
  },


  nextButton: {
    minWidth: "170px",
    border: "1px solid #8f9d96",
    background: "#dce9e3",
    borderRadius: "11px",
    padding: "7px 20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },


  empty: {
    padding: "40px",
    textAlign: "center",
  },
};