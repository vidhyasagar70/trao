import { Router } from 'express';
import {
  createTrip,
  getMyTrips,
  getTripById,
  updateDay,
  regenerateDay,
  deleteTrip,
} from '../controllers/tripController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// All trip routes require authentication
router.use(protect);

router.post('/', createTrip);
router.get('/', getMyTrips);
router.get('/:id', getTripById);
router.put('/:id/day/:dayNumber', updateDay);
router.post('/:id/day/:dayNumber/regenerate', regenerateDay);
router.delete('/:id', deleteTrip);

export default router;
