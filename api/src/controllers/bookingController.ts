import { Request, Response } from 'express';
import { AvailabilityService, BookingService } from '../services';
import { CreateBookingRequest, BookingResponse, BookingErrorResponse, BookingSuggestion } from '../types';

export class BookingController {
  static async createBookingRequest(req: Request<{}, any, CreateBookingRequest>, res: Response): Promise<void> {
    try {
      const { startTime, endTime } = req.body;
      
      if (!startTime || !endTime) {
        res.status(400).json({ error: 'startTime and endTime are required' });
        return;
      }
      
      const requestStart = new Date(startTime);
      const requestEnd = new Date(endTime);
      
      const availablePainter = await AvailabilityService.findAvailablePainter(requestStart, requestEnd);
      
      if (!availablePainter) {
        // Find nearest available slots
        const suggestions = await AvailabilityService.findNearestAvailableSlots(requestStart, requestEnd);
        
        const response: BookingErrorResponse = {
          error: 'No painters are available for the requested time slot.',
          suggestions: suggestions.map(s => ({
            painter: {
              id: s.painterId,
              name: s.painterName
            },
            startTime: s.startTime,
            endTime: s.endTime,
            message: `Available ${s.timeDifference < 24 * 60 * 60 * 1000 ? 'same day' : 'on different day'}`
          }))
        };
        
        res.status(409).json(response);
        return;
      }
      
      const booking = await BookingService.createBooking(
        availablePainter.painterId,
        'Best Painter',
        requestStart,
        requestEnd
      );
      
      const response: BookingResponse = {
        bookingId: (booking._id as any).toString(),
        painter: {
          id: booking.painterId,
          name: booking.painterName
        },
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        status: booking.status
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  }
  
  static async getCustomerBookings(req: Request, res: Response): Promise<void> {
    try {
      const bookings = await BookingService.getCustomerBookings('customer-1');
      
      const response: BookingResponse[] = bookings.map(b => ({
        bookingId: (b._id as any).toString(),
        painter: {
          id: b.painterId,
          name: b.painterName
        },
        startTime: b.startTime.toISOString(),
        endTime: b.endTime.toISOString(),
        status: b.status
      }));
      
      res.json(response);
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }
  
  static async getPainterBookings(req: Request, res: Response): Promise<void> {
    try {
      const painterId = (req.query.painterId as string) || 'painter-1';
      const bookings = await BookingService.getPainterBookings(painterId);
      
      const response = bookings.map(b => ({
        bookingId: (b._id as any).toString(),
        startTime: b.startTime.toISOString(),
        endTime: b.endTime.toISOString(),
        status: b.status
      }));
      
      res.json(response);
    } catch (error) {
      console.error('Error fetching painter bookings:', error);
      res.status(500).json({ error: 'Failed to fetch painter bookings' });
    }
  }
}