import { query, insert, update, findById, findAll } from '../utils/database';
import { logger } from '../utils/logger';
import { Client, ClientWithStats, CreateClientRequest, UpdateClientRequest } from '@coaching-platform/shared';

/**
 * ClientService handles all client-related business logic
 */
class ClientService {
  /**
   * Get all clients
   */
  async getAllClients(includeArchived: boolean = false): Promise<Client[]> {
    try {
      let queryText = 'SELECT * FROM clients';
      if (!includeArchived) {
        queryText += ' WHERE archived = false';
      }
      queryText += ' ORDER BY created_at DESC';

      const result = await query<Client>(queryText);
      return result.rows;
    } catch (error) {
      logger.error('Error getting all clients', error);
      throw error;
    }
  }

  /**
   * Get a single client by ID
   */
  async getClientById(id: string): Promise<Client | null> {
    try {
      const client = await findById<Client>('clients', id);
      return client;
    } catch (error) {
      logger.error('Error getting client by ID', error);
      throw error;
    }
  }

  /**
   * Get client with statistics
   */
  async getClientWithStats(id: string): Promise<ClientWithStats | null> {
    try {
      const result = await query<ClientWithStats>(
        `SELECT
          c.*,
          COUNT(DISTINCT b.id) as total_sessions,
          COUNT(DISTINCT CASE WHEN b.status IN ('pending', 'approved') AND b.start_time > NOW() THEN b.id END) as upcoming_sessions,
          COALESCE(SUM(i.amount), 0) as total_spent
        FROM clients c
        LEFT JOIN bookings b ON c.id = b.client_id
        LEFT JOIN invoices i ON c.id = i.client_id AND i.status = 'paid'
        WHERE c.id = $1
        GROUP BY c.id`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const client = result.rows[0];

      // Convert string counts to numbers
      return {
        ...client,
        total_sessions: parseInt(client.total_sessions as any) || 0,
        upcoming_sessions: parseInt(client.upcoming_sessions as any) || 0,
        total_spent: parseFloat(client.total_spent as any) || 0,
      };
    } catch (error) {
      logger.error('Error getting client with stats', error);
      throw error;
    }
  }

  /**
   * Create a new client
   */
  async createClient(data: CreateClientRequest): Promise<Client> {
    try {
      // Check if email already exists
      const existingClient = await query(
        'SELECT id FROM clients WHERE email = $1',
        [data.email]
      );

      if (existingClient.rows.length > 0) {
        throw new Error('CLIENT_EMAIL_EXISTS: A client with this email already exists');
      }

      const client = await insert<Client>('clients', {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        notes: data.notes || null,
      });

      logger.info('Client created', { clientId: client.id, email: client.email });
      return client;
    } catch (error) {
      logger.error('Error creating client', error);
      throw error;
    }
  }

  /**
   * Update a client
   */
  async updateClient(id: string, data: UpdateClientRequest): Promise<Client | null> {
    try {
      const existingClient = await this.getClientById(id);
      if (!existingClient) {
        throw new Error('CLIENT_NOT_FOUND');
      }

      // If email is being updated, check if new email already exists
      if (data.email && data.email !== existingClient.email) {
        const emailExists = await query(
          'SELECT id FROM clients WHERE email = $1 AND id != $2',
          [data.email, id]
        );

        if (emailExists.rows.length > 0) {
          throw new Error('CLIENT_EMAIL_EXISTS: A client with this email already exists');
        }
      }

      const updatedClient = await update<Client>('clients', id, data);

      logger.info('Client updated', { clientId: id });
      return updatedClient;
    } catch (error) {
      logger.error('Error updating client', error);
      throw error;
    }
  }

  /**
   * Get client's booking history
   */
  async getClientBookings(clientId: string) {
    try {
      const result = await query(
        `SELECT * FROM bookings
         WHERE client_id = $1
         ORDER BY start_time DESC`,
        [clientId]
      );

      return result.rows;
    } catch (error) {
      logger.error('Error getting client bookings', error);
      throw error;
    }
  }

  /**
   * Archive a client
   */
  async archiveClient(id: string): Promise<Client | null> {
    try {
      const client = await this.updateClient(id, { archived: true });
      logger.info('Client archived', { clientId: id });
      return client;
    } catch (error) {
      logger.error('Error archiving client', error);
      throw error;
    }
  }

  /**
   * Unarchive a client
   */
  async unarchiveClient(id: string): Promise<Client | null> {
    try {
      const client = await this.updateClient(id, { archived: false });
      logger.info('Client unarchived', { clientId: id });
      return client;
    } catch (error) {
      logger.error('Error unarchiving client', error);
      throw error;
    }
  }
}

export const clientService = new ClientService();
export default clientService;
