/**
 * Direct port of app/Policies/{PatientPolicy,AppointmentPolicy,
 * ClinicalRecordPolicy}.php. These are the fine-grained "may this specific
 * user touch this specific record" checks that sit below the coarse
 * `requireRole` route guard -- same split the original app has between
 * route-level `role:` middleware and policy classes.
 */

const isStaff = (user) => user.role === "admin" || user.role === "health_worker";
const isAdmin = (user) => user.role === "admin";
const isHealthWorker = (user) => user.role === "health_worker";

export const PatientPolicy = {
  /** Staff see the patient list; patients do not. */
  viewAny: (user) => isStaff(user),

  /** Staff see any patient. A patient sees only themselves. */
  view: (user, patient) => isStaff(user) || patient.user_id === user.user_id,

  /** Any staff member may bring a patient record into existence. */
  create: (user) => isStaff(user),

  /**
   * Use the patient registration screen. Narrower than create(): the
   * original study assigns patient intake to the health worker.
   */
  register: (user) => isHealthWorker(user),

  /** Give a patient a portal login -- the midwife's job, not the health worker's. */
  createAccount: (user) => isAdmin(user),

  update: (user) => isStaff(user),

  /** Deleting a patient destroys their clinical history -- midwife only. */
  delete: (user) => isAdmin(user),
};

export const AppointmentPolicy = {
  viewAny: (user) => isStaff(user),

  view: (user, appointment) => isStaff(user) || appointment.patient_user_id === user.user_id,

  /** Scheduling is the midwife's responsibility; patients cannot book. */
  create: (user) => isAdmin(user),

  update: (user) => isAdmin(user),

  delete: (user) => isAdmin(user),
};

/**
 * One policy covering all five clinical record tables (health_assessments,
 * vital_signs, midwife_notes, medical_histories, allergies).
 * The rule: the admin owns clinical documentation. Health workers
 * register patients but do not diagnose. Patients read, never write.
 */
export const ClinicalRecordPolicy = {
  view: (user, record) => isStaff(user) || record.patient_user_id === user.user_id,

  create: (user) => isAdmin(user),

  update: (user) => isAdmin(user),

  delete: (user) => isAdmin(user),
};
