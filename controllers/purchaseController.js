import mongoose from "mongoose";
import Purchase from "../models/purchaseModel.js";

/* =======================
   GET ALL PURCHASES
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
======================= */
const createPurchase = async (req, res) => {
  try {
    const {
      supplier,
      purchaseDate,
      invoiceNumber,
      totalAmount,
      paidAmount,
      paymentStatus,
      purchaseStatus,
      balance,
      taxAmount,
      products,
    } = req.body;

    // Validation
    if (!supplier || !purchaseDate || !invoiceNumber || !paidAmount || !purchaseDate) {
      return res.status(400).json({
        success: false,
        message: "Supplier, purchase date, invoice number, and paid amount are required",
      });
    }

    // Calculate balance if not provided
    const calculatedBalance = totalAmount - (paidAmount || 0);

    // Determine payment status
    let calculatedPaymentStatus = "Pending";
    if (paidAmount && paidAmount > 0) {
      calculatedPaymentStatus = paidAmount < totalAmount ? "Partial" : "Paid";
    }

    // Create purchase
    const purchase = await Purchase.create({
      supplier,
      purchaseDate,
      invoiceNumber,
      totalAmount,
      paidAmount: paidAmount || 0,
      paymentStatus: paymentStatus || calculatedPaymentStatus,
      purchaseStatus: purchaseStatus || "Draft",
      balance: balance || calculatedBalance,
      taxAmount: taxAmount || 0,
      products,
    });

    // If paidAmount > 0, create a transaction record
    if (paidAmount && paidAmount > 0) {
      await Transaction.create({
        supplier,
        amount: paidAmount,
        transactionDate: new Date(), // current date
        purchaseId: purchase._id,
        type: "Purchase Payment", // optional field for type
      });
    }

    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: purchase,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Failed to create purchase",
      error: error.message,
    });
  }
};
/* =======================
   UPDATE PURCHASE
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
    await purchase.save(); // triggers schema middleware

    res.status(200).json({
      success: true,
      message: "Purchase updated successfully",
      data: purchase,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update purchase",
      error: error.message,
    });
  }
};

/* =======================
   DELETE PURCHASE
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
   PURCHASE LIST (MINIMAL)
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

export {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
  getPurchaseList,
};
