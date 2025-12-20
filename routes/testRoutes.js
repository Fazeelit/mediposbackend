import express from "express";
import {
  getAllTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
} from "../controllers/testController.js";

const router = express.Router();

/* =======================
   TEST ROUTES
======================= */

// Get all tests (supports search & filter via query params)
router.get("/", getAllTests);

// Get single test by ID
router.get("/:id", getTestById);

// Create new test
router.post("/", createTest);

// Update test
router.put("/:id", updateTest);

// Delete test
router.delete("/:id", deleteTest);

/* =======================
   EXPORT
======================= */

export default router;
