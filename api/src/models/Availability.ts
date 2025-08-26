import mongoose, { Schema } from "mongoose";
import { IAvailability } from "../types";

const availabilitySchema = new Schema<IAvailability>(
  {
    painterId: {
      type: String,
      required: true,
      default: "painter-1",
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Availability = mongoose.model<IAvailability>(
  "Availability",
  availabilitySchema
);
