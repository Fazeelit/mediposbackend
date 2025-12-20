import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
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
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["registered", "active", "inactive"],
      default: "registered",
    },

    profilePicture: {
      type: String,
      default: "default.jpg",
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: Number,
      default: null,
    },

    // ---------------- LOGIN ACTIVITY ----------------
    lastLogin: {
      type: Date,
      default: null, // Updated on login
    },

    loginIPs: {
      type: [String],
      default: [], // Keep last few IPs
    },

    loginDevices: {
      type: [String],
      default: [], // Keep last few User-Agent strings
    },
  },
  {
    versionKey: false, // Removes __v
  }
);

const Users = mongoose.model("Users", userSchema);
export default Users;
