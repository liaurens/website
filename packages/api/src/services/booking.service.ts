import { query, insert, update, findById } from '../utils/database';
import { logger } from '../utils/logger';
import {
  Booking,
  BookingWithClient,
  CreateBookingRequest,
  TimeSlot,
  BookingStatus
} from '@coaching-platform/shared';
import { v4 as uuidv4 } from 'uuid';
import { addMinutes, format, parse, isAfter, isBefore, isWithinInterval } from 'date-fns';

/**
 * BookingService handles all booking-related business logic
 */
class BookingService {
  /**
   * Calculate available time slots for a given date
   */
  async getAvailability(date: string): Promise<TimeSlot[]> {
    try {
      logger.debug('Calculating availability', { date });

      // Get settings (working hours, session duration, buffer time)
      const settingsResult = await query(
        'SELECT session_duration_minutes, buffer_time_minutes, working_hours FROM settings WHERE id = 1'
      );

      if (settingsResult.rows.length === 0) {
        throw new Error('Settings not found');
      }

      const settings = settingsResult.rows[0];
      const sessionDuration = settings.session_duration_minutes;
      const bufferTime = settings.buffer_time_minutes;
      const workingHours = settings.working_hours;

      // Get day of week (e.g., "monday", "tuesday")
      const dateObj = new Date(date);
      const dayOfWeek = format(dateObj, 'EEEE').toLowerCase();

      // Check if coach works on this day
      if (!workingHours[dayOfWeek]) {
        logger.debug('Not a working day', { date, dayOfWeek });
        return [];
      }

      const dayHours = workingHours[dayOfWeek];
      const startTime = parse(dayHours.start, 'HH:mm', dateObj);
      const endTime = parse(dayHours.end, 'HH:mm', dateObj);

      // Generate all possible time slots
      const allSlots: TimeSlot[] = [];
      let currentTime = startTime;
      const slotDuration = sessionDuration + bufferTime;

      while (isBefore(addMinutes(currentTime, sessionDuration), endTime)) {
        const slotEnd = addMinutes(currentTime, sessionDuration);

        allSlots.push({
          start_time: currentTime.toISOString(),
          end_time: slotEnd.toISOString(),
          available: true, // Will check availability next
        });

        currentTime = addMinutes(currentTime, slotDuration);
      }

      // Get existing bookings for this date
      const bookingsResult = await query<Booking>(
        `SELECT * FROM bookings
         WHERE DATE(start_time) = $1
         AND status IN ('pending', 'approved')`,
        [date]
      );

      const bookedSlots = bookingsResult.rows;

      // Get blocked times for this date
      const blockedResult = await query(
        `SELECT * FROM blocked_times
         WHERE DATE(start_time) = $1 OR DATE(end_time) = $1`,
        [date]
      );

      const blockedTimes = blockedResult.rows;

      // Mark unavailable slots
      allSlots.forEach((slot) => {
        const slotStart = new Date(slot.start_time);
        const slotEnd = new Date(slot.end_time);

        // Check if slot overlaps with any booking
        const hasBookingConflict = bookedSlots.some((booking) => {
          const bookingStart = new Date(booking.start_time);
          const bookingEnd = new Date(booking.end_time);

          return this.timeRangesOverlap(slotStart, slotEnd, bookingStart, bookingEnd);
        });

        // Check if slot overlaps with any blocked time
        const hasBlockedConflict = blockedTimes.some((blocked) => {
          const blockedStart = new Date(blocked.start_time);
          const blockedEnd = new Date(blocked.end_time);

          return this.timeRangesOverlap(slotStart, slotEnd, blockedStart, blockedEnd);
        });

        // Check if slot is in the past
        const isInPast = isBefore(slotEnd, new Date());

        if (hasBookingConflict || hasBlockedConflict || isInPast) {
          slot.available = false;
        }
      });

      logger.debug('Availability calculated', {
        date,
        totalSlots: allSlots.length,
        availableSlots: allSlots.filter(s => s.available).length
      });

      return allSlots;
    } catch (error) {
      logger.error('Error calculating availability', error);
      throw error;
    }
  }

  /**
   * Check if two time ranges overlap
   */
  private timeRangesOverlap(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): boolean {
    return isBefore(start1, end2) && isAfter(end1, start2);
  }

  /**
   * Create a new booking request
   */
  async createBooking(data: CreateBookingRequest): Promise<BookingWithClient> {
    try {
      logger.info('Creating booking request', { email: data.client_email });

      // Check if time slot is available
      const startTime = new Date(data.start_time);
      const endTime = new Date(data.end_time);
      const date = format(startTime, 'yyyy-MM-dd');

      const availability = await this.getAvailability(date);
      const requestedSlot = availability.find((slot) => {
        const slotStart = new Date(slot.start_time);
        return slotStart.getTime() === startTime.getTime();
      });

      if (!requestedSlot || !requestedSlot.available) {
        throw new Error('BOOKING_CONFLICT: This time slot is not available');
      }

      // Find or create client
      let clientResult = await query(
        'SELECT * FROM clients WHERE email = $1',
        [data.client_email]
      );

      let clientId: string;

      if (clientResult.rows.length === 0) {
        // Create new client
        const newClient = await insert('clients', {
          name: data.client_name,
          email: data.client_email,
          phone: data.client_phone || null,
        });
        clientId = newClient.id;
      } else {
        clientId = clientResult.rows[0].id;
      }

      // Create booking with token
      const bookingToken = uuidv4();
      const booking = await insert<Booking>('bookings', {
        client_id: clientId,
        start_time: data.start_time,
        end_time: data.end_time,
        status: 'pending',
        notes: data.notes || null,
        booking_token: bookingToken,
      });

      // Return booking with client details
      const bookingWithClient: BookingWithClient = {
        ...booking,
        client_name: data.client_name,
        client_email: data.client_email,
        client_phone: data.client_phone,
      };

      logger.info('Booking created', { bookingId: booking.id, clientId });

      return bookingWithClient;
    } catch (error) {
      logger.error('Error creating booking', error);
      throw error;
    }
  }

  /**
   * Get all bookings with optional filters
   */
  async getBookings(filters?: {
    status?: BookingStatus;
    date?: string;
    clientId?: string;
  }): Promise<BookingWithClient[]> {
    try {
      let queryText = `
        SELECT
          b.*,
          c.name as client_name,
          c.email as client_email,
          c.phone as client_phone
        FROM bookings b
        JOIN clients c ON b.client_id = c.id
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramIndex = 1;

      if (filters?.status) {
        queryText += ` AND b.status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      if (filters?.date) {
        queryText += ` AND DATE(b.start_time) = $${paramIndex}`;
        params.push(filters.date);
        paramIndex++;
      }

      if (filters?.clientId) {
        queryText += ` AND b.client_id = $${paramIndex}`;
        params.push(filters.clientId);
        paramIndex++;
      }

      queryText += ' ORDER BY b.start_time ASC';

      const result = await query<BookingWithClient>(queryText, params);
      return result.rows;
    } catch (error) {
      logger.error('Error getting bookings', error);
      throw error;
    }
  }

  /**
   * Get a single booking by ID
   */
  async getBookingById(id: string): Promise<BookingWithClient | null> {
    try {
      const result = await query<BookingWithClient>(
        `SELECT
          b.*,
          c.name as client_name,
          c.email as client_email,
          c.phone as client_phone
        FROM bookings b
        JOIN clients c ON b.client_id = c.id
        WHERE b.id = $1`,
        [id]
      );

      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error getting booking by ID', error);
      throw error;
    }
  }

  /**
   * Approve a booking
   */
  async approveBooking(id: string): Promise<BookingWithClient> {
    try {
      const booking = await this.getBookingById(id);
      if (!booking) {
        throw new Error('BOOKING_NOT_FOUND');
      }

      if (booking.status !== 'pending') {
        throw new Error('BOOKING_ALREADY_APPROVED');
      }

      await update('bookings', id, { status: 'approved' });

      const updatedBooking = await this.getBookingById(id);
      logger.info('Booking approved', { bookingId: id });

      return updatedBooking!;
    } catch (error) {
      logger.error('Error approving booking', error);
      throw error;
    }
  }

  /**
   * Reject/cancel a booking
   */
  async rejectBooking(id: string): Promise<BookingWithClient> {
    try {
      const booking = await this.getBookingById(id);
      if (!booking) {
        throw new Error('BOOKING_NOT_FOUND');
      }

      await update('bookings', id, { status: 'cancelled' });

      const updatedBooking = await this.getBookingById(id);
      logger.info('Booking rejected', { bookingId: id });

      return updatedBooking!;
    } catch (error) {
      logger.error('Error rejecting booking', error);
      throw error;
    }
  }

  /**
   * Complete a booking
   */
  async completeBooking(id: string): Promise<BookingWithClient> {
    try {
      const booking = await this.getBookingById(id);
      if (!booking) {
        throw new Error('BOOKING_NOT_FOUND');
      }

      await update('bookings', id, { status: 'completed' });

      // Update client's last_session_at
      await query(
        'UPDATE clients SET last_session_at = $1 WHERE id = $2',
        [booking.end_time, booking.client_id]
      );

      const updatedBooking = await this.getBookingById(id);
      logger.info('Booking completed', { bookingId: id });

      return updatedBooking!;
    } catch (error) {
      logger.error('Error completing booking', error);
      throw error;
    }
  }
}

export const bookingService = new BookingService();
export default bookingService;
