import mongoose from "mongoose";
import Patient from "../models/patientModel.js";

/**
 * Get all patients (search)
 * GET /api/patients?search=
 */
const getAllPatients = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { patientId: { $regex: search, $options: "i" } },
      ];
    }

    const patients = await Patient.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch patients",
      error: error.message,
    });
  }
};

/**
 * Get single patient by ID
 * GET /api/patients/:id
 */
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    let patient = null;

    // Check if valid MongoDB _id
    if (mongoose.Types.ObjectId.isValid(id)) {
      patient = await Patient.findById(id);
    }

    // Fallback to patientId
    if (!patient) {
      patient = await Patient.findOne({ patientId: id });
    }

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patient", error: error.message });
  }
};

/**
 * Create new patient
 * POST /api/patients
 */
const createPatient = async (req, res) => {
  try {
    console.log("Incoming patient data:", req.body); // <- DEBUG: log incoming data

    // Create patient
    const patient = await Patient.create(req.body);    

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {    

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Patient ID already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create patient",
      error: error.message,
    });
  }
};

/**
 * Update patient
 * PUT /api/patients/:id
 */
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOneAndUpdate(
      { patientId: id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update patient",
      error: error.message,
    });
  }
};

/**
 * Delete patient
 * DELETE /api/patients/:id
 */
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOneAndDelete({ patientId: id });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete patient",
      error: error.message,
    });
  }
};

/* =======================
   EXPORTS (AT END)
======================= */

export {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
