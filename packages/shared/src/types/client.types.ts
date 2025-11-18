/**
 * Client-related types
 * These types are shared between frontend and backend
 */

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: Date;
  last_session_at?: Date;
  notes?: string;
  archived: boolean;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  archived?: boolean;
}

export interface ClientWithStats extends Client {
  total_sessions: number;
  upcoming_sessions: number;
  total_spent: number;
}
