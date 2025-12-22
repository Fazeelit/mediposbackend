import mongoose from "mongoose";
import Purchase from "../models/purchaseModel.js";

/* =======================
   GET ALL PURCHASES
   GET /api/purchases
======================= */
const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("products.productId", "name code manufacturer")
      .sort({ createdAt: -1 });

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

/* =======================
   GET PURCHASE BY ID
   GET /api/purchases/:id
======================= */
const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid purchase ID" });
    }

    const purchase = await Purchase.findById(id).populate(
      "products.productId",
      "name code manufacturer"
    );

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch purchase",
      error: error.message,
    });
  }
};

/* =======================
   CREATE PURCHASE
   POST /api/purchases
======================= */
const createPurchase = async (req, res) => {
  try {
    const purchase = new Purchase(req.body);

    // Calculate totals
    purchase.totalAmount = purchase.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    purchase.balance = purchase.totalAmount - purchase.paidAmount;

    if (purchase.paidAmount === 0) {
      purchase.status = "Pending";
    } else if (purchase.paidAmount < purchase.totalAmount) {
      purchase.status = "Partial";
    } else {
      purchase.status = "Paid";
      purchase.balance = 0;
    }

    await purchase.save();

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

/* =======================
   UPDATE PURCHASE
   PUT /api/purchases/:id
======================= */
const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid purchase ID" });
    }

    const purchase = await Purchase.findById(id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    Object.assign(purchase, req.body);

    // Recalculate totals
    purchase.totalAmount = purchase.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    purchase.balance = purchase.totalAmount - purchase.paidAmount;

    if (purchase.paidAmount === 0) {
      purchase.status = "Pending";
    } else if (purchase.paidAmount < purchase.totalAmount) {
      purchase.status = "Partial";
    } else {
      purchase.status = "Paid";
      purchase.balance = 0;
    }

    await purchase.save();

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

/* =======================
   DELETE PURCHASE
   DELETE /api/purchases/:id
======================= */
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
   GET PURCHASE LIST (MINIMAL)
   GET /api/purchases/list
======================= */
const getPurchaseList = async (req, res) => {
  try {
    const purchases = await Purchase.find(
      {},
      { _id: 1, invoiceNumber: 1, supplier: 1 }
    ).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch purchase list",
      error: error.message,
    });
  }
};

/* =======================
   EXPORTS
======================= */
export {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
  getPurchaseList,
};
