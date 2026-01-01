import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Salary",
        "Rent",
        "Utilities",
        "Equipment",
        "Maintenance",
        "Marketing",
        "Supplies",
        "Transportation",
        "Professional Fees",
        "Insurance",
        "Taxes",
        "Other",
      ],
      default: "Other",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    vendor: {
      type: String,
      trim: true,
      default: "",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Bank Transfer", "Cheque"],
      default: "Cash",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
    referenceNumber: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Expense = mongoose.model("Expense", ExpenseSchema);

export default Expense;
