import express from "express";
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

/* =======================
   EXPENSE ROUTES
======================= */

// Get all expenses (supports search & filter via query params)
router.get("/", getAllExpenses);

// Get single expense by ID
router.get("/:id", getExpenseById);

// Create new expense
router.post("/", createExpense);

// Update expense
router.put("/:id", updateExpense);

// Delete expense
router.delete("/:id", deleteExpense);

/* =======================
   EXPORT
======================= */

export default router;
