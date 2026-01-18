import mongoose from "mongoose";
import Sale from "../models/salesModel.js";

/**
 * Get all sales
 * GET /api/sales
 */
const getAllSales = async (req, res) => {
  try {
    const { search = "", filter = "" } = req.query;

    const query = {};

    if (search) {
      query.customerName = { $regex: search, $options: "i" };
    }

    if (filter) {
      // e.g., filter by paymentStatus
      query.paymentStatus = filter;
    }

    const sales = await Sale.find(query)
      .populate("products.productId", "name code")
      .sort({ saleDate: -1 });

    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sales",
      error: error.message,
    });
  }
};

/**
 * Get single sale by ID
 * GET /api/sales/:id
 */
const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid sale ID" });
    }

    const sale = await Sale.findById(id).populate(
      "products.productId",
      "name code"
    );

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sale",
      error: error.message,
    });
  }
};

/**
 * Create new sale
 * POST /api/sales
 */
const createSale = async (req, res) => {
  try {
    const sale = await Sale.create(req.body);

    res.status(201).json({
      success: true,
      message: "Sale created successfully",
      data: sale,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create sale",
      error: error.message,
    });
  }
};

/**
 * Update sale
 * PUT /api/sales/:id
 */
const updateSale = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid sale ID" });
    }

    const sale = await Sale.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json({
      success: true,
      message: "Sale updated successfully",
      data: sale,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update sale",
      error: error.message,
    });
  }
};

/**
 * Delete sale
 * DELETE /api/sales/:id
 */
const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid sale ID" });
    }

    const sale = await Sale.findByIdAndDelete(id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json({
      success: true,
      message: "Sale deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete sale",
      error: error.message,
    });
  }
};

/* =======================
   EXPORTS (AT END)
======================= */

export {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
};
