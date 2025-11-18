/**
 * Invoice-related types
 * These types are shared between frontend and backend
 */

export type InvoiceStatus = 'unpaid' | 'paid' | 'cancelled';

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id?: string;
  booking_id?: string;
  amount: number;
  currency: string;
  issue_date: Date;
  due_date?: Date;
  status: InvoiceStatus;
  pdf_url?: string;
  sent_at?: Date;
  paid_at?: Date;
  created_at: Date;
}

export interface InvoiceWithDetails extends Invoice {
  client_name?: string;
  client_email?: string;
  booking_start_time?: Date;
  booking_end_time?: Date;
}

export interface CreateInvoiceRequest {
  client_id: string;
  booking_id?: string;
  amount: number;
  currency?: string;
  issue_date: string; // YYYY-MM-DD format
  due_date?: string; // YYYY-MM-DD format
}

export interface UpdateInvoiceRequest {
  status?: InvoiceStatus;
  paid_at?: string; // ISO 8601 datetime string
}
