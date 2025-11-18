import { z } from 'zod';

/**
 * Validation schemas using Zod
 * These ensure data integrity before it reaches the database
 */

// Common validators
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().min(10, 'Phone number must be at least 10 digits').optional();
export const uuidSchema = z.string().uuid('Invalid ID format');
export const dateTimeSchema = z.string().datetime('Invalid datetime format');
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

// Client validators
export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: emailSchema,
  phone: phoneSchema,
  notes: z.string().optional(),
});

export const updateClientSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: emailSchema.optional(),
  phone: phoneSchema,
  notes: z.string().optional(),
  archived: z.boolean().optional(),
});

// Booking validators
export const createBookingSchema = z.object({
  client_name: z.string().min(1, 'Client name is required').max(255),
  client_email: emailSchema,
  client_phone: phoneSchema,
  start_time: dateTimeSchema,
  end_time: dateTimeSchema,
  notes: z.string().optional(),
}).refine(
  (data) => new Date(data.start_time) < new Date(data.end_time),
  {
    message: 'End time must be after start time',
    path: ['end_time'],
  }
);

export const updateBookingSchema = z.object({
  start_time: dateTimeSchema.optional(),
  end_time: dateTimeSchema.optional(),
  status: z.enum(['pending', 'approved', 'completed', 'cancelled']).optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

// Blocked time validators
export const createBlockedTimeSchema = z.object({
  start_time: dateTimeSchema,
  end_time: dateTimeSchema,
  reason: z.string().max(255).optional(),
}).refine(
  (data) => new Date(data.start_time) < new Date(data.end_time),
  {
    message: 'End time must be after start time',
    path: ['end_time'],
  }
);

// Invoice validators
export const createInvoiceSchema = z.object({
  client_id: uuidSchema,
  booking_id: uuidSchema.optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3).default('USD'),
  issue_date: dateSchema,
  due_date: dateSchema.optional(),
});

export const updateInvoiceSchema = z.object({
  status: z.enum(['unpaid', 'paid', 'cancelled']).optional(),
  paid_at: dateTimeSchema.optional(),
});

// Settings validators
export const updateSettingsSchema = z.object({
  business_name: z.string().max(255).optional(),
  business_email: emailSchema.optional(),
  business_phone: phoneSchema,
  session_duration_minutes: z.number().int().positive().optional(),
  buffer_time_minutes: z.number().int().min(0).optional(),
  working_hours: z.record(z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    end: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  }).nullable()).optional(),
  booking_advance_days: z.number().int().positive().optional(),
});

// Availability query validators
export const availabilityQuerySchema = z.object({
  date: dateSchema,
});

/**
 * Helper function to validate data against a schema
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}
