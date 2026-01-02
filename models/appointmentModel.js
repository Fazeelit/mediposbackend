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

    paidfee: {
      type: Number,
      min: 0,
      default: 0,
    },

    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Auto-assign fee to paidfee on create
 */
appointmentSchema.pre("save", function (next) {
  if (this.isNew && (!this.paidfee || this.paidfee === 0)) {
    this.paidfee = this.fee;
  }
  next();
});

/**
 * Prevent paidfee from exceeding fee
 */
appointmentSchema.pre("save", function (next) {
  if (this.paidfee > this.fee) {
    return next(new Error("Paid fee cannot be greater than total fee"));
  }
  next();
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
