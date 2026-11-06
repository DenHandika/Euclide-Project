import nextEnv from '@next/env';
import { readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import pg from 'pg';

nextEnv.loadEnvConfig(process.cwd(), true);
console.log(`Node ${process.version}. This check does not print credentials or modify the database.`);
let failures = 0;
function report(ok, message) {
  console.log(`${ok ? 'OK' : 'MISSING/ERROR'}: ${message}`);
  if (!ok) failures++;
}
function configured(key) {
  const value = process.env[key];
  const valid = Boolean(value && !value.includes('CHANGE_ME'));
  report(valid, key);
  return valid;
}

for (const key of ['NEXTAUTH_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']) configured(key);
try {
  const origin = new URL(process.env.NEXTAUTH_URL);
  report(['localhost', '127.0.0.1'].includes(origin.hostname) && origin.port === '3000' && origin.protocol === 'http:',
    'NEXTAUTH_URL must match the local origin on port 3000');
} catch { report(false, 'NEXTAUTH_URL is missing or invalid'); }

for (const key of ['DATABASE_URL', 'DATABASE_MIGRATION_URL']) {
  if (!configured(key)) continue;
  let client;
  try {
    const connectionString = process.env[key];
    const target = new URL(connectionString);
    if (!['localhost', '127.0.0.1'].includes(target.hostname) || target.pathname !== '/euclide') {
      report(false, `${key}: local check only connects to localhost/127.0.0.1 database euclide`);
      continue;
    }
    client = new pg.Client({ connectionString, connectionTimeoutMillis: 3000, query_timeout: 5000 });
    await client.connect();
    await client.query('SELECT 1');
    report(true, `${key}: connected`);
    const { rows } = await client.query('SELECT name, sha256 FROM euclide.schema_migrations');
    const files = (await readdir('database/migrations')).filter(name => name.endsWith('.sql')).sort();
    for (const name of files) {
      const digest = createHash('sha256').update(await readFile(`database/migrations/${name}`, 'utf8')).digest('hex');
      report(rows.some(row => row.name === name && row.sha256 === digest), `${key}: migration ${name}`);
    }
    const admins = await client.query("SELECT EXISTS(SELECT 1 FROM euclide.users WHERE role='admin' AND status='active') AS ready");
    report(admins.rows[0].ready, `${key}: active admin exists`);
  } catch (error) {
    // PostgreSQL messages can contain connection details; expose only known error codes.
    const reasons = { '28P01': 'authentication failed', '3D000': 'database missing', '42P01': 'schema not migrated', ECONNREFUSED: 'server is not listening' };
    report(false, `${key}: ${reasons[error.code] ?? 'connection/query failed; check local PostgreSQL configuration'}`);
  } finally { await client?.end().catch(() => {}); }
}

console.log(failures ? `${failures} setup checks need attention. The demo UI can run without database/OAuth; persistent backend cannot.` : 'Local backend prerequisites are ready. Frontend API integration still needs verification.');
process.exitCode = failures ? 1 : 0;
