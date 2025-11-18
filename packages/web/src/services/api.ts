import axios, { AxiosInstance } from 'axios';
import {
  ApiResponse,
  Booking,
  BookingWithClient,
  CreateBookingRequest,
  TimeSlot,
  Client,
  ClientWithStats,
  CreateClientRequest,
  UpdateClientRequest,
} from '@coaching-platform/shared';

/**
 * API Service for making requests to the backend
 * All API calls go through this service
 */
class ApiService {
  private client: AxiosInstance;

  constructor() {
    // Base URL from environment variable or default
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Log error for debugging
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // ===== Booking Endpoints =====

  /**
   * Get available time slots for a specific date
   */
  async getAvailability(date: string): Promise<TimeSlot[]> {
    const response = await this.client.get<ApiResponse<{ date: string; slots: TimeSlot[] }>>(
      '/bookings/availability',
      {
        params: { date },
      }
    );
    return response.data.data?.slots || [];
  }

  /**
   * Create a new booking request
   */
  async createBooking(booking: CreateBookingRequest): Promise<BookingWithClient> {
    const response = await this.client.post<ApiResponse<BookingWithClient>>(
      '/bookings',
      booking
    );
    if (!response.data.data) {
      throw new Error('Failed to create booking');
    }
    return response.data.data;
  }

  /**
   * Get all bookings with optional filters
   */
  async getBookings(filters?: {
    status?: string;
    date?: string;
    clientId?: string;
  }): Promise<BookingWithClient[]> {
    const response = await this.client.get<ApiResponse<BookingWithClient[]>>(
      '/bookings',
      {
        params: filters,
      }
    );
    return response.data.data || [];
  }

  /**
   * Get a specific booking by ID
   */
  async getBookingById(id: string): Promise<BookingWithClient> {
    const response = await this.client.get<ApiResponse<BookingWithClient>>(
      `/bookings/${id}`
    );
    if (!response.data.data) {
      throw new Error('Booking not found');
    }
    return response.data.data;
  }

  /**
   * Approve a booking
   */
  async approveBooking(id: string): Promise<BookingWithClient> {
    const response = await this.client.patch<ApiResponse<BookingWithClient>>(
      `/bookings/${id}/approve`
    );
    if (!response.data.data) {
      throw new Error('Failed to approve booking');
    }
    return response.data.data;
  }

  /**
   * Reject a booking
   */
  async rejectBooking(id: string): Promise<BookingWithClient> {
    const response = await this.client.patch<ApiResponse<BookingWithClient>>(
      `/bookings/${id}/reject`
    );
    if (!response.data.data) {
      throw new Error('Failed to reject booking');
    }
    return response.data.data;
  }

  /**
   * Complete a booking
   */
  async completeBooking(id: string): Promise<BookingWithClient> {
    const response = await this.client.patch<ApiResponse<BookingWithClient>>(
      `/bookings/${id}/complete`
    );
    if (!response.data.data) {
      throw new Error('Failed to complete booking');
    }
    return response.data.data;
  }

  // ===== Client Endpoints =====

  /**
   * Get all clients
   */
  async getClients(includeArchived?: boolean): Promise<Client[]> {
    const response = await this.client.get<ApiResponse<Client[]>>('/clients', {
      params: { includeArchived },
    });
    return response.data.data || [];
  }

  /**
   * Get a specific client by ID
   */
  async getClientById(id: string, withStats?: boolean): Promise<Client | ClientWithStats> {
    const response = await this.client.get<ApiResponse<Client | ClientWithStats>>(
      `/clients/${id}`,
      {
        params: { stats: withStats },
      }
    );
    if (!response.data.data) {
      throw new Error('Client not found');
    }
    return response.data.data;
  }

  /**
   * Create a new client
   */
  async createClient(client: CreateClientRequest): Promise<Client> {
    const response = await this.client.post<ApiResponse<Client>>('/clients', client);
    if (!response.data.data) {
      throw new Error('Failed to create client');
    }
    return response.data.data;
  }

  /**
   * Update a client
   */
  async updateClient(id: string, data: UpdateClientRequest): Promise<Client> {
    const response = await this.client.patch<ApiResponse<Client>>(
      `/clients/${id}`,
      data
    );
    if (!response.data.data) {
      throw new Error('Failed to update client');
    }
    return response.data.data;
  }

  /**
   * Get client's booking history
   */
  async getClientBookings(id: string): Promise<Booking[]> {
    const response = await this.client.get<ApiResponse<Booking[]>>(
      `/clients/${id}/bookings`
    );
    return response.data.data || [];
  }

  /**
   * Archive a client
   */
  async archiveClient(id: string): Promise<Client> {
    const response = await this.client.patch<ApiResponse<Client>>(
      `/clients/${id}/archive`
    );
    if (!response.data.data) {
      throw new Error('Failed to archive client');
    }
    return response.data.data;
  }

  /**
   * Unarchive a client
   */
  async unarchiveClient(id: string): Promise<Client> {
    const response = await this.client.patch<ApiResponse<Client>>(
      `/clients/${id}/unarchive`
    );
    if (!response.data.data) {
      throw new Error('Failed to unarchive client');
    }
    return response.data.data;
  }

  // ===== Health Check =====

  /**
   * Check API health
   */
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await axios.get('http://localhost:3000/health');
    return response.data;
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default apiService;
