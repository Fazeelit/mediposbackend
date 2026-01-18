import mongoose from "mongoose";
import Product from "../models/productModel.js";

/**
 * Get all products (search & filter) from URL params
 * Route: GET /api/products/:filter?/:search?
 */
const getAllProducts = async (req, res) => {
  try {
    const { search = "", filter = "All" } = req.params;

    const query = {};

    // 🔍 Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // 📌 Filters
    if (filter === "Active") {
      query.status = "Active";
    }

    if (filter === "Low Stock") {
      query.$or = query.$or
        ? [...query.$or, { stock: { $lte: 10 } }]
        : [{ stock: { $lte: 10 } }];
    }

    if (filter === "Out of Stock") {
      query.stock = 0;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

/**
 * Get product by ID
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

/**
 * Create product
 */
const createProduct = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is empty",
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

/**
 * Update product
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Prevent updating unique code accidentally
    delete req.body.code;

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

/**
 * Delete product
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

/**
 * Product stats (dashboard)
 */
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: "Active" });
    const lowStock = await Product.countDocuments({ stock: { $lte: 10 } });
    const outOfStock = await Product.countDocuments({ stock: 0 });

    res.status(200).json({
      success: true,
      totalProducts,
      activeProducts,
      lowStock,
      outOfStock,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error.message,
    });
  }
};

/**
 * Get product names only (dropdowns)
 */
const getProductName = async (req, res) => {
  try {
    // Fetch name, manufacturer, price, stock, etc.
    const products = await Product.find(
      {},
      "name manufacturer price stock"
    ).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};


const updateStockAfterSale = async () => {
  try {
    // Fetch all products
    const res = await apiRequest("/products", { method: "GET" });
    const allProducts = res?.data || [];

    // Group products by name
    const productMap = new Map();
    allProducts.forEach((p) => {
      const key = p.name.trim().toLowerCase();
      if (productMap.has(key)) {
        const existing = productMap.get(key);
        productMap.set(key, {
          ...existing,
          totalStock: existing.totalStock + Number(p.stock || 0),
          ids: [...existing.ids, p._id],
        });
      } else {
        productMap.set(key, {
          ...p,
          totalStock: Number(p.stock || 0),
          ids: [p._id],
        });
      }
    });

    // Deduct sold items from total stock
    for (const soldItem of items) {
      const key = soldItem.name.trim().toLowerCase();
      if (!productMap.has(key)) continue;

      const productData = productMap.get(key);
      let remainingQty = soldItem.qty;

      for (const id of productData.ids) {
        const product = allProducts.find((p) => p._id === id);
        if (!product) continue;

        const currentStock = Number(product.stock || 0);
        const newStock = Math.max(currentStock - remainingQty, 0);

        // PATCH request to backend
        await apiRequest(`/products/updateStock/${id}`, {
          method: "PATCH",
          data: { stock: newStock },
        });

        remainingQty -= currentStock;
        if (remainingQty <= 0) break;
      }
    }
  } catch (err) {
    console.error("Failed to update stock:", err);
  }
};


/* =======================
   EXPORTS
======================= */
export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  getProductName,
  updateStockAfterSale
};
