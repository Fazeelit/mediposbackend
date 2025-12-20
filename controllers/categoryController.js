import mongoose from "mongoose";
import Category from "../models/Category.js";

/**
 * Create a new category
 */
const createCategory = async (req, res) => {
  try {
    const { name, type, description, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ name, isDeleted: false });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, type, description, status });

    res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all categories
 */
const getAllCategories = async (req, res) => {
  try {
    const { status, type } = req.query;

    let query = { isDeleted: false };

    if (status) query.status = status;
    if (type) query.type = type;

    const categories = await Category.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      total: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get single category by ID
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findOne({ _id: id, isDeleted: false });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Get Category Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update category
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Soft delete category
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(id);

    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.isDeleted = true;
    await category.save();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= EXPORTS ================= */

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
