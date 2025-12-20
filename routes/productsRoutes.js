import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} from "../controllers/productsController.js";

const router = express.Router();

/* =======================
   PRODUCT ROUTES
======================= */

// Stats (dashboard cards)
router.get("/stats", getProductStats);

// Get all products (search & filter)
router.get("/", getAllProducts);

// Get single product
router.get("/:id", getProductById);

// Create product
router.post("/", createProduct);

// Update product
router.put("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

/* =======================
   EXPORT
======================= */

export default router;
