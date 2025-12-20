import express from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  updateRolePermissions,
} from "../controllers/roleController.js";

const router = express.Router();

/* ================= ROLE ROUTES ================= */

// Create role
router.post("/createRole", createRole);

// Get all roles
router.get("/", getAllRoles);

// Get single role
router.get("/:id", getRoleById);

// Update role
router.put("/updateRole/:id", updateRole);

// Soft delete role
router.delete("/deleteRole/:id", deleteRole);

// Update role permissions
router.patch("/permissions/:id", updateRolePermissions);

/* ================= EXPORT ================= */

export default router;
