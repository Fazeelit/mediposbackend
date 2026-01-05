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
      
    },
    invoiceNumber: {
      type: Number,      
      unique: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Partial", "Paid"],
      required: true,
      default: "Pending",
    },
    purchaseStatus: {
      type: String,
      enum: ["Draft", "Received", "Completed"],
      default: "Draft",
    },
    balance: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",          
        },
        name: {
          type: String,          
        },        
        quantity: {
          type: Number,          
        },
        price: {
          type: Number,          
        },
        manufacturer: {
          type: String,          
        },
      },
    ],
  },
  { timestamps: true }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
