import { Request, Response } from 'express';
import { bookingService } from '../services/booking.service';
import { logger } from '../utils/logger';
import { createBookingSchema, updateBookingSchema, availabilityQuerySchema } from '../utils/validators';
import { ErrorCode } from '@coaching-platform/shared';

/**
 * Get available time slots for a specific date
 */
export async function getAvailability(req: Request, res: Response) {
  try {
    const validation = availabilityQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        error: {
          code: ErrorCode.VALIDATION_INVALID_DATE,
          message: 'Invalid date format',
          details: validation.error.errors,
        },
      });
    }

    const { date } = validation.data;
    const slots = await bookingService.getAvailability(date);

    res.json({
      success: true,
      data: {
        date,
        slots,
      },
    });
  } catch (error: any) {
    logger.error('Error in getAvailability', error);
    res.status(500).json({
      error: {
        code: ErrorCode.SERVER_ERROR,
        message: 'Failed to calculate availability',
      },
    });
  }
}

/**
 * Create a new booking request
 */
export async function createBooking(req: Request, res: Response) {
  try {
    const validation = createBookingSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: {
          code: ErrorCode.VALIDATION_MISSING_FIELD,
          message: 'Invalid booking data',
          details: validation.error.errors,
        },
      });
    }

    const booking = await bookingService.createBooking(validation.data);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    logger.error('Error in createBooking', error);

    if (error.message?.includes('BOOKING_CONFLICT')) {
      return res.status(409).json({
        error: {
          code: ErrorCode.BOOKING_CONFLICT,
          message: 'This time slot is not available',
        },
      });
    }

    res.status(500).json({
      error: {
        code: ErrorCode.SERVER_ERROR,
        message: 'Failed to create booking',
      },
    });
  }
}

/**
 * Get all bookings with optional filters
 */
export async function getBookings(req: Request, res: Response) {
  try {
    const { status, date, clientId } = req.query;

    const bookings = await bookingService.getBookings({
      status: status as any,
      date: date as string,
      clientId: clientId as string,
    });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    logger.error('Error in getBookings', error);
    res.status(500).json({
      error: {
        code: ErrorCode.SERVER_ERROR,
        message: 'Failed to get bookings',
      },
    });
  }
}

/**
 * Get a single booking by ID
 */
export async function getBookingById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const booking = await bookingService.getBookingById(id);

    if (!booking) {
      return res.status(404).json({
        error: {
          code: ErrorCode.BOOKING_NOT_FOUND,
          message: 'Booking not found',
        },
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    logger.error('Error in getBookingById', error);
    res.status(500).json({
      error: {
        code: ErrorCode.SERVER_ERROR,
        message: 'Failed to get booking',
      },
    });
  }
}

/**
 * Approve a booking
 */
export async function approveBooking(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const booking = await bookingService.approveBooking(id);

    res.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    logger.error('Error in approveBooking', error);

    if (error.message?.includes('NOT_FOUND')) {
      return res.status(404).json({
        error: {
          code: ErrorCode.BOOKING_NOT_FOUND,
          message: 'Booking not found',
        },
      });
    }

    if (error.message?.includes('ALREADY_APPROVED')) {
      return res.status(400).json({
        error: {
          code: ErrorCode.BOOKING_ALREADY_APPROVED,
          message: 'Booking is already approved',
        },
      });
    }

    res.status(500).json({
      error: {
        code: ErrorCode.SERVER_ERROR,
        message: 'Failed to approve booking',
      },
    });
  }
}

/**
 * Reject a booking
 */
export async function rejectBooking(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const booking = await bookingService.rejectBooking(id);

    res.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    logger.error('Error in rejectBooking', error);

    if (error.message?.includes('NOT_FOUND')) {
      return res.status(404).json({
        error: {
          code: ErrorCode.BOOKING_NOT_FOUND,
          message: 'Booking not found',
        },
      });
    }

    res.status(500).json({
      error: {
        code: ErrorCode.SERVER_ERROR,
        message: 'Failed to reject booking',
      },
    });
  }
}

/**
 * Complete a booking
 */
export async function completeBooking(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const booking = await bookingService.completeBooking(id);

    res.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    logger.error('Error in completeBooking', error);

    if (error.message?.includes('NOT_FOUND')) {
      return res.status(404).json({
        error: {
          code: ErrorCode.BOOKING_NOT_FOUND,
          message: 'Booking not found',
        },
      });
    }

    res.status(500).json({
      error: {
        code: ErrorCode.SERVER_ERROR,
        message: 'Failed to complete booking',
      },
    });
  }
}
