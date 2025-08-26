import { Router } from 'express';
import { AvailabilityController } from '../controllers';

const router = Router();

router.post('/', AvailabilityController.createAvailability);
router.get('/me', AvailabilityController.getPainterAvailabilities);

export { router as availabilityRoutes };