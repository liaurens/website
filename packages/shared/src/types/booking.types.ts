/**
 * Booking-related types
 * These types are shared between frontend and backend
 */

export type BookingStatus = 'pending' | 'approved' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  client_id: string;
  start_time: Date;
  end_time: Date;
  status: BookingStatus;
  location?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  booking_token: string;
}

export interface BookingWithClient extends Booking {
  client_name: string;
  client_email: string;
  client_phone?: string;
}

export interface CreateBookingRequest {
  client_name: string;
  client_email: string;
  client_phone?: string;
  start_time: string; // ISO 8601 datetime string
  end_time: string; // ISO 8601 datetime string
  notes?: string;
}

export interface UpdateBookingRequest {
  start_time?: string;
  end_time?: string;
  status?: BookingStatus;
  location?: string;
  notes?: string;
}

export interface TimeSlot {
  start_time: string; // ISO 8601 datetime string
  end_time: string; // ISO 8601 datetime string
  available: boolean;
}

export interface AvailabilityRequest {
  date: string; // YYYY-MM-DD format
}

export interface AvailabilityResponse {
  date: string;
  slots: TimeSlot[];
}

export interface BlockedTime {
  id: string;
  start_time: Date;
  end_time: Date;
  reason?: string;
  created_at: Date;
}

export interface CreateBlockedTimeRequest {
  start_time: string; // ISO 8601 datetime string
  end_time: string; // ISO 8601 datetime string
  reason?: string;
}
