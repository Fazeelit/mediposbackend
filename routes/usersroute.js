import express from "express";
import {
  getAllUsers,
  LogIn,
  SignUp, 
  deleteUser,
  resetPassword,
  updateUser,
  getUserById
} from "../controllers/usersController.js"; // ✅ folder name should be plural (controllers)

import validateId from "../middleware/validateId.js";

import verifyToken, { verifyAdmin } from "../middleware/auth.js";
// ✅ Initialize router
const router = express.Router();

// ✅ Define user routes
router.get("/", getAllUsers);
router.post("/login", LogIn);
router.post("/signup", SignUp);
router.put("/resetPassword",resetPassword);
router.delete("/deleteUser/:id", verifyToken, verifyAdmin, validateId, deleteUser);
router.put("/updateUser/:id", verifyToken, validateId, updateUser);
router.get("/getUserById/:id", verifyToken, validateId, getUserById);

export default router;
