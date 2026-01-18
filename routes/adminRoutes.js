// routes/adminRoutes.js
import express from "express";
import verifyToken, { verifyAdmin } from "../middleware/auth.js";
import {
  getAllAdmin,
  getAdminById,
  SignUpAdmin,
  LogInAdmin,
  updateAdmin,
  deleteAdminById,
  resetPassworddAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

// ------------------ Public Routes ------------------
router.post("/signupAdmin", SignUpAdmin);
router.get("/loginAdmin/:id", LogInAdmin);
router.put("/resetPasswordAdmin", verifyToken, resetPassworddAdmin); 
// ✅ Protected: reset password requires authentication

// ------------------ Admin-Protected Routes ------------------

router.get("/", getAllAdmin);
router.get("/:id", getAdminById); // simplified route param
router.put("/updateAdmin/:id", updateAdmin);
router.delete("/deleteAdmin/:id", deleteAdminById);

export default router;
