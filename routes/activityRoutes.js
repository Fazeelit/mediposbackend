import express from "express";
import {
  createActivity,
  getAllActivities,
  getActivityById,
  getActivitySummary,
  deleteActivity,
} from "../controllers/activityController.js";

const router = express.Router();

/* ================= ACTIVITY ROUTES ================= */

// Get all activities (with search & filter)
router.get("/", getAllActivities);
// Create a new activity
router.post("/createActivity", createActivity);

// Get activity summary (dashboard cards)
router.get("/summary", getActivitySummary);

// Get single activity by ID
router.get("/:id", getActivityById);

// Delete activity (optional, admin only)
router.delete("/:id", deleteActivity);

/* ================= EXPORT ================= */

export default router;
