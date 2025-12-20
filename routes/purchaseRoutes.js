import express from "express";
import {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
} from "../controllers/purchaseController.js";

const router = express.Router();

/* =======================
   PURCHASE ROUTES
======================= */

// Get all purchases
router.get("/", getAllPurchases);

// Get single purchase by ID
router.get("/:id", getPurchaseById);

// Create new purchase
router.post("/createPurchase", createPurchase);

// Update purchase
router.put("/updatePurchase/:id", updatePurchase);

// Delete purchase
router.delete("/deletePurchase/:id", deletePurchase);

/* =======================
   EXPORT
======================= */

export default router;
