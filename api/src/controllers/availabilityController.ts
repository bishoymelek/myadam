import { Request, Response } from 'express';
import { AvailabilityService } from '../services';
import { CreateAvailabilityRequest, AvailabilityResponse } from '../types';

export class AvailabilityController {
  static async createAvailability(
    req: Request<{}, any, CreateAvailabilityRequest>,
    res: Response
  ): Promise<void> {
    try {
      const { startTime, endTime } = req.body;

      if (!startTime || !endTime) {
        res.status(400).json({ error: "startTime and endTime are required" });
        return;
      }

      // Allow specifying painter ID in request body for testing, default to painter-1
      const painterId = (req.body as any).painterId || "painter-1";

      const availability = await AvailabilityService.createAvailability(
        painterId,
        new Date(startTime),
        new Date(endTime)
      );

      const response: AvailabilityResponse = {
        id: (availability._id as any).toString(),
        painterId: availability.painterId,
        startTime: availability.startTime.toISOString(),
        endTime: availability.endTime.toISOString(),
      };

      res.json(response);
    } catch (error) {
      console.error("Error creating availability:", error);
      res.status(500).json({ error: "Failed to create availability" });
    }
  }

  static async getPainterAvailabilities(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const painterId = (req.query.painterId as string) || "painter-1";
      const availabilities = await AvailabilityService.getPainterAvailabilities(
        painterId
      );

      const response: AvailabilityResponse[] = availabilities.map((a) => ({
        id: (a._id as any).toString(),
        painterId: a.painterId,
        startTime: a.startTime.toISOString(),
        endTime: a.endTime.toISOString(),
      }));

      res.json(response);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
      res.status(500).json({ error: "Failed to fetch availabilities" });
    }
  }
}
