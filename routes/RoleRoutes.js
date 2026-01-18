// routes/role.routes.js
import express from "express";
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole
} from "../controllers/roleController.js";

const router = express.Router();

router.get("/", getRoles);
router.get("/:id", getRoleById);
router.post("/createRole", createRole);
router.put("/updateRole/:id", updateRole);
router.delete("/deleteRole/:id", deleteRole);

export default router;
