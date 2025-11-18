import { Router } from 'express';
import * as bookingsController from '../controllers/bookings.controller';

const router = Router();

// Public routes (no auth required for MVP)
router.get('/availability', bookingsController.getAvailability);
router.post('/', bookingsController.createBooking);

// Coach routes (in future, add auth middleware)
router.get('/', bookingsController.getBookings);
router.get('/:id', bookingsController.getBookingById);
router.patch('/:id/approve', bookingsController.approveBooking);
router.patch('/:id/reject', bookingsController.rejectBooking);
router.patch('/:id/complete', bookingsController.completeBooking);

export default router;
