
import Supplier from "../models/supplierModel.js";
import mongoose from "mongoose";

// Create a new supplier
const createSupplier = async (req, res) => {
  try {
    const {
      supplierId,
      name,
      contactPerson,
      phone,
      email,
      address,
      companyName,
      productsSupplied,
      paymentTerms,
      status,
      notes,
    } = req.body;

    // Check for duplicate supplierId
    const existingSupplier = await Supplier.findOne({ supplierId });
    if (existingSupplier) {
      return res.status(400).json({ message: "Supplier ID already exists" });
    }

    const supplier = new Supplier({
      supplierId,
      name,
      contactPerson,
      phone,
      email,
      address,
      companyName,
      productsSupplied,
      paymentTerms,      
      status,
      notes,
    });

    const savedSupplier = await supplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all suppliers
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.status(200).json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single supplier by ID
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Update a supplier
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    // 🔒 Prevent updating supplierId
    const { supplierId, ...updateData } = req.body;

    const supplier = await Supplier.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(supplier);

  } catch (error) {
    console.error("❌ Update Supplier Error:", error.message);
    console.error(error); // FULL stack trace
    res.status(500).json({
      message: "Server Error",
      error: error.message, // TEMP: remove in production
    });
  }
};


// Delete a supplier
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByIdAndDelete(id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Delete Supplier Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export default deleteSupplier;


// Export all controller functions at the end
export {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
