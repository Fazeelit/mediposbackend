import express from "express";
import {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  supplierPartialPayment,
  deletePurchase,
  getPurchaseList,
} from "../controllers/purchaseController.js";

const router = express.Router();

/* =======================
   PURCHASE ROUTES
======================= */

// Get purchase list (minimal)
router.get("/list", getPurchaseList);

// Get all purchases
router.get("/", getAllPurchases);

// Get single purchase by ID
router.get("/:id", getPurchaseById);

// Create new purchase
router.post("/createPurchase", createPurchase);

router.put("/supplierPayment/:supplier", supplierPartialPayment);

// Delete purchase
router.delete("/deletePurchase/:id", deletePurchase);

export default router;
