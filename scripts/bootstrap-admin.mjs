import nextEnv from '@next/env';
import pg from 'pg';
nextEnv.loadEnvConfig(process.cwd());
const email=process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
const name=process.env.BOOTSTRAP_ADMIN_NAME?.trim();
const url=process.env.DATABASE_MIGRATION_URL;
if (!email || !name || !url || url.includes('CHANGE_ME')) throw new Error('Set BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_NAME and DATABASE_MIGRATION_URL locally.');
const db=new pg.Client({connectionString:url});
try {
  await db.connect();
  await db.query('BEGIN');
  await db.query('SELECT pg_advisory_xact_lock(71542827)');
  const {rows}=await db.query("SELECT count(*)::int AS count FROM euclide.users WHERE role='admin'");
  if (rows[0].count!==0) throw new Error('An admin already exists. Use the admin workflow for additional accounts.');
  await db.query("INSERT INTO euclide.users(name,email,role,status) VALUES ($1,$2,'admin','active')",[name,email]);
  await db.query('COMMIT');
  console.log('Initial whitelisted admin created.');
} catch(e) {
  await db.query('ROLLBACK').catch(()=>{});
  console.error('Bootstrap failed:',e instanceof Error ? e.message.replace(/postgres(?:ql)?:\/\/\S+/g,'[redacted]') : 'Unknown error');
  process.exitCode=1;
} finally {await db.end();}
