import mongoose from "mongoose";
import Purchase from "../models/purchaseModel.js";

/**
 * Get all purchases
 * GET /api/purchases
 */
const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("products.productId", "name code") // optional: fetch product details
      .sort({ purchaseDate: -1 });

    res.status(200).json({
      success: true,
      count: purchases.length,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch purchases",
      error: error.message,
    });
  }
};

/**
 * Get single purchase by ID
 * GET /api/purchases/:id
 */
const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid purchase ID" });
    }

    const purchase = await Purchase.findById(id).populate(
      "products.productId",
      "name code"
    );

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch purchase",
      error: error.message,
    });
  }
};

/**
 * Create new purchase
 * POST /api/purchases
 */
const createPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.create(req.body);

    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create purchase",
      error: error.message,
    });
  }
};

/**
 * Update purchase
 * PUT /api/purchases/:id
 */
const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid purchase ID" });
    }

    const purchase = await Purchase.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json({
      success: true,
      message: "Purchase updated successfully",
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update purchase",
      error: error.message,
    });
  }
};

/**
 * Delete purchase
 * DELETE /api/purchases/:id
 */
const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid purchase ID" });
    }

    const purchase = await Purchase.findByIdAndDelete(id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json({
      success: true,
      message: "Purchase deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete purchase",
      error: error.message,
    });
  }
};

/* =======================
   EXPORTS (AT END)
======================= */

export {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
};
