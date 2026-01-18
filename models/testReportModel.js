import mongoose from "mongoose";

const ParameterSchema = new mongoose.Schema({
  parameterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parameter",
  },
  parameter: { type: String, required: true },
  min: { type: String },
  max: { type: String },
  unit: { type: String },
  cost: { type: Number, default: 0 },
  duration: { type: String },
  result: { type: String, default: "" },
});

const SingleTestSchema = new mongoose.Schema({
  testName: { type: String, required: true }, // CBC, TFT, LFT etc
  parameters: [ParameterSchema],
});

const TestSchema = new mongoose.Schema(
  {
    /* ================= PATIENT INFO ================= */
    patient: { type: String, required: true },
    age: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    doctor: { type: String },
    date: { type: Date, default: Date.now },
    mobile: { type: String, required: true },

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    /* ================= MULTIPLE TESTS ================= */
    tests: [SingleTestSchema],

    /* ================= BILLING ================= */
    fee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalfee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/* ================= MODEL ================= */
const Test = mongoose.model("Test", TestSchema);

export default Test;
