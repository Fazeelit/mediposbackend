import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    supplier: {
      type: String,
      required: true,
      trim: true,
    },

    invoiceNumber: {
      type: Number,
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        manufacturer: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ✅ PAYMENT STATUS (matches frontend Payment Status)
    paymentStatus: {
      type: String,
      enum: ["Pending", "Partial", "Paid"],
      required: true,
    },

    // ✅ PURCHASE LIFECYCLE STATUS
    purchaseStatus: {
      type: String,
      enum: ["Draft", "Received", "Completed"],
      default: "Draft",
    },

    balance: {
      type: Number,
      required: true,
      min: 0,
    },

    purchaseDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
