import mongoose from "mongoose";
import Role from "../models/roleModel.js";

/**
 * Create new role
 */
const createRole = async (req, res) => {
  try {
    const { name, description, permissions, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const existingRole = await Role.findOne({ name, isDeleted: false });
    if (existingRole) {
      return res.status(409).json({ message: "Role already exists" });
    }

    const role = await Role.create({
      name,
      description,
      permissions,
      status,
    });

    res.status(201).json({
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    console.error("Create Role Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all roles
 */
const getAllRoles = async (req, res) => {
  try {
    const { status } = req.query;

    let query = { isDeleted: false };

    if (status) {
      query.status = status;
    }

    const roles = await Role.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      total: roles.length,
      data: roles,
    });
  } catch (error) {
    console.error("Get Roles Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get single role
 */
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    const role = await Role.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json(role);
  } catch (error) {
    console.error("Get Role Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update role
 */
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    const updatedRole = await Role.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({
      message: "Role updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    console.error("Update Role Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Soft delete role
 */
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    const role = await Role.findById(id);

    if (!role || role.isDeleted) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (role.isSystemRole) {
      return res
        .status(403)
        .json({ message: "System roles cannot be deleted" });
    }

    role.isDeleted = true;
    await role.save();

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Delete Role Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update role permissions
 */
const updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    const role = await Role.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { permissions },
      { new: true }
    );

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({
      message: "Permissions updated successfully",
      data: role,
    });
  } catch (error) {
    console.error("Update Permissions Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= EXPORTS ================= */

export {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  updateRolePermissions,
};
