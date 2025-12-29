import mongoose from "mongoose";

const ParameterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  min: { type: String },
  max: { type: String },
  unit: { type: String },
  cost: { type: Number, default: 0 },
  duration: { type: String },
  result: { type: String },
});

const LabTestSchema = new mongoose.Schema({
  patient: { type: String, required: true },
  age: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  doctor: { type: String },
  name: { type: String, required: true }, // Test name
  date: { type: Date, default: Date.now },
  mobile:{ type: Number, required: true },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending", },
  paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending", },
  parameters: { type: [ParameterSchema], default: [] },
  fee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalfee: { type: Number, default: 0 },
}, { timestamps: true });

const LabTestReport= mongoose.model("LabTestReport", LabTestSchema);

export default LabTestReport;