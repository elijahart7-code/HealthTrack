import { Router } from "express";
import { getAppointments, getDashboard } from "../controllers/midwife/getRequests.controller.js";

const router = Router();

router.get("/dashboard", getDashboard);
router.get("/appointments", getAppointments);

export default router;
