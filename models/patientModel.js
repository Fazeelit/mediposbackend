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
    address: {
      type: String,
      required: true,      
      trim: true,
      default: "Nil",
    },

    age: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },

    bloodgroup: {
      type: String,      
      default: "Nil",
    },
    
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
