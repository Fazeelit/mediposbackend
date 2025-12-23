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

    status: {
      type: String,
      enum: ["Pending", "Partial", "Paid"],
      required: true,
    },

    // ✅ KEEP balance field but do NOT calculate it here
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
