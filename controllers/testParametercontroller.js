import TestParameter from "../models/testparameterModel.js";

/* =========================
   CREATE Test Parameter
   ========================= */
const createTestParameter = async (req, res) => {
  try {
    const { testname, refvalue, unit, cost } = req.body;

    // Required field validation
    if (!testname || refvalue === undefined || cost === undefined) {
      return res.status(400).json({
        success: false,
        message: "Test name, reference value, and cost are required",
      });
    }

    const parameter = await TestParameter.create({
      testname,
      refvalue,
      unit,
      cost,      
    });

    res.status(201).json({
      success: true,
      message: "Test parameter created successfully",
      data: parameter,
    });
  } catch (error) {
    console.error("Create Test Parameter Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create test parameter",
    });
  }
};

/* =========================
   GET All Test Parameters
   ========================= */
const getAllTestParameters = async (req, res) => {
  try {
    const parameters = await TestParameter.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: parameters,
    });
  } catch (error) {
    console.error("Get Test Parameters Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch test parameters",
    });
  }
};

/* =========================
   GET Single Test Parameter
   ========================= */
const getTestParameterById = async (req, res) => {
  try {
    const { id } = req.params;

    const parameter = await TestParameter.findById(id);

    if (!parameter) {
      return res.status(404).json({
        success: false,
        message: "Test parameter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: parameter,
    });
  } catch (error) {
    console.error("Get Test Parameter Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch test parameter",
    });
  }
};

/* =========================
   UPDATE Test Parameter
   ========================= */
const updateTestParameter = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedParameter = await TestParameter.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedParameter) {
      return res.status(404).json({
        success: false,
        message: "Test parameter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Test parameter updated successfully",
      data: updatedParameter,
    });
  } catch (error) {
    console.error("Update Test Parameter Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update test parameter",
    });
  }
};

/* =========================
   DELETE Test Parameter
   ========================= */
const deleteTestParameter = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedParameter = await TestParameter.findByIdAndDelete(id);

    if (!deletedParameter) {
      return res.status(404).json({
        success: false,
        message: "Test parameter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Test parameter deleted successfully",
    });
  } catch (error) {
    console.error("Delete Test Parameter Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete test parameter",
    });
  }
};

/* =========================
   EXPORTS (AT END)
   ========================= */
export {
  createTestParameter,
  getAllTestParameters,
  getTestParameterById,
  updateTestParameter,
  deleteTestParameter,
};
