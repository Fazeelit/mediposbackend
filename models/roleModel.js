import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema(
  {
    key: {
      type: String, // e.g. "users.create", "roles.update"
      required: true,
    },
    allowed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    permissions: {
      type: [PermissionSchema],
      default: [],
    },

    isSystemRole: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* ================= EXPORT ================= */

const Role = mongoose.model("Role", RoleSchema);

export default Role;
