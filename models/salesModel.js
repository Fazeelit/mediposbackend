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
        cost: { type: Number, required: true, min: 0 },
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
      default: 0,
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

    profit: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * ✅ Assign paidAmount & profit on CREATE
 */
saleSchema.pre("save", function (next) {
  if (this.isNew && (!this.paidAmount || this.paidAmount === 0)) {
    this.paidAmount = this.totalAmount;
    this.paymentStatus = "Paid";
  }

  if (this.paymentStatus === "Paid") {
    this.profit = this.paidAmount;
  }

  next();
});

/**
 * ✅ Assign profit when paymentStatus becomes "Paid" (UPDATE)
 * Works for findByIdAndUpdate / findOneAndUpdate
 */
saleSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  const newStatus =
    update?.paymentStatus || update?.$set?.paymentStatus;

  const paidAmount =
    update?.paidAmount || update?.$set?.paidAmount;

  if (newStatus === "Paid") {
    update.$set = {
      ...(update.$set || {}),
      profit: paidAmount,
    };
  }

  next();
});

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
