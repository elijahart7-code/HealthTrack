import { Router } from "express";
import {
  getAllPatients,
  getClinicalRecords,
  getPatient,
  getPatientAppointments,
  getRecordTypes,
} from "../controllers/patients/getRequests.controller.js";
import {
  createAppointment,
  createClinicalRecord,
  createPortalAccount,
  registerPatient,
} from "../controllers/patients/postRequests.controller.js";
import { updatePatient } from "../controllers/patients/updateRequests.controller.js";
import { deleteClinicalRecord, deletePatient } from "../controllers/patients/deleteRequest.controller.js";

/**
 * Shared by midwife and health worker (mounted with
 * requireRole("admin", "health_worker") in server.js) -- both need the
 * patient registry, fine-grained differences (e.g. who may register a
 * patient or grant a portal login) are enforced inside each controller via
 * policies/policies.js, exactly like the original app's route-group vs.
 * policy-class split.
 */
const router = Router();

router.get("/record-types", getRecordTypes);
router.get("/", getAllPatients);
router.post("/", registerPatient);
router.get("/:patientId", getPatient);
router.patch("/:patientId", updatePatient);
router.delete("/:patientId", deletePatient);

router.get("/:patientId/appointments", getPatientAppointments);
router.post("/:patientId/appointments", createAppointment);

router.post("/:patientId/portal-account", createPortalAccount);

router.get("/:patientId/records/:type", getClinicalRecords);
router.post("/:patientId/records/:type", createClinicalRecord);
router.delete("/:patientId/records/:type/:recordId", deleteClinicalRecord);

export default router;
