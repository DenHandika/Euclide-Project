import { Pool, PoolClient } from 'pg';

export interface SqlClient {
  query<T extends Record<string, unknown> = Record<string, unknown>>(sql: string, values?: unknown[]): Promise<{ rows: T[] }>;
}
const dbGlobal = globalThis as typeof globalThis & { euclidePool?: Pool };
export function getPool(): Pool {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('CHANGE_ME')) {
    throw new Error('DATABASE_URL is not configured');
  }
  if (!dbGlobal.euclidePool) {
    dbGlobal.euclidePool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 20000,
    });
    dbGlobal.euclidePool.on('error', () => console.error('PostgreSQL pool connection error'));
  }
  return dbGlobal.euclidePool;
}
export async function transaction<T>(work: (client: SqlClient) => Promise<T>): Promise<T> {
  const client: PoolClient = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await work(client as SqlClient);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}
