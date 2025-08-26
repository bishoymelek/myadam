import mongoose, { Schema } from "mongoose";
import { IBooking } from "../types";
import { derivePainterName } from "../services/painterName";

const bookingSchema = new Schema<IBooking>(
  {
    painterId: {
      type: String,
      required: true,
    },
    painterName: {
      type: String,
      default: function (this: any) {
        return derivePainterName(this.painterId);
      },
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled"],
      default: "confirmed",
    },
    customerId: {
      type: String,
      default: "customer-1",
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
