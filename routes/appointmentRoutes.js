import express from "express";
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

import validateId from "../middleware/validateId.js";

const router = express.Router();

/* =======================
   APPOINTMENT ROUTES
======================= */

// Get all appointments (optional date filter)
router.get("/", getAllAppointments);

// Get single appointment
router.get("/:id", validateId,getAppointmentById);

// Create new appointment
router.post("/createAppointment/", createAppointment);

// Update appointment
router.put("/updateAppointment/:id", updateAppointment);

// Delete appointment
router.delete("/deleteAppointment/:id", deleteAppointment);

/* =======================
   EXPORT
======================= */

export default router;
