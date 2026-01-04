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

    cost: {
      type: Number,
      required: true,
      min: 0,
    },

    price: {
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
      enum: [
        "Piece",
        "Strip",
        "Box",
        "Bottle",
        "Tablet",
        "Capsule",
        "Sachet",
        "Tube",
        "Vial",
        "Ampoule",
        "Pack",
        "Ointment",
        "Syrup",
        "Inhaler",
        "Drop",
      ],
      default: "Piece",
    },

    bno: {
      type: String,
      required: true,
      trim: true,
    },

    mfg: {
      type: Date, // ✅ FIXED
      required: true,
    },

    exp: {
      type: Date, // ✅ FIXED
      required: true,
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
 * Auto-calculate lowStock on CREATE
 */
productSchema.pre("save", function (next) {
  this.lowStock = this.stock <= 10;
  next();
});

/**
 * Auto-calculate lowStock on UPDATE
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
