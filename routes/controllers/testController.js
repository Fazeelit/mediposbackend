import mongoose from "mongoose";
import Test from "../models/testReportModel.js";

/* =====================================================
   GET ALL TESTS
   GET /api/tests
===================================================== */
const getAllTests = async (req, res) => {
  try {
    const { search = "", filterStatus = "", filterPayment = "" } = req.query;

    const query = {};

    /* ================= SEARCH ================= */
    if (search) {
      query.$or = [
        { patient: { $regex: search, $options: "i" } },
        { doctor: { $regex: search, $options: "i" } },
        { "tests.testName": { $regex: search, $options: "i" } },
        { "tests.parameters.parameter": { $regex: search, $options: "i" } },
      ];
    }

    if (filterStatus) query.status = filterStatus;
    if (filterPayment) query.paymentStatus = filterPayment;

    const tests = await Test.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests,
    });
  } catch (error) {
    console.error("GET ALL TESTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tests",
      error: error.message,
    });
  }
};

/* =====================================================
   GET SINGLE TEST
   GET /api/tests/:id
===================================================== */
const getTestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Test ID",
      });
    }

    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      data: test,
    });
  } catch (error) {
    console.error("GET TEST ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch test",
      error: error.message,
    });
  }
};

/* =====================================================
   CREATE TEST
   POST /api/tests
===================================================== */
const createTest = async (req, res) => {
  try {
    const {
      patient,
      age,
      gender,
      doctor,
      date,
      mobile,
      status = "Pending",
      paymentStatus = "Pending",
      tests,
      discount = 0,
    } = req.body;

    if (!patient || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Patient and mobile are required",
      });
    }

    if (!Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one test is required",
      });
    }

    /* ================= FORMAT TEST DATA ================= */
    const formattedTests = tests.map((t) => ({
      testName: t.testName,
      parameters: (t.parameters || []).map((p) => ({
        parameterId: p.parameterId
          ? new mongoose.Types.ObjectId(p.parameterId)
          : undefined,
        parameter: p.parameter,
        min: p.min,
        max: p.max,
        unit: p.unit,
        cost: Number(p.cost || 0),
        duration: p.duration,
        result: p.result || "",
      })),
    }));

    /* ================= AUTO CALCULATE ================= */
    const calculatedFee = formattedTests.reduce(
      (sum, t) =>
        sum +
        t.parameters.reduce((pSum, p) => pSum + (p.cost || 0), 0),
      0
    );

    const totalfee = Math.max(calculatedFee - Number(discount || 0), 0);

    const newTest = await Test.create({
      patient,
      age,
      gender,
      doctor,
      date,
      mobile,
      status,
      paymentStatus,
      tests: formattedTests,
      fee: calculatedFee,
      discount,
      totalfee,
    });

    res.status(201).json({
      success: true,
      message: "Test created successfully",
      data: newTest,
    });
  } catch (error) {
    console.error("CREATE TEST ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create test",
      error: error.message,
    });
  }
};

/* =====================================================
   UPDATE TEST
   PUT /api/tests/:id
===================================================== */
const updateTest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Test ID",
      });
    }

    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    /* ================= BASIC UPDATE ================= */
    const fields = [
      "patient",
      "age",
      "gender",
      "doctor",
      "date",
      "mobile",
      "status",
      "paymentStatus",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        test[field] = req.body[field];
      }
    });

    /* ================= UPDATE TESTS ================= */
    if (Array.isArray(req.body.tests)) {
      test.tests = req.body.tests.map((t) => ({
        testName: t.testName,
        parameters: (t.parameters || []).map((p) => ({
          _id: p._id || new mongoose.Types.ObjectId(),
          parameterId: p.parameterId
            ? new mongoose.Types.ObjectId(p.parameterId)
            : undefined,
          parameter: p.parameter,
          min: p.min,
          max: p.max,
          unit: p.unit,
          cost: Number(p.cost || 0),
          duration: p.duration,
          result: p.result || "",
        })),
      }));
    }

    /* ================= RECALCULATE ================= */
    test.fee = test.tests.reduce(
      (sum, t) =>
        sum +
        t.parameters.reduce((pSum, p) => pSum + (p.cost || 0), 0),
      0
    );

    test.discount = Number(req.body.discount || test.discount);
    test.totalfee = Math.max(test.fee - test.discount, 0);

    const updated = await test.save();

    res.status(200).json({
      success: true,
      message: "Test updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("UPDATE TEST ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update test",
      error: error.message,
    });
  }
};

/* =====================================================
   DELETE TEST
   DELETE /api/tests/:id
===================================================== */
const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Test ID",
      });
    }

    const deleted = await Test.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Test deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TEST ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete test",
      error: error.message,
    });
  }
};

export {
  getAllTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
};
