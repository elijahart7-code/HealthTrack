import { useSearchParams } from "react-router";
import { User, Calendar, Activity, FileText, ShieldAlert, ArrowRight } from "lucide-react";

/**
 * Port of resources/views/livewire/patient/dashboard.blade.php -- the
 * gradient welcome banner, metric cards, health-summary panel, emergency
 * contacts and health tips are all cosmetic/static in the original too
 * (the centre's own contact details, not patient-specific data), so they're
 * reproduced as-is; only the metric numbers are wired to real data.
 */
export function Dashboard({ dashboard }) {
  const [, setSearchParams] = useSearchParams();

  // A patient account should always have a matching patient record; if the
  // link is missing, show an empty state, mirroring the original
  // livewire.patient.no-record view.
  if (!dashboard.patient) {
    return (
      <div className="grid gap-4">
        <section className="ht-page-header">
          <div>
            <h1>No patient record found</h1>
          </div>
        </section>
        <div className="ht-panel">
          <div className="ht-empty">
            Your account is not linked to a patient record yet.
            <span className="mt-2 block text-xs">
              Please contact the Barangay Health Center of Mambog I so a health worker can link it.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard-shell">
      <section className="patient-welcome-banner">
        <div className="patient-profile-circle" aria-hidden="true">
          <User size={42} strokeWidth={2} />
        </div>

        <div className="patient-welcome-copy">
          <h1>Welcome, {dashboard.patient.first_name}</h1>
          <p>Your records at the Barangay Health Center of Mambog I.</p>
        </div>

        <button type="button" className="patient-portal-button">
          Patient Portal
          <ArrowRight size={18} strokeWidth={1.9} style={{ transform: "rotate(-45deg)" }} />
        </button>
      </section>

      <div className="patient-metric-grid">
        <div className="patient-metric-card">
          <div className="patient-metric-icon">
            <Calendar size={24} strokeWidth={1.8} />
          </div>
          <h3>Upcoming Appointments</h3>
          <p>{dashboard.upcomingCount}</p>
        </div>

        <div className="patient-metric-card">
          <div className="patient-metric-icon">
            <ShieldAlert size={24} strokeWidth={1.8} />
          </div>
          <h3>Known Allergies</h3>
          <p>{dashboard.allergyCount}</p>
        </div>
      </div>

      <section className="patient-panel patient-health-summary">
        <div className="patient-health-copy">
          <div className="patient-panel-icon" aria-hidden="true">
            <FileText size={22} strokeWidth={1.8} />
          </div>
          <h2>Your Health Information</h2>
          <p>
            Your Personal Information, Appointments, Vital Signs, Health Assessments, Midwife Notes, Medical History
            and Allergies are all recorded here by the admin and shown in one place!
          </p>
          <button onClick={() => setSearchParams({ page: "health-information" })} className="patient-summary-button">
            View My Health Information
            <ArrowRight size={18} strokeWidth={1.9} />
          </button>
        </div>

        <div className="patient-health-illustration" aria-hidden="true">
          <Activity size={140} strokeWidth={1} />
        </div>
      </section>

      <section className="patient-panel">
        <div className="patient-section-header">
          <div className="patient-panel-icon patient-panel-icon-small" aria-hidden="true">
            <ShieldAlert size={18} strokeWidth={1.9} />
          </div>
          <div>
            <h2>Emergency Contact</h2>
            <p>Important contacts and information in case of emergency.</p>
          </div>
        </div>

        <div className="patient-emergency-grid">
          <ContactCard title="Barangay Mambog I" line1="Brgy. Mambog I, Bacoor, Cavite" line2="(046) 123-4567" />
          <ContactCard title="City Government of Bacoor" line1="Bacoor City Hall, Bacoor, Cavite" line2="(046) 417-3000" />
          <ContactCard title="Emergency Hotline" line1="(046) 123-4567" line2="24/7 Available" />
          <ContactCard title="Office Hours" line1="Mon - Fri: 8:00 AM - 5:00 PM" line2="(Closed on weekends and holidays)" />
        </div>
      </section>

      <section className="patient-panel patient-health-tips">
        <div className="patient-tips-heading">
          <div className="patient-panel-icon patient-panel-icon-small" aria-hidden="true">
            <Activity size={18} strokeWidth={1.9} />
          </div>
          <div>
            <h2>Health Tips for You</h2>
            <p>Health is your Wealth!</p>
          </div>
        </div>

        <div className="patient-tip-grid">
          <TipItem text="Drink plenty of water daily." />
          <TipItem text="Eat balanced and healthy meals." />
          <TipItem text="Stay active and exercise." />
          <TipItem text="Get enough rest and sleep well." />
        </div>
      </section>
    </div>
  );
}

function ContactCard({ title, line1, line2 }) {
  return (
    <div className="patient-contact-card">
      <div className="patient-contact-icon">
        <User size={18} strokeWidth={1.9} />
      </div>
      <div className="patient-contact-body">
        <h3>{title}</h3>
        <p>{line1}</p>
        <span>{line2}</span>
      </div>
    </div>
  );
}

function TipItem({ text }) {
  return (
    <div className="patient-tip-item">
      <div className="patient-tip-icon">
        <Activity size={22} strokeWidth={1.9} />
      </div>
      <span>{text}</span>
    </div>
  );
}