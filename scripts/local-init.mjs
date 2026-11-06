import { readFile, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';

const template = await readFile('.env.example', 'utf8');
const content = template.replace('CHANGE_ME_GENERATE_RANDOM_SECRET', randomBytes(48).toString('base64url'));
try {
  await writeFile('.env.local', content, { flag: 'wx', mode: 0o600 });
  console.log('Created .env.local with a random auth secret. Fill database and Google settings locally.');
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.log('.env.local already exists; no settings changed.');
}
