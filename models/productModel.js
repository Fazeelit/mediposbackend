import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },    
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ["Strip", "Piece", "Box", "Bottle"],
    },
    date:{
      type: Date,      
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    description: {
      type: String,     
      trim: true,
    },
    lowStock: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Auto-calculate lowStock before save
 * (matches frontend logic: stock <= 10)
 */
productSchema.pre("save", function (next) {
  this.lowStock = this.stock <= 10;
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
