import mongoose from "mongoose";
import Purchase from "../models/purchaseModel.js";

/* =======================
   GET ALL PURCHASES
======================= */
const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: purchases.length,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
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
      return res.status(400).json({ success: false, message: "Invalid purchase ID" });
    }

    const purchase = await Purchase.findById(id);

    if (!purchase) {
      return res.status(404).json({ success: false, message: "Purchase not found" });
    }

    res.status(200).json({ success: true, data: purchase });
  } catch (error) {
    res.status(500).json({
      success: false,
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

    // Validate main fields
    if (!supplier || !purchaseDate || !invoiceNumber || !products?.length) {
      return res.status(400).json({
        success: false,
        message: "Supplier, purchase date, invoice number, and products are required",
      });
    }

    // Validate products array
    for (const p of products) {
      if (!p.productId || !p.name || !p.quantity || !p.price || !p.manufacturer) {
        return res.status(400).json({
          success: false,
          message: "Each product must have productId, name, quantity, price, manufacturer",
        });
      }
    }

    const purchase = await Purchase.create({
      supplier,
      purchaseDate,
      invoiceNumber,
      totalAmount,
      paidAmount: paidAmount || 0,
      paymentStatus: paymentStatus || "Pending",
      purchaseStatus: purchaseStatus || "Draft",
      balance: balance || totalAmount,
      taxAmount: taxAmount || 0,
      products,
    });

    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: purchase,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create purchase",
      error: error.message,
    });
  }
};

/* =======================
   Uppdate Partial Payment
======================= */

const supplierPartialPayment = async (req, res) => {
  const session = await Purchase.startSession();
  session.startTransaction();

  try {
    const { supplier } = req.params;
    const { paidAmount, method = "Cash", note } = req.body;

    const amount = Number(paidAmount);

    if (!supplier || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid supplier and amount required",
      });
    }

    // 🔹 FIFO: oldest unpaid purchases first
    const purchases = await Purchase.find({
      supplier,
      paymentStatus: { $ne: "Paid" },
    })
      .sort({ purchaseDate: 1 })
      .session(session);

    if (!purchases.length) {
      return res.status(404).json({
        success: false,
        message: "No unpaid purchases found",
      });
    }

    let remaining = amount;
    const appliedPurchases = [];

    for (const purchase of purchases) {
      if (remaining <= 0) break;

      const due = purchase.totalAmount - purchase.paidAmount;
      if (due <= 0) continue;

      const applied = Math.min(due, remaining);

      // 🔹 UPDATE EACH PURCHASE
      purchase.paidAmount += applied;

      purchase.paymentHistory.push({
        paymentId: null, // temp, will update after payment is created
        appliedAmount: applied,
      });

      await purchase.save({ session });

      appliedPurchases.push({
        purchaseId: purchase._id,
        appliedAmount: applied,
      });

      remaining -= applied;
    }

    // 🔹 CREATE PAYMENT TRANSACTION
    const [payment] = await SupplierPayment.create(
      [
        {
          supplier,
          amount,
          method,
          note,
          appliedPurchases,
        },
      ],
      { session }
    );

    // 🔹 UPDATE paymentId inside each purchase history
    for (const purchase of purchases) {
      purchase.paymentHistory.forEach((ph) => {
        if (!ph.paymentId) {
          ph.paymentId = payment._id;
        }
      });
      await purchase.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Supplier payment applied correctly",
      data: payment,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: "Payment failed",
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
      return res.status(400).json({ success: false, message: "Invalid purchase ID" });
    }

    const purchase = await Purchase.findByIdAndDelete(id);
    if (!purchase) {
      return res.status(404).json({ success: false, message: "Purchase not found" });
    }

    res.status(200).json({
      success: true,
      message: "Purchase deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
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
    const purchases = await Purchase.find({}, { _id: 1, invoiceNumber: 1, supplier: 1 }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase list",
      error: error.message,
    });
  }
};

export {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  supplierPartialPayment,
  deletePurchase,
  getPurchaseList,
};
