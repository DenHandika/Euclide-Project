import { createHash } from 'node:crypto';
import { SqlClient } from './db';
import { ApiError } from './errors';

function canonical(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map(key => `${JSON.stringify(key)}:${canonical(object[key])}`).join(',')}}`;
}
// Caller wraps this and its business mutation in the SAME transaction.
export async function idempotent<T>(db: SqlClient, actor: string, operation: string, key: string, payload: unknown, work: () => Promise<T>): Promise<T> {
  if (key.length < 8 || key.length > 128) throw new ApiError(400, 'invalid_key', 'Idempotency-Key harus 8–128 karakter.');
  const hash = createHash('sha256').update(canonical(payload)).digest('hex');
  await db.query(`INSERT INTO euclide.idempotency_requests(actor_id,operation,key,payload_sha256)
    VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`, [actor,operation,key,hash]);
  const { rows } = await db.query(`SELECT payload_sha256,response FROM euclide.idempotency_requests
    WHERE actor_id=$1 AND operation=$2 AND key=$3 FOR UPDATE`, [actor,operation,key]);
  if (rows[0].payload_sha256 !== hash) throw new ApiError(409,'key_reused','Key sudah digunakan untuk data yang berbeda.');
  if (rows[0].response !== null) return rows[0].response as T;
  const result = await work();
  await db.query(`UPDATE euclide.idempotency_requests SET response=$4::jsonb
    WHERE actor_id=$1 AND operation=$2 AND key=$3`,[actor,operation,key,JSON.stringify(result)]);
  return result;
}
