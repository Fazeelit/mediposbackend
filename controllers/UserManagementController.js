import UserManagement from "../models/UserManagement.js";
import mongoose from "mongoose";

/**
 * Create new user
 */
const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      employeeId,
      role,
      customRole,
      department,
      status,
      ipRestrictions,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existingUser = await UserManagement.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await UserManagement.create({
      name,
      email,
      phone,
      employeeId,
      role,
      customRole,
      department,
      status,
      ipRestrictions,
    });

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all users
 */
const getAllUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;

    let query = { isDeleted: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "All") {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    const users = await UserManagement.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      total: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get single user
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await UserManagement.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update user
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const updatedUser = await UserManagement.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Soft delete user
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await UserManagement.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update last login
 */
const updateLastLogin = async (req, res) => {
  try {
    const { id } = req.params;

    await UserManagement.findByIdAndUpdate(id, {
      lastLogin: new Date(),
    });

    res.status(200).json({ message: "Last login updated" });
  } catch (error) {
    console.error("Last Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= EXPORTS ================= */

export {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateLastLogin,
};
