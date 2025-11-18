-- Coaching Platform Database Schema
-- Initial migration: Create all core tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table (minimal data collection)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  last_session_at TIMESTAMP,
  notes TEXT,
  archived BOOLEAN DEFAULT FALSE
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'completed', 'cancelled'
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  booking_token VARCHAR(255) UNIQUE, -- For client to view their booking
  CONSTRAINT no_overlap CHECK (start_time < end_time)
);

-- Blocked times (coach unavailability)
CREATE TABLE blocked_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT blocked_no_overlap CHECK (start_time < end_time)
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  issue_date DATE NOT NULL,
  due_date DATE,
  status VARCHAR(50) DEFAULT 'unpaid', -- 'unpaid', 'paid', 'cancelled'
  pdf_url TEXT,
  sent_at TIMESTAMP,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Coach settings (singleton table)
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  business_name VARCHAR(255),
  business_email VARCHAR(255),
  business_phone VARCHAR(50),
  session_duration_minutes INTEGER DEFAULT 60,
  buffer_time_minutes INTEGER DEFAULT 15,
  working_hours JSONB DEFAULT '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}}'::jsonb,
  booking_advance_days INTEGER DEFAULT 7,
  invoice_template JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Email log (for tracking)
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email VARCHAR(255) NOT NULL,
  email_type VARCHAR(50), -- 'booking_confirmation', 'reminder', 'invoice'
  subject TEXT,
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50), -- 'sent', 'failed'
  error_message TEXT
);

-- Create indexes for performance
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_token ON bookings(booking_token);
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_booking ON invoices(booking_id);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_blocked_times_range ON blocked_times(start_time, end_time);

-- Insert default settings
INSERT INTO settings (id, business_name, business_email)
VALUES (1, 'My Coaching Business', 'coach@example.com')
ON CONFLICT (id) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for bookings updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for settings updated_at
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
