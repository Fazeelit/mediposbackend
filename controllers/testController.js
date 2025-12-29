import mongoose from "mongoose";
import Test from "../models/testReportModel.js";

/**
 * Get all tests
 * GET /api/tests
 */
const getAllTests = async (req, res) => {
  try {
    const { search = "", filterStatus = "", filterPayment = "" } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { patient: { $regex: search, $options: "i" } },
        { doctor: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (filterStatus) {
      query.status = filterStatus;
    }

    if (filterPayment) {
      query.paymentStatus = filterPayment;
    }

    const tests = await Test.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tests",
      error: error.message,
    });
  }
};

/**
 * Get single test by ID
 * GET /api/tests/:id
 */
const getTestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid test ID" });
    }

    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch test",
      error: error.message,
    });
  }
};

/**
 * Create new test
 * POST /api/tests
 */
const createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);

    res.status(201).json({
      success: true,
      message: "Test created successfully",
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create test",
      error: error.message,
    });
  }
};

/**
 * Update test
 * PUT /api/tests/:id
 */
const updateTest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid test ID" });
    }

    const test = await Test.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({
      success: true,
      message: "Test updated successfully",
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update test",
      error: error.message,
    });
  }
};

/**
 * Delete test
 * DELETE /api/tests/:id
 */
const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid test ID" });
    }

    const test = await Test.findByIdAndDelete(id);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({
      success: true,
      message: "Test deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete test",
      error: error.message,
    });
  }
};

/* =======================
   EXPORTS (AT END)
======================= */

export {
  getAllTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
};
