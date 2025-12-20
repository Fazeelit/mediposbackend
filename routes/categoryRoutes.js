import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

/* ================= CATEGORY ROUTES ================= */

// Create a new category
router.post("/createCategory", createCategory);

// Get all categories (with optional filters)
router.get("/", getAllCategories);

// Get single category by ID
router.get("/:id", getCategoryById);

// Update category
router.put("/updateCategory/:id", updateCategory);

// Soft delete category
router.delete("/deleteCategory/:id", deleteCategory);

/* ================= EXPORT ================= */

export default router;
