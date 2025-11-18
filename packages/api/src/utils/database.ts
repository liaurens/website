import { Pool, QueryResult } from 'pg';
import { config } from 'dotenv';

// Load environment variables
config();

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test the connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle database client', err);
  process.exit(-1);
});

/**
 * Execute a SQL query
 * @param text - SQL query text
 * @param params - Query parameters
 * @returns Query result
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;

    // Log query for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text, duration, rows: result.rowCount });
    }

    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient() {
  const client = await pool.connect();
  return client;
}

/**
 * Close the pool (useful for graceful shutdown)
 */
export async function closePool() {
  await pool.end();
  console.log('Database pool closed');
}

// Helper functions for common operations

/**
 * Find a single record by ID
 */
export async function findById<T = any>(
  table: string,
  id: string
): Promise<T | null> {
  const result = await query<T>(
    `SELECT * FROM ${table} WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

/**
 * Find all records from a table
 */
export async function findAll<T = any>(
  table: string,
  orderBy: string = 'created_at DESC'
): Promise<T[]> {
  const result = await query<T>(
    `SELECT * FROM ${table} ORDER BY ${orderBy}`
  );
  return result.rows;
}

/**
 * Insert a new record
 */
export async function insert<T = any>(
  table: string,
  data: Record<string, any>
): Promise<T> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  const columns = keys.join(', ');

  const result = await query<T>(
    `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  return result.rows[0];
}

/**
 * Update a record by ID
 */
export async function update<T = any>(
  table: string,
  id: string,
  data: Record<string, any>
): Promise<T | null> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');

  const result = await query<T>(
    `UPDATE ${table} SET ${setClause} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return result.rows[0] || null;
}

/**
 * Delete a record by ID
 */
export async function deleteById(
  table: string,
  id: string
): Promise<boolean> {
  const result = await query(
    `DELETE FROM ${table} WHERE id = $1`,
    [id]
  );
  return (result.rowCount ?? 0) > 0;
}

export default pool;
