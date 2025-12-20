import express from "express";
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";

const router = express.Router();

/* =======================
   DOCTOR ROUTES
======================= */

// Get all doctors
router.get("/", getAllDoctors);

// Get single doctor by ID
router.get("/:id", getDoctorById);

// Create new doctor
router.post("/", createDoctor);

// Update doctor
router.put("/:id", updateDoctor);

// Delete doctor
router.delete("/:id", deleteDoctor);

/* =======================
   EXPORT
======================= */

export default router;
