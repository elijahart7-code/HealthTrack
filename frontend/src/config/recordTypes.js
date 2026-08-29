/** Mirrors backend/src/config/recordTypes.js -- drives the clinical-record tabs/forms. */
export const RECORD_TYPES = {
  diagnoses: {
    label: "Diagnoses",
    singular: "Diagnosis",
    table: "diagnoses",
    dateField: "diagnosed_at",
    dateLabel: "Date diagnosed",
    fields: {
      diagnosis: { label: "Diagnosis", type: "text", required: true, primary: true },
      description: { label: "Description", type: "textarea", required: false, column: true },
    },
  },
  "lab-values": {
    label: "Lab Values",
    singular: "Lab Value",
    table: "lab_values",
    dateField: "tested_at",
    dateLabel: "Date tested",
    fields: {
      test_name: { label: "Test name", type: "text", required: true, primary: true },
      value: { label: "Result", type: "text", required: true, column: true },
      unit: { label: "Unit", type: "text", required: false, column: true },
      reference_range: { label: "Reference range", type: "text", required: false, column: true },
    },
  },
  "doctor-notes": {
    label: "Doctor Notes",
    singular: "Doctor Note",
    table: "doctor_notes",
    dateField: "noted_at",
    dateLabel: "Date noted",
    fields: {
      title: { label: "Title", type: "text", required: true, primary: true },
      note: { label: "Note", type: "textarea", required: true, column: true },
    },
  },
  "medical-history": {
    label: "Medical History",
    singular: "Medical History Entry",
    table: "medical_histories",
    dateField: "recorded_at",
    dateLabel: "Date recorded",
    fields: {
      condition: { label: "Condition", type: "text", required: true, primary: true },
      details: { label: "Details", type: "textarea", required: false, column: true },
    },
  },
  allergies: {
    label: "Allergies",
    singular: "Allergy",
    table: "medication_allergies",
    dateField: "recorded_at",
    dateLabel: "Date recorded",
    fields: {
      allergen: { label: "Allergen", type: "text", required: true, primary: true },
      reaction: { label: "Reaction", type: "textarea", required: false, column: true },
      severity: {
        label: "Severity",
        type: "select",
        required: false,
        column: true,
        options: { mild: "Mild", moderate: "Moderate", severe: "Severe" },
      },
    },
  },
};
