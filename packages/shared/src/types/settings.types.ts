/**
 * Settings-related types
 * These types are shared between frontend and backend
 */

export interface WorkingHours {
  [key: string]: {
    start: string; // HH:MM format
    end: string; // HH:MM format
  } | null;
}

export interface Settings {
  id: number;
  business_name?: string;
  business_email?: string;
  business_phone?: string;
  session_duration_minutes: number;
  buffer_time_minutes: number;
  working_hours: WorkingHours;
  booking_advance_days: number;
  invoice_template?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface UpdateSettingsRequest {
  business_name?: string;
  business_email?: string;
  business_phone?: string;
  session_duration_minutes?: number;
  buffer_time_minutes?: number;
  working_hours?: WorkingHours;
  booking_advance_days?: number;
  invoice_template?: Record<string, any>;
}
