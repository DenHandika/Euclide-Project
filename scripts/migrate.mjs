import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import pg from 'pg';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
const url = process.env.DATABASE_MIGRATION_URL;
if (!url || url.includes('CHANGE_ME')) throw new Error('Set DATABASE_MIGRATION_URL in .env.local first.');
const client = new pg.Client({connectionString:url});
try {
  await client.connect();
  await client.query('SELECT pg_advisory_lock(71542826)');
  await client.query('CREATE SCHEMA IF NOT EXISTS euclide');
  await client.query('CREATE TABLE IF NOT EXISTS euclide.schema_migrations (name text PRIMARY KEY, sha256 text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())');
  const files = (await readdir('database/migrations')).filter(f=>f.endsWith('.sql')).sort();
  for (const name of files) {
    const sql = await readFile(`database/migrations/${name}`, 'utf8');
    const sha256 = createHash('sha256').update(sql).digest('hex');
    const existing = await client.query('SELECT sha256 FROM euclide.schema_migrations WHERE name=$1',[name]);
    if (existing.rows.length) {
      if (existing.rows[0].sha256 !== sha256) throw new Error(`Applied migration changed: ${name}. Add a new migration instead.`);
      console.log(`Already applied: ${name}`);
      continue;
    }
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO euclide.schema_migrations(name,sha256) VALUES ($1,$2)',[name,sha256]);
      await client.query('COMMIT');
      console.log(`Applied: ${name}`);
    } catch(e) { await client.query('ROLLBACK'); throw e; }
  }
} catch(e) {
  console.error('Migration failed:', e instanceof Error ? e.message.replace(/postgres(?:ql)?:\/\/\S+/g,'[redacted]') : 'Unknown database error');
  process.exitCode=1;
} finally { await client.end(); }
