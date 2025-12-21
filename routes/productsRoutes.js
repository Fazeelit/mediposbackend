import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getProductName
} from "../controllers/productsController.js";

const router = express.Router();

/* =======================
   PRODUCT ROUTES
======================= */

// Stats (dashboard cards)
router.get("/stats", getProductStats);

// Get all products (search & filter)
router.get("/", getAllProducts);

router.get("/ProductName", getProductName);

// Get single product
router.get("/:id", getProductById);

// Create product
router.post("/createProduct", createProduct);

// Update product
router.put("/updateProduct/:id", updateProduct);

// Delete product
router.delete("/deleteProduct/:id", deleteProduct);

/* =======================
   EXPORT
======================= */

export default router;
