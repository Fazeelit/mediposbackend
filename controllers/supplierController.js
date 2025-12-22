import mongoose from "mongoose";
import Supplier from "../models/supplierModel.js";

/**
 * Get all suppliers
 * GET /api/suppliers
 */
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate("medicines.medicineId", "name code")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch suppliers",
      error: error.message,
    });
  }
};

/**
 * Get single supplier by ID
 * GET /api/suppliers/:id
 */
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Supplier ID" });
    }

    const supplier = await Supplier.findById(id).populate(
      "medicines.medicineId",
      "name code"
    );

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch supplier",
      error: error.message,
    });
  }
};

/**
 * Create new supplier
 * POST /api/suppliers
 */
const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);

    res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: supplier,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create supplier",
      error: error.message,
    });
  }
};

/**
 * Update supplier
 * PUT /api/suppliers/:id
 */
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Supplier ID" });
    }

    const supplier = await Supplier.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: supplier,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update supplier",
      error: error.message,
    });
  }
};

/**
 * Delete supplier
 * DELETE /api/suppliers/:id
 */
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Supplier ID" });
    }

    const supplier = await Supplier.findByIdAndDelete(id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete supplier",
      error: error.message,
    });
  }
};

/**
 * Get supplier names only
 * GET /api/suppliers/names
 */
const getSupplierNames = async (req, res) => {
  try {
    const suppliers = await Supplier.find(
      { status: "Active" },     // optional filter
      { _id: 1, name: 1 }        // only id & name
    ).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch supplier names",
      error: error.message,
    });
  }
};


/* =======================
   EXPORTS
======================= */

export {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierNames
};
