import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
  {
    supplierId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    contactPerson: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
    },

    productsSupplied: [
      {
        type: String, // or ObjectId if linked to Product model
      },
    ],

    paymentTerms: {
      type: String, // e.g. "Cash", "15 Days", "30 Days"
      default: "Cash",
    },

    openingBalance: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

 
 const Supplier= mongoose.model("Supplier", SupplierSchema);

export default Supplier;