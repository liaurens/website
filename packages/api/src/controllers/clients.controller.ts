import { Request, Response } from 'express';
import { clientService } from '../services/client.service';
import { logger } from '../utils/logger';
import { createClientSchema, updateClientSchema } from '../utils/validators';
import { ErrorCode } from '@coaching-platform/shared';

/**
 * Get all clients
 */
export async function getAllClients(req: Request, res: Response) {
  try {
    const includeArchived = req.query.includeArchived === 'true';

    const clients = await clientService.getAllClients(includeArchived);

    res.json({
      success: true,
      data: clients,
    });
  } catch (error: any) {
    logger.error('Error in getAllClients', error);
    res.status(500).json({
      error: {
        code: ErrorCode.SERVER_ERROR,
        message: 'Failed to get clients',
      },
    });
  }
}

/**
 * Get a single client by ID
 */
export async function getClientById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const includeStats = req.query.stats === 'true';

    let client;
    if (includeStats) {
      client = await clientService.getClientWithStats(id);
    } else {
      client = await clientService.getClientById(id);
    }

    if (!client) {
      return res.status(404).json({
        error: {
          code: ErrorCode.NOT_FOUND,
          message: 'Client not found',
        },
      });
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error: any) {
    logger.error('Error in getClientById', error);
    res.status(500).json({
      error: {
        code: ErrorCode.SERVER_ERROR,
        message: 'Failed to get client',
      },
    });
  }
}

/**
 * Create a new client
 */
export async function createClient(req: Request, res: Response) {
  try {
    const validation = createClientSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: {
          code: ErrorCode.VALIDATION_MISSING_FIELD,
          message: 'Invalid client data',
          details: validation.error.errors,
        },
      });
    }

    const client = await clientService.createClient(validation.data);

    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error: any) {
    logger.error('Error in createClient', error);

    if (error.message?.includes('EMAIL_EXISTS')) {
      return res.status(409).json({
        error: {
          code: ErrorCode.VALIDATION_INVALID_EMAIL,
          message: 'A client with this email already exists',
        },
      });
    }

    res.status(500).json({
      error: {
        code: ErrorCode.SERVER_ERROR,
        message: 'Failed to create client',
      },
    });
  }
}

/**
 * Update a client
 */
export async function updateClient(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validation = updateClientSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: {
          code: ErrorCode.VALIDATION_MISSING_FIELD,
          message: 'Invalid client data',
          details: validation.error.errors,
        },
      });
    }

    const client = await clientService.updateClient(id, validation.data);

    if (!client) {
      return res.status(404).json({
        error: {
          code: ErrorCode.NOT_FOUND,
          message: 'Client not found',
        },
      });
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error: any) {
    logger.error('Error in updateClient', error);

    if (error.message?.includes('EMAIL_EXISTS')) {
      return res.status(409).json({
        error: {
          code: ErrorCode.VALIDATION_INVALID_EMAIL,
          message: 'A client with this email already exists',
        },
      });
    }

    if (error.message?.includes('NOT_FOUND')) {
      return res.status(404).json({
        error: {
          code: ErrorCode.NOT_FOUND,
          message: 'Client not found',
        },
      });
    }

    res.status(500).json({
      error: {
        code: ErrorCode.SERVER_ERROR,
        message: 'Failed to update client',
      },
    });
  }
}

/**
 * Get client's bookings
 */
export async function getClientBookings(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const bookings = await clientService.getClientBookings(id);

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    logger.error('Error in getClientBookings', error);
    res.status(500).json({
      error: {
        code: ErrorCode.SERVER_ERROR,
        message: 'Failed to get client bookings',
      },
    });
  }
}

/**
 * Archive a client
 */
export async function archiveClient(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const client = await clientService.archiveClient(id);

    if (!client) {
      return res.status(404).json({
        error: {
          code: ErrorCode.NOT_FOUND,
          message: 'Client not found',
        },
      });
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error: any) {
    logger.error('Error in archiveClient', error);
    res.status(500).json({
      error: {
        code: ErrorCode.SERVER_ERROR,
        message: 'Failed to archive client',
      },
    });
  }
}

/**
 * Unarchive a client
 */
export async function unarchiveClient(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const client = await clientService.unarchiveClient(id);

    if (!client) {
      return res.status(404).json({
        error: {
          code: ErrorCode.NOT_FOUND,
          message: 'Client not found',
        },
      });
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error: any) {
    logger.error('Error in unarchiveClient', error);
    res.status(500).json({
      error: {
        code: ErrorCode.SERVER_ERROR,
        message: 'Failed to unarchive client',
      },
    });
  }
}
