import express from "express";
import {
 createTestparameter,
  getAllTestsparameter,
  getTestparameterById,
  updateTestparameter,
  deleteTestparameter,
} from "../controllers/testParametercontroller.js";

const router = express.Router();

/* =========================
   Test Routes
   ========================= */

// Create a new test
router.post("/createTestparameter", createTestparameter);

// Get all tests
router.get("/", getAllTestsparameter);

// Get single test by ID
router.get("/:id", getTestparameterById);

// Update a test by ID
router.put("/updateTestparameter/:id", updateTestparameter);

// Delete a test by ID
router.delete("/deleteTestparameter/:id", deleteTestparameter);

export default router;
