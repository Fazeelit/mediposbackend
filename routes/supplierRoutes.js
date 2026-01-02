import express from "express";
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

const router = express.Router();

router.get("/", getSuppliers);            // Get all suppliers
router.post("/createSupplier", createSupplier);          // Create supplier
router.get("/:id", getSupplierById);      // Get supplier by ID
router.put("/updateSupplier/:id", updateSupplier);       // Update supplier
router.delete("/deleteSupplier/:id", deleteSupplier);    // Delete supplier

// Export router at the end
export default router;
