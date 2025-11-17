import { Router, Request, Response } from 'express';

const router = Router();

// Example route - will be replaced with actual routes later
router.get('/example', (req: Request, res: Response) => {
  res.json({
    message: 'This is an example route',
    note: 'We will replace this with real routes like /bookings, /clients, etc.',
  });
});

export default router;
