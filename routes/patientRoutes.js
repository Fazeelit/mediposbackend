import express from "express";
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

const router = express.Router();

/* =======================
   PATIENT ROUTES
======================= */

// Get all patients (search)
router.get("/", getAllPatients);

// Get single patient by patientId (PAT-001)
router.get("/:id", getPatientById);

// Create new patient
router.post("/createPatient/", createPatient);

// Update patient
router.put("/updatePatient/:id", updatePatient);

// Delete patient
router.delete("/deletePatient/:id", deletePatient);

/* =======================
   EXPORT
======================= */

export default router;
