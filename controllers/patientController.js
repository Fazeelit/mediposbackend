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

    if (mongoose.Types.ObjectId.isValid(id)) {
      patient = await Patient.findById(id);
    }

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
    const {
      patientId,
      name,
      phone,
      address = "Nil",
      age = 0,
      gender = "Other",
      bloodgroup = 0,
    } = req.body;

    const patient = await Patient.create({
      patientId,
      name,
      phone,
      address,
      age,
      gender,
      bloodgroup,
    });

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

    // Ensure fields are properly defaulted
    const updateData = {
      ...req.body,
      address: req.body.address,
      age: req.body.age ?? 0,
      gender: req.body.gender,
      bloodGroup: req.body.bloodGroup ,
    };

    // Try to update patient by patientId
    const patient = await Patient.findOneAndUpdate(
      { patientId: id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    console.error("Update patient error:", error);
    return res.status(500).json({
      success: false,
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

    // Match by patientId OR MongoDB _id
    const patient = await Patient.findOneAndDelete({
      $or: [{ patientId: id }, { _id: id }]
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("Delete patient error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete patient",
      error: error.message,
    });
  }
};

export {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
