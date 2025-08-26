import { Availability, Booking } from "../models";
import { IAvailability, SuggestionInternal } from "../types";

export class AvailabilityService {
  static async createAvailability(
    painterId: string,
    startTime: Date,
    endTime: Date
  ): Promise<IAvailability> {
    const availability = new Availability({
      painterId,
      startTime,
      endTime,
    });

    return await availability.save();
  }

  static async getPainterAvailabilities(
    painterId: string
  ): Promise<IAvailability[]> {
    return await Availability.find({ painterId }).sort({ startTime: 1 });
  }

  static async findAvailablePainter(
    startTime: Date,
    endTime: Date
  ): Promise<IAvailability | null> {
    // Find painters with availability that covers the requested time
    const availabilities = await Availability.find({
      startTime: { $lte: startTime },
      endTime: { $gte: endTime },
    });

    // Filter out painters with conflicting bookings
    const availablePainters: IAvailability[] = [];

    for (const availability of availabilities) {
      // Check for ANY booking that overlaps with the requested time
      const conflictingBooking = await Booking.findOne({
        painterId: availability.painterId,
        // A booking conflicts if it overlaps with requested time at all
        $or: [
          {
            // Any overlap or adjacency between existing booking and requested time
            // Booking starts before request ends AND booking ends at or after request starts
            startTime: { $lt: endTime },
            endTime: { $gte: startTime },
          },
        ],
      });

      console.log(`🔍 Checking ${availability.painterId}:`, {
        availableWindow: `${availability.startTime.toISOString()} - ${availability.endTime.toISOString()}`,
        requestedWindow: `${startTime.toISOString()} - ${endTime.toISOString()}`,
        hasConflict: !!conflictingBooking,
        conflictingBooking: conflictingBooking ? {
          start: conflictingBooking.startTime.toISOString(),
          end: conflictingBooking.endTime.toISOString()
        } : null
      });

      // Only include painters with NO conflicting bookings
      if (!conflictingBooking) {
        availablePainters.push(availability);
      }
    }

    if (availablePainters.length === 0) {
      return null;
    }

    // If only one painter available, return immediately
    if (availablePainters.length === 1) {
      return availablePainters[0];
    }

    // Smart prioritization: choose the "best" painter
    return await this.prioritizePainters(availablePainters, startTime, endTime);
  }

  private static async prioritizePainters(
    availabilities: IAvailability[],
    startTime: Date,
    endTime: Date
  ): Promise<IAvailability> {
    const painterScores = await Promise.all(
      availabilities.map(async (availability) => {
        let score = 0;

        // 1. Efficiency Score: Prefer tighter availability windows (less waste)
        const requestedDuration = endTime.getTime() - startTime.getTime();
        const availabilityDuration =
          availability.endTime.getTime() - availability.startTime.getTime();
        const efficiency = requestedDuration / availabilityDuration;
        score += efficiency * 100; // 0-100 points

        // 2. Workload Balance: Prefer painters with fewer bookings
        const bookingCount = await Booking.countDocuments({
          painterId: availability.painterId,
          status: "confirmed",
        });
        const workloadScore = Math.max(50 - bookingCount * 10, 0); // Fewer bookings = higher score
        score += workloadScore;

        // 3. Recency: Prefer recently added availability (shows engagement)
        const daysSinceCreated =
          (Date.now() - availability.createdAt!.getTime()) /
          (1000 * 60 * 60 * 24);
        const recencyScore = Math.max(30 - daysSinceCreated * 2, 0); // Recent = higher score
        score += recencyScore;

        return { availability, score };
      })
    );

    // Sort by score (highest first) and return the best painter
    painterScores.sort((a, b) => b.score - a.score);

    console.log(`\n🎯 SMART PAINTER PRIORITIZATION 🎯`);
    console.log(`📊 Evaluating ${painterScores.length} available painters:`);
    painterScores.forEach((p, i) => {
      console.log(
        `   ${
          i + 1
        }. ${p.availability.painterId.toUpperCase()}: ${p.score.toFixed(
          1
        )} points`
      );
    });
    console.log(
      `\n✅ WINNER: ${painterScores[0].availability.painterId.toUpperCase()} (${painterScores[0].score.toFixed(
        1
      )} points)`
    );
    console.log(`=====================================\n`);

    return painterScores[0].availability;
  }

  static async findNearestAvailableSlots(
    startTime: Date,
    endTime: Date,
    limit: number = 3
  ): Promise<SuggestionInternal[]> {
    const duration = endTime.getTime() - startTime.getTime();

    // Get all availabilities
    const availabilities = await Availability.find({}).sort({ startTime: 1 });
    const suggestions: SuggestionInternal[] = [];

    for (const availability of availabilities) {
      const availStart = new Date(availability.startTime);
      const availEnd = new Date(availability.endTime);

      // Skip past availabilities
      if (availEnd <= new Date()) continue;

      // Check multiple potential time slots within this availability window
      let currentSlot = new Date(
        Math.max(availStart.getTime(), new Date().getTime())
      );

      while (currentSlot.getTime() + duration <= availEnd.getTime()) {
        const slotEnd = new Date(currentSlot.getTime() + duration);

        // Check if this slot conflicts with existing bookings
        const conflictingBooking = await Booking.findOne({
          painterId: availability.painterId,
          $or: [
            {
              startTime: { $lt: slotEnd },
              endTime: { $gte: currentSlot },
            },
          ],
        });

        if (!conflictingBooking) {
          // Calculate time difference from requested time
          const timeDiff = Math.abs(
            currentSlot.getTime() - startTime.getTime()
          );

          suggestions.push({
            painterId: availability.painterId,
            painterName: "Best Painter",
            startTime: currentSlot.toISOString(),
            endTime: slotEnd.toISOString(),
            timeDifference: timeDiff,
          });

          if (suggestions.length >= limit * 2) break;
        }

        // Move to next hour slot
        currentSlot = new Date(currentSlot.getTime() + 60 * 60 * 1000);
      }

      if (suggestions.length >= limit * 2) break;
    }

    // Sort by time difference and return closest suggestions
    return suggestions
      .sort((a, b) => a.timeDifference - b.timeDifference)
      .slice(0, limit);
  }
}
