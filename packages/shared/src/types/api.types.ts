/**
 * API response types
 * These types are shared between frontend and backend
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// Common error codes
export enum ErrorCode {
  // Authentication
  AUTH_INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
  AUTH_EXPIRED_TOKEN = 'AUTH_EXPIRED_TOKEN',
  AUTH_MISSING_TOKEN = 'AUTH_MISSING_TOKEN',

  // Bookings
  BOOKING_CONFLICT = 'BOOKING_CONFLICT',
  BOOKING_PAST_DATE = 'BOOKING_PAST_DATE',
  BOOKING_OUTSIDE_HOURS = 'BOOKING_OUTSIDE_HOURS',
  BOOKING_NOT_FOUND = 'BOOKING_NOT_FOUND',
  BOOKING_ALREADY_APPROVED = 'BOOKING_ALREADY_APPROVED',

  // Validation
  VALIDATION_INVALID_EMAIL = 'VALIDATION_INVALID_EMAIL',
  VALIDATION_INVALID_PHONE = 'VALIDATION_INVALID_PHONE',
  VALIDATION_MISSING_FIELD = 'VALIDATION_MISSING_FIELD',
  VALIDATION_INVALID_DATE = 'VALIDATION_INVALID_DATE',

  // Server
  SERVER_ERROR = 'SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EMAIL_SEND_FAILED = 'EMAIL_SEND_FAILED',
  NOT_FOUND = 'NOT_FOUND',
}
