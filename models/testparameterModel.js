// models/TestParameter.js
import mongoose from "mongoose";

const testParameterSchema = new mongoose.Schema(
  {    
    testname: {
      type: String,
      required: true,
    },
    refvalue: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      trim: true,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    }
  },
  {
    timestamps: true,
  }
);

const TestParameter = mongoose.model("TestParameter", testParameterSchema);

export default TestParameter;
