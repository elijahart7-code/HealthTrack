import { Router } from "express";
import { getDashboard, getHealthInformation } from "../controllers/patientportal/getRequests.controller.js";

const router = Router();

router.get("/dashboard", getDashboard);
router.get("/health-information", getHealthInformation);

export default router;
