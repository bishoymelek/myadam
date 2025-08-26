import { Request, Response } from "express";
import { AvailabilityService, BookingService } from "../services";
import { derivePainterName } from "../services/painterName";
import {
  CreateBookingRequest,
  BookingResponse,
  BookingErrorResponse,
} from "../types";
import { Booking } from "../models";

export class BookingController {
  static async createBookingRequest(
    req: Request<{}, any, CreateBookingRequest>,
    res: Response
  ): Promise<void> {
    try {
      const { startTime, endTime } = req.body;

      if (!startTime || !endTime) {
        res.status(400).json({ error: "startTime and endTime are required" });
        return;
      }

      const requestStart = new Date(startTime);
      const requestEnd = new Date(endTime);

      // Check if customer already has a booking at the same time
      const existingBooking = await Booking.findOne({
        customerId: "customer-1", // Using hardcoded customer for now
        $or: [
          {
            startTime: { $lt: requestEnd },
            endTime: { $gt: requestStart },
          },
        ],
      });

      if (existingBooking) {
        res.status(400).json({
          error:
            "You already have a booking that overlaps with this time slot. Please choose a different time.",
        });
        return;
      }

      const availablePainter = await AvailabilityService.findAvailablePainter(
        requestStart,
        requestEnd
      );

      if (!availablePainter) {
        // Find nearest available slots
        const suggestions = await AvailabilityService.findNearestAvailableSlots(
          requestStart,
          requestEnd
        );

        // Exclude suggestions that overlap with customer's existing bookings
        const customerBookings = await Booking.find({
          customerId: "customer-1",
        })
          .select("startTime endTime")
          .lean();
        // Only filter out suggestions that exactly match an existing booking window
        const isExactMatch = (
          sStartMs: number,
          sEndMs: number,
          bStartMs: number,
          bEndMs: number
        ) => sStartMs === bStartMs && sEndMs === bEndMs;

        const filtered = suggestions.filter((s) => {
          const sStartMs = new Date(s.startTime).getTime();
          const sEndMs = new Date(s.endTime).getTime();
          return !customerBookings.some((b: any) =>
            isExactMatch(
              sStartMs,
              sEndMs,
              new Date(b.startTime).getTime(),
              new Date(b.endTime).getTime()
            )
          );
        });

        const response: BookingErrorResponse = {
          error: "No painters are available for the requested time slot.",
          suggestions: filtered.map((s) => ({
            painter: {
              id: s.painterId,
              name: s.painterName,
            },
            startTime: s.startTime,
            endTime: s.endTime,
            message: `Available ${
              s.timeDifference < 24 * 60 * 60 * 1000
                ? "same day"
                : "on different day"
            }`,
          })),
        };

        // Always return 409 for consistency; frontend decides whether to show modal or error
        res.status(409).json(response);
        return;
      }

      const booking = await BookingService.createBooking(
        availablePainter.painterId,
        derivePainterName(availablePainter.painterId),
        requestStart,
        requestEnd
      );

      const response: BookingResponse = {
        bookingId: (booking._id as any).toString(),
        painter: {
          id: booking.painterId,
          name: booking.painterName,
        },
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        status: booking.status,
      };

      res.json(response);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  }

  static async getCustomerBookings(req: Request, res: Response): Promise<void> {
    try {
      const bookings = await BookingService.getCustomerBookings("customer-1");

      const response: BookingResponse[] = bookings.map((b) => ({
        bookingId: (b._id as any).toString(),
        painter: {
          id: b.painterId,
          name: b.painterName,
        },
        startTime: b.startTime.toISOString(),
        endTime: b.endTime.toISOString(),
        status: b.status,
      }));

      res.json(response);
    } catch (error) {
      console.error("Error fetching customer bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  }

  static async getPainterBookings(req: Request, res: Response): Promise<void> {
    try {
      const painterId = (req.query.painterId as string) || "painter-1";
      const bookings = await BookingService.getPainterBookings(painterId);

      const response = bookings.map((b) => ({
        bookingId: (b._id as any).toString(),
        startTime: b.startTime.toISOString(),
        endTime: b.endTime.toISOString(),
        status: b.status,
      }));

      res.json(response);
    } catch (error) {
      console.error("Error fetching painter bookings:", error);
      res.status(500).json({ error: "Failed to fetch painter bookings" });
    }
  }
}
