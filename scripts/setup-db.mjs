import nextEnv from '@next/env';
import pg from 'pg';
nextEnv.loadEnvConfig(process.cwd());
const value=process.env.DATABASE_MIGRATION_URL;
if (!value || value.includes('CHANGE_ME')) throw new Error('Fill DATABASE_MIGRATION_URL in .env.local.');
const target=new URL(value);
if (target.hostname!=='localhost' && target.hostname!=='127.0.0.1') throw new Error('db:setup only provisions the LOCAL database. Provision hosted databases in the provider dashboard.');
if (target.pathname!=='/euclide') throw new Error('Expected a dedicated database named euclide.');
target.pathname='/postgres';
const client=new pg.Client({connectionString:target.toString()});
try {
  await client.connect();
  const {rows}=await client.query("SELECT 1 FROM pg_database WHERE datname='euclide'");
  if (!rows.length) {await client.query('CREATE DATABASE euclide');console.log('Created local database euclide.');}
  else console.log('Database euclide already exists; no changes made.');
} catch(e) {console.error('Setup failed:', e instanceof Error ? e.message.replace(/postgres(?:ql)?:\/\/\S+/g,'[redacted]') : 'Unknown error'); process.exitCode=1;}
finally {await client.end();}
