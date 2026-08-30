import { Router } from "express";
import { updateAppointmentStatus } from "../controllers/patients/updateRequests.controller.js";
import { deleteAppointment } from "../controllers/patients/deleteRequest.controller.js";

const router = Router();

router.patch("/:appointmentId/status", updateAppointmentStatus);
router.delete("/:appointmentId", deleteAppointment);

export default router;
