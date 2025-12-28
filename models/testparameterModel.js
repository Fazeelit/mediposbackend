import mongoose from "mongoose";

// Schema for individual parameters
const parameterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  min: { type: Number, trim: true },
  max: { type: Number, trim: true },
  unit: { type: String, trim: true },
  cost: { type: Number, trim: true }, // fixed type
});

// Schema for the test containing multiple parameters
const testSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // Test name
  parameters: [parameterSchema], // Array of parameters
});

const TestParameters = mongoose.model("TestParameters", testSchema);

export default TestParameters;
