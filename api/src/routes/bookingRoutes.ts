import { Router } from 'express';
import { BookingController } from '../controllers';

const router = Router();

router.post('/booking-request', BookingController.createBookingRequest);
router.get('/me', BookingController.getCustomerBookings);
router.get('/painter', BookingController.getPainterBookings);

export { router as bookingRoutes };