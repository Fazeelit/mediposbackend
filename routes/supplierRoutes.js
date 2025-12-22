import express from "express";
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierNames
} from "../controllers/purchaseController.js";

const router = express.Router();

/* =======================
   PURCHASE ROUTES
======================= */

// Get all suppliers
router.get("/", getAllSuppliers);

// Get single supplier by ID
router.get("/:id", getSupplierById);

// Get supplier names only
router.get("/SupplierNames", getSupplierNames);

// Create new supplier
router.post("/createSupplier", createSupplier);

// Update supplier
router.put("/updateSupplier/:id", updateSupplier);

// Delete supplier
router.delete("/deleteSupplier/:id", deleteSupplier);

/* =======================
   EXPORT
======================= */

export default router;
