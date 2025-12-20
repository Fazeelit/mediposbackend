import mongoose from "mongoose";

const UserManagementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    employeeId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["Admin", "Doctor", "Pharmacist", "Staff", "Custom"],
      default: "Staff",
    },

    customRole: {
      type: String,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    lastLogin: {
      type: Date,
    },

    ipRestrictions: {
      type: String, // e.g. "192.168.1.1, 192.168.1.2"
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);


 const UserManagement= mongoose.model("UserManagement", UserManagementSchema);
export default UserManagement;