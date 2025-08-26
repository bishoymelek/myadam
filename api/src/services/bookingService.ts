import { Booking } from '../models';
import { IBooking } from '../types';

export class BookingService {
  static async createBooking(
    painterId: string,
    painterName: string,
    startTime: Date,
    endTime: Date,
    customerId: string = 'customer-1'
  ): Promise<IBooking> {
    const booking = new Booking({
      painterId,
      painterName,
      startTime,
      endTime,
      status: 'confirmed',
      customerId
    });
    
    return await booking.save();
  }
  
  static async getCustomerBookings(customerId: string): Promise<IBooking[]> {
    return await Booking.find({ customerId }).sort({ startTime: 1 });
  }
  
  static async getPainterBookings(painterId: string): Promise<IBooking[]> {
    return await Booking.find({ painterId }).sort({ startTime: 1 });
  }
}