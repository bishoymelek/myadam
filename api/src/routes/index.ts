import { Router } from 'express';
import { availabilityRoutes } from './availabilityRoutes';
import { bookingRoutes } from './bookingRoutes';
import { BookingController } from '../controllers';

const router = Router();

router.use('/availability', availabilityRoutes);
router.use('/bookings', bookingRoutes);

// Legacy booking-request endpoint for compatibility
router.post('/booking-request', BookingController.createBookingRequest);

export { router as apiRoutes };