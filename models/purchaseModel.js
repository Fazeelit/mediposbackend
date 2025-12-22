import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    supplier: {
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
        quantity: { type: Number, required: true, min: 0 },
        price: { type: Number, required: true, min: 0 },
        manufacturer: { type: String, required: true, trim: true },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Partial"],
      default: "Pending",
    },

    balance: {
      type: Number,
      min: 0,
      default: 0,
    },

    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate totalAmount and balance
purchaseSchema.pre("save", function (next) {
  // Calculate totalAmount from all products
  this.totalAmount = this.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Calculate balance
  this.balance = this.totalAmount - this.paidAmount;

  // Update status based on payment
  if (this.paidAmount === 0) {
    this.status = "Pending";
  } else if (this.paidAmount < this.totalAmount) {
    this.status = "Partial";
  } else {
    this.status = "Paid";
    this.balance = 0;
  }

  next();
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;