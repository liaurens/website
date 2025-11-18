import { Router } from 'express';
import * as clientsController from '../controllers/clients.controller';

const router = Router();

// All client routes (in future, add auth middleware for coach-only access)
router.get('/', clientsController.getAllClients);
router.get('/:id', clientsController.getClientById);
router.post('/', clientsController.createClient);
router.patch('/:id', clientsController.updateClient);
router.get('/:id/bookings', clientsController.getClientBookings);
router.patch('/:id/archive', clientsController.archiveClient);
router.patch('/:id/unarchive', clientsController.unarchiveClient);

export default router;
