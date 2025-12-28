import mongoose from "mongoose";
import TestParameters from "../models/testparameterModel.js";

/* =========================
   CREATE Test
   ========================= */
const createTestparameter = async (req, res) => {
  try {
    const { name, parameters } = req.body;

    if (!name || !parameters || !Array.isArray(parameters) || parameters.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Test name and parameters are required",
      });
    }

    // Validate each parameter has a name
    for (let param of parameters) {
      if (!param.name) {
        return res.status(400).json({
          success: false,
          message: "Each parameter must have a name",
        });
      }
    }

    const test = await TestParameters.create({ name, parameters });

    res.status(201).json({
      success: true,
      message: "Test created successfully",
      data: test,
    });
  } catch (error) {
    console.error("Create Test Error:", error);
    res.status(500).json({ success: false, message: "Failed to create test" });
  }
};

/* =========================
   GET All Tests
   ========================= */
const getAllTestsparameter = async (req, res) => {
  try {
    const tests = await TestParameters.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tests });
  } catch (error) {
    console.error("Get Tests Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tests" });
  }
};

/* =========================
   GET Single Test
   ========================= */
const getTestparameterById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Test ID" });
  }

  try {
    const test = await TestParameters.findById(id);

    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    res.status(200).json({ success: true, data: test });
  } catch (error) {
    console.error("Get Test Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch test" });
  }
};

/* =========================
   UPDATE Test
   ========================= */
const updateTestparameter = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Test ID" });
  }

  try {
    const updatedTest = await TestParameters.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTest) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    res.status(200).json({
      success: true,
      message: "Test updated successfully",
      data: updatedTest,
    });
  } catch (error) {
    console.error("Update Test Error:", error);
    res.status(500).json({ success: false, message: "Failed to update test" });
  }
};

/* =========================
   DELETE Test
   ========================= */
const deleteTestparameter = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Test ID" });
  }

  try {
    const deletedTest = await Test.findByIdAndDelete(id);

    if (!deletedTest) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    res.status(200).json({ success: true, message: "Test deleted successfully" });
  } catch (error) {
    console.error("Delete Test Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete test" });
  }
};

export {
  createTestparameter,
  getAllTestsparameter,
  getTestparameterById,
  updateTestparameter,
  deleteTestparameter,
};
