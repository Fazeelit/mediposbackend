import express from "express";
import {
  createTestParameter,
  getAllTestParameters,
  getTestParameterById,
  updateTestParameter,
  deleteTestParameter,
} from "../controllers/testParametercontroller.js";

const router = express.Router();

/* =========================
   TEST PARAMETER ROUTES
   ========================= */

// Create
router.post("/createTestParameter", createTestParameter);

// Read
router.get("/", getAllTestParameters);
router.get("/:id", getTestParameterById);

// Update
router.put("/updateTestParameter/:id", updateTestParameter);

// Delete
router.delete("/deleteTestParameter/:id", deleteTestParameter);

export default router;
