import express from "express";
import {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
} from "../controllers/salesController.js";

const router = express.Router();

/* =======================
   SALES ROUTES
======================= */

// Get all sales (supports search & filter via query params)
router.get("/", getAllSales);

// Get single sale by ID
router.get("/:id", getSaleById);

// Create new sale
router.post("/createSale", createSale);

// Update sale
router.put("/updateSale/:id", updateSale);

// Delete sale
router.delete("/deleteSale/:id", deleteSale);

/* =======================
   EXPORT
======================= */

export default router;
