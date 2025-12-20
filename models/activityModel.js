import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: String, // e.g. "System Admin"
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    action: {
      type: String, // Login, Create, Update, Delete
      required: true,
      trim: true,
    },

    module: {
      type: String, // Authentication, Sales, Appointments, etc.
      required: true,
      trim: true,
    },

    details: {
      type: String,
      trim: true,
    },

    ip: {
      type: String,
      trim: true,
    },

    metadata: {
      type: Object, // optional extra info (invoiceId, appointmentId, etc.)
      default: {},
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserManagement",
    },

    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt = activity time
  }
);

/* ================= EXPORT ================= */

const Activity =
  mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

export default Activity;
