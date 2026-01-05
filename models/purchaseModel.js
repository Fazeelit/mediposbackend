import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    supplier: {
      type: String,
      required: true,
      trim: true,
    },

    purchaseDate: {
      type: Date,
      required: true,
    },

    invoiceNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    balance: {
      type: Number,
      min: 0,
    },

    taxAmount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Partial", "Paid"],
      default: "Pending",
    },

    purchaseStatus: {
      type: String,
      enum: ["Draft", "Received", "Completed"],
      default: "Draft",
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        manufacturer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

/* 🔹 Auto-calculate balance & payment status */
purchaseSchema.pre("save", function (next) {
  this.balance = this.totalAmount - this.paidAmount;

  if (this.paidAmount === 0) this.paymentStatus = "Pending";
  else if (this.paidAmount < this.totalAmount) this.paymentStatus = "Partial";
  else this.paymentStatus = "Paid";

  next();
});

export default mongoose.model("Purchase", purchaseSchema);
