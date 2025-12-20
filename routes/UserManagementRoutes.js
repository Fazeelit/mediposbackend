import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateLastLogin,
} from "../controllers/UserManagementController.js";

const router = express.Router();

/* ================= USER MANAGEMENT ROUTES ================= */

// Create user
router.post("/", createUser);

// Get all users
router.get("/", getAllUsers);

// Get single user
router.get("/:id", getUserById);

// Update user
router.put("/:id", updateUser);

// Soft delete user
router.delete("/:id", deleteUser);

// Update last login
router.patch("/:id/last-login", updateLastLogin);

/* ================= EXPORT ================= */

export default router;
