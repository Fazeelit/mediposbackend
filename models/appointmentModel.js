import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: String,
      required: true,
      trim: true,
    },

    doctor: {
      type: String,
      required: true,
      trim: true,
    },

    time: {
      type: String, // e.g. "10:00 AM"
      required: true,
    },

    reason: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Scheduled", "Confirmed", "Completed", "Cancelled"],
      default: "Scheduled",
    },

    fee: {
      type: Number,
      required: true,
      min: 0,
    },

    date: {
      type: Date, // used by calendar
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
