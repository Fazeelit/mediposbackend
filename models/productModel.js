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
      enum: ["Strip", "Piece", "Box", "Bottle"],
      default: "Piece",
    },
    date: {
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
 * Auto-calculate lowStock on update queries
 * (for findOneAndUpdate / findByIdAndUpdate)
 */
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.stock !== undefined) {
    update.lowStock = update.stock <= 10;
    this.setUpdate(update);
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
