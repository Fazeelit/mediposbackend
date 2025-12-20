import express from "express";
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

import mongoose from "mongoose";
import verifyToken, { verifAdmin } from "../middleware/authMiddleware.js";
import validateId from "@/middleware/validateId.js";
import { verifyAdmin } from "@/middleware/auth.js";
const router = express.Router();

/* =======================
   APPOINTMENT ROUTES
======================= */

// Get all appointments (optional date filter)
router.get("/", getAllAppointments);

// Get single appointment
router.get("/:id", validateId, verifyToken, verifyAdmin, getAppointmentById);

// Create new appointment
router.post("/createAppointment/", verifyToken, verifyAdmin, createAppointment);

// Update appointment
router.put("/updateAppointment/:id", verifyToken, verifyAdmin, updateAppointment);

// Delete appointment
router.delete("/deleteAppointment/:id", verifyToken, verifyAdmin, deleteAppointment);

/* =======================
   EXPORT
======================= */

export default router;
