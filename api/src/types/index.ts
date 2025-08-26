import { Document } from "mongoose";

export interface IAvailability extends Document {
  painterId: string;
  startTime: Date;
  endTime: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBooking extends Document {
  painterId: string;
  painterName: string;
  startTime: Date;
  endTime: Date;
  status: "confirmed" | "pending" | "cancelled";
  customerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAvailabilityRequest {
  startTime: string;
  endTime: string;
}

export interface CreateBookingRequest {
  startTime: string;
  endTime: string;
}

export interface AvailabilityResponse {
  id: string;
  painterId: string;
  startTime: string;
  endTime: string;
}

export interface BookingResponse {
  bookingId: string;
  painter: {
    id: string;
    name: string;
  };
  startTime: string;
  endTime: string;
  status: string;
}

export interface BookingSuggestion {
  painter: {
    id: string;
    name: string;
  };
  startTime: string;
  endTime: string;
  message: string;
}

export interface BookingErrorResponse {
  error: string;
  suggestions?: BookingSuggestion[];
}

export interface SuggestionInternal {
  painterId: string;
  painterName: string;
  startTime: string;
  endTime: string;
  timeDifference: number;
}
