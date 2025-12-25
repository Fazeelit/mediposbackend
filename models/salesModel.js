import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      min: 0,
      default: 0, // will be overwritten by pre-save
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Partial"],
      default: "Pending",
    },

    saleDate: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔹 Pre-save middleware to assign totalAmount to paidAmount
saleSchema.pre("save", function (next) {
  if (this.isNew && (!this.paidAmount || this.paidAmount === 0)) {
    this.paidAmount = this.totalAmount;
    if (this.totalAmount > 0) {
      this.paymentStatus = "Paid"; // optional: mark as Paid automatically
    }
  }
  next();
});

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
