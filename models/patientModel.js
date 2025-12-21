import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true, // e.g. PAT-001
      uppercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "Nil",
    },

    address: {
      type: String,      
      trim: true,
      default: "Nil",
    },

    age: {
      type: Number,
      min: 0,
      default: 0,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },

    temperature: {
      type: Number,
      default: 0,
    },

    bloodpressure: {
      type: String,
      trim: true,
      default: "Nil",
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
